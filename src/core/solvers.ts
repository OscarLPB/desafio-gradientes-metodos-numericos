import { MatrixOps } from './matrix';
import { IterationStep, PreconditionerType, SolverResult } from './types';

export class ConjugateGradientSolvers {
  /**
   * Solve M * z = r for various preconditioners
   */
  private static solvePreconditioner(
    A: number[][],
    r: number[],
    type: PreconditionerType
  ): number[] {
    const n = A.length;
    if (type === 'none') {
      return [...r];
    }

    if (type === 'jacobi') {
      // Jacobi Preconditioner: M = diag(A) => z_i = r_i / a_ii
      const z: number[] = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        const diag = A[i][i];
        if (Math.abs(diag) < 1e-12) {
          z[i] = r[i];
        } else {
          z[i] = r[i] / diag;
        }
      }
      return z;
    }

    if (type === 'ssor') {
      // SSOR Preconditioner (Symmetric Successive Over-Relaxation) with omega = 1.0
      // M = (D + L) * D^(-1) * (D + L^T)
      const omega = 1.0;
      const v: number[] = new Array(n).fill(0);

      // Forward step: (D / omega + L) * v = r
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += A[i][j] * v[j];
        }
        const diag = A[i][i] / omega;
        v[i] = (r[i] - sum) / (Math.abs(diag) < 1e-12 ? 1 : diag);
      }

      // Intermediate scale: rhs = (2 - omega) * D * v
      const rhs: number[] = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        rhs[i] = (2 - omega) * A[i][i] * v[i];
      }

      // Backward step: (D / omega + L^T) * z = rhs
      const z: number[] = new Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
          sum += A[j][i] * z[j]; // L^T[i][j] = A[j][i]
        }
        const diag = A[i][i] / omega;
        z[i] = (rhs[i] - sum) / (Math.abs(diag) < 1e-12 ? 1 : diag);
      }
      return z;
    }

    return [...r];
  }

  /**
   * Standard Conjugate Gradient (GC simple, sin precondicionar)
   * Serves as parallel contrast benchmark.
   */
  static solveGC(
    A: number[][],
    b: number[],
    x0?: number[],
    tol = 1e-6,
    maxIter = 100
  ): SolverResult {
    const startTime = performance.now();
    const n = A.length;
    let x = x0 ? [...x0] : new Array(n).fill(0);

    // Initial residual: r0 = b - A * x0
    const Ax0 = MatrixOps.matVecMul(A, x);
    let r = MatrixOps.vecSub(b, Ax0);
    let p = [...r]; // Initial direction p0 = r0

    const bNorm = MatrixOps.norm2(b);
    const denomNorm = bNorm < 1e-12 ? 1 : bNorm;
    let rNorm = MatrixOps.norm2(r);
    let relResidual = rNorm / denomNorm;

    const history: IterationStep[] = [
      {
        iteration: 0,
        x: [...x],
        residualNorm: rNorm,
        relativeResidual: relResidual,
      },
    ];

    if (relResidual < tol) {
      return {
        converged: true,
        iterations: 0,
        x,
        finalResidualNorm: rNorm,
        finalRelativeResidual: relResidual,
        history,
        executionTimeMs: performance.now() - startTime,
        methodName: 'Gradientes Conjugados Estándar (GC)',
      };
    }

    let converged = false;
    let iter = 0;

    for (iter = 1; iter <= maxIter; iter++) {
      const Ap = MatrixOps.matVecMul(A, p);
      const pAp = MatrixOps.dot(p, Ap);

      if (Math.abs(pAp) < 1e-15) {
        // Degenerate direction
        break;
      }

      const rDotR = MatrixOps.dot(r, r);
      const alpha = rDotR / pAp;

      // x_{k+1} = x_k + alpha * p_k
      x = MatrixOps.vecAdd(x, MatrixOps.vecScale(alpha, p));

      // r_{k+1} = r_k - alpha * A * p_k
      const rNew = MatrixOps.vecSub(r, MatrixOps.vecScale(alpha, Ap));

      rNorm = MatrixOps.norm2(rNew);
      relResidual = rNorm / denomNorm;

      const rNewDotRNew = MatrixOps.dot(rNew, rNew);
      const beta = rNewDotRNew / rDotR;

      history.push({
        iteration: iter,
        x: [...x],
        residualNorm: rNorm,
        relativeResidual: relResidual,
        alpha,
        beta,
      });

      if (relResidual < tol) {
        converged = true;
        r = rNew;
        break;
      }

      // p_{k+1} = r_{k+1} + beta * p_k
      p = MatrixOps.vecAdd(rNew, MatrixOps.vecScale(beta, p));
      r = rNew;
    }

    return {
      converged,
      iterations: iter > maxIter ? maxIter : iter,
      x,
      finalResidualNorm: rNorm,
      finalRelativeResidual: relResidual,
      history,
      executionTimeMs: performance.now() - startTime,
      methodName: 'Gradientes Conjugados Estándar (GC)',
    };
  }

  /**
   * Preconditioned Conjugate Gradient (GCP - Algoritmo Suñagua 2020)
   *
   * Algoritmo:
   * 1. Elegir x0, calcular r0 = b - A*x0
   * 2. Resolver M * z0 = r0
   * 3. p0 = z0
   * 4. Para k = 0, 1, 2, ...
   *    q_k = A * p_k
   *    alpha_k = (r_k^T * z_k) / (p_k^T * q_k)
   *    x_{k+1} = x_k + alpha_k * p_k
   *    r_{k+1} = r_k - alpha_k * q_k
   *    verificar convergencia: ||r_{k+1}||_2 / ||b||_2 < tol
   *    resolver M * z_{k+1} = r_{k+1}
   *    beta_k = (r_{k+1}^T * z_{k+1}) / (r_k^T * z_k)
   *    p_{k+1} = z_{k+1} + beta_k * p_k
   */
  static solveGCP(
    A: number[][],
    b: number[],
    x0?: number[],
    tol = 1e-6,
    maxIter = 100,
    preconditioner: PreconditionerType = 'jacobi'
  ): SolverResult {
    const startTime = performance.now();
    const n = A.length;
    let x = x0 ? [...x0] : new Array(n).fill(0);

    // Initial residual: r0 = b - A * x0
    const Ax0 = MatrixOps.matVecMul(A, x);
    let r = MatrixOps.vecSub(b, Ax0);

    const bNorm = MatrixOps.norm2(b);
    const denomNorm = bNorm < 1e-12 ? 1 : bNorm;
    let rNorm = MatrixOps.norm2(r);
    let relResidual = rNorm / denomNorm;

    const history: IterationStep[] = [
      {
        iteration: 0,
        x: [...x],
        residualNorm: rNorm,
        relativeResidual: relResidual,
      },
    ];

    if (relResidual < tol) {
      return {
        converged: true,
        iterations: 0,
        x,
        finalResidualNorm: rNorm,
        finalRelativeResidual: relResidual,
        history,
        executionTimeMs: performance.now() - startTime,
        methodName: `Gradientes Conjugados Precondicionado (GCP - ${preconditioner.toUpperCase()})`,
      };
    }

    // Solve M * z0 = r0
    let z = this.solvePreconditioner(A, r, preconditioner);
    let p = [...z]; // p0 = z0
    let rDotZ = MatrixOps.dot(r, z);

    let converged = false;
    let iter = 0;

    for (iter = 1; iter <= maxIter; iter++) {
      const q = MatrixOps.matVecMul(A, p);
      const pDotQ = MatrixOps.dot(p, q);

      if (Math.abs(pDotQ) < 1e-15) {
        break; // Breakdown
      }

      const alpha = rDotZ / pDotQ;

      // x_{k+1} = x_k + alpha * p_k
      x = MatrixOps.vecAdd(x, MatrixOps.vecScale(alpha, p));

      // r_{k+1} = r_k - alpha * q_k
      const rNew = MatrixOps.vecSub(r, MatrixOps.vecScale(alpha, q));

      rNorm = MatrixOps.norm2(rNew);
      relResidual = rNorm / denomNorm;

      history.push({
        iteration: iter,
        x: [...x],
        residualNorm: rNorm,
        relativeResidual: relResidual,
        alpha,
      });

      if (relResidual < tol) {
        converged = true;
        r = rNew;
        break;
      }

      // Solve M * z_{k+1} = r_{k+1}
      const zNew = this.solvePreconditioner(A, rNew, preconditioner);
      const rNewDotZNew = MatrixOps.dot(rNew, zNew);

      const beta = rNewDotZNew / rDotZ;
      history[history.length - 1].beta = beta;

      // p_{k+1} = z_{k+1} + beta * p_k
      p = MatrixOps.vecAdd(zNew, MatrixOps.vecScale(beta, p));

      r = rNew;
      z = zNew;
      rDotZ = rNewDotZNew;
    }

    return {
      converged,
      iterations: iter > maxIter ? maxIter : iter,
      x,
      finalResidualNorm: rNorm,
      finalRelativeResidual: relResidual,
      history,
      executionTimeMs: performance.now() - startTime,
      methodName: `Gradientes Conjugados Precondicionado (GCP - ${preconditioner.toUpperCase()})`,
    };
  }
}
