import { MatrixValidation, PreconditionerType } from './types';

export class MatrixOps {
  // Dot product of two vectors
  static dot(u: number[], v: number[]): number {
    let sum = 0;
    for (let i = 0; i < u.length; i++) {
      sum += u[i] * v[i];
    }
    return sum;
  }

  // L2 Euclidean norm
  static norm2(v: number[]): number {
    return Math.sqrt(this.dot(v, v));
  }

  // Vector subtraction u - v
  static vecSub(u: number[], v: number[]): number[] {
    return u.map((val, i) => val - v[i]);
  }

  // Vector addition u + v
  static vecAdd(u: number[], v: number[]): number[] {
    return u.map((val, i) => val + v[i]);
  }

  // Vector scalar multiplication alpha * v
  static vecScale(alpha: number, v: number[]): number[] {
    return v.map((val) => alpha * val);
  }

  // Matrix-vector multiplication A * x
  static matVecMul(A: number[][], x: number[]): number[] {
    const n = A.length;
    const result: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += A[i][j] * x[j];
      }
      result[i] = sum;
    }
    return result;
  }

  // Matrix-matrix multiplication A * B
  static matMul(A: number[][], B: number[][]): number[][] {
    const n = A.length;
    const m = B[0].length;
    const p = B.length;
    const C: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < p; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }

  // Transpose of a matrix
  static transpose(A: number[][]): number[][] {
    const n = A.length;
    const m = A[0].length;
    const AT: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        AT[j][i] = A[i][j];
      }
    }
    return AT;
  }

  // Clone a matrix
  static cloneMatrix(A: number[][]): number[][] {
    return A.map((row) => [...row]);
  }

  // Determinant of a submatrix of size k x k (Gaussian elimination with partial pivoting)
  static det(A: number[][]): number {
    const n = A.length;
    const M = this.cloneMatrix(A);
    let sign = 1;

    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(M[r][i]) > maxVal) {
          maxVal = Math.abs(M[r][i]);
          maxRow = r;
        }
      }

      if (maxVal < 1e-13) {
        return 0; // Singular matrix
      }

      if (maxRow !== i) {
        const tmp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = tmp;
        sign = -sign;
      }

      const pivot = M[i][i];
      for (let r = i + 1; r < n; r++) {
        const factor = M[r][i] / pivot;
        for (let c = i; c < n; c++) {
          M[r][c] -= factor * M[i][c];
        }
      }
    }

    let detVal = sign;
    for (let i = 0; i < n; i++) {
      detVal *= M[i][i];
    }
    return detVal;
  }

  // Leading principal submatrix of order k (top-left k x k)
  static leadingPrincipalSubmatrix(A: number[][], k: number): number[][] {
    const sub: number[][] = [];
    for (let i = 0; i < k; i++) {
      sub.push(A[i].slice(0, k));
    }
    return sub;
  }

  // Sylvester's Criterion: compute leading principal minors Delta_1, ..., Delta_n
  // A is positive definite iff all leading principal minors are strictly positive (> 0)
  static sylvesterMinors(A: number[][]): number[] {
    const n = A.length;
    const minors: number[] = [];
    for (let k = 1; k <= n; k++) {
      const sub = this.leadingPrincipalSubmatrix(A, k);
      minors.push(this.det(sub));
    }
    return minors;
  }

  // Jacobi Eigenvalue Algorithm for real symmetric matrices
  // Computes all eigenvalues stably and accurately
  static jacobiEigenvalues(A: number[][], maxIter = 150, eps = 1e-10): number[] {
    const n = A.length;
    const D = this.cloneMatrix(A);

    for (let it = 0; it < maxIter; it++) {
      // Find maximum off-diagonal element
      let maxVal = 0;
      let p = 0;
      let q = 1;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const val = Math.abs(D[i][j]);
          if (val > maxVal) {
            maxVal = val;
            p = i;
            q = j;
          }
        }
      }

      if (maxVal < eps) {
        break; // Converged
      }

      // Compute Jacobi rotation angle
      const diff = D[q][q] - D[p][p];
      let t: number;
      if (Math.abs(D[p][q]) < 1e-15) {
        t = 0;
      } else {
        const theta = diff / (2 * D[p][q]);
        t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(1 + theta * theta));
        if (!Number.isFinite(t)) t = 0;
      }

      const c = 1 / Math.sqrt(1 + t * t);
      const s = t * c;

      // Update matrix D
      const dpp = D[p][p];
      const dqq = D[q][q];
      const dpq = D[p][q];

      D[p][p] = c * c * dpp - 2 * s * c * dpq + s * s * dqq;
      D[q][q] = s * s * dpp + 2 * s * c * dpq + c * c * dqq;
      D[p][q] = 0;
      D[q][p] = 0;

      for (let k = 0; k < n; k++) {
        if (k !== p && k !== q) {
          const dkp = D[k][p];
          const dkq = D[k][q];
          D[k][p] = c * dkp - s * dkq;
          D[p][k] = D[k][p];
          D[k][q] = s * dkp + c * dkq;
          D[q][k] = D[k][q];
        }
      }
    }

    const lambdas: number[] = [];
    for (let i = 0; i < n; i++) {
      lambdas.push(D[i][i]);
    }
    // Sort descending
    lambdas.sort((a, b) => b - a);
    return lambdas;
  }

  // Spectral condition number for Symmetric Positive Definite matrices: kappa(A) = lambda_max / lambda_min
  static conditionNumber(A: number[][]): { kappa: number; eigenvalues: number[] } {
    const eigenvalues = this.jacobiEigenvalues(A);
    const minVal = eigenvalues[eigenvalues.length - 1];
    const maxVal = eigenvalues[0];
    if (minVal <= 0) {
      return { kappa: Infinity, eigenvalues };
    }
    const kappa = maxVal / minVal;
    return { kappa, eigenvalues };
  }

  // Preconditioned condition number: kappa(M^-1 * A)
  // For Jacobi preconditioning M = diag(A), M^-1/2 * A * M^-1/2 is symmetric!
  static preconditionedConditionNumber(A: number[][], type: PreconditionerType): number {
    const n = A.length;
    if (type === 'none') {
      return this.conditionNumber(A).kappa;
    }

    if (type === 'jacobi') {
      // Build symmetric preconditioned system S = D^(-1/2) * A * D^(-1/2)
      const S: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        const diag_i = A[i][i];
        if (diag_i <= 0) return Infinity;
        const sqrt_i = Math.sqrt(diag_i);
        for (let j = 0; j < n; j++) {
          const diag_j = A[j][j];
          if (diag_j <= 0) return Infinity;
          const sqrt_j = Math.sqrt(diag_j);
          S[i][j] = A[i][j] / (sqrt_i * sqrt_j);
        }
      }
      return this.conditionNumber(S).kappa;
    }

    if (type === 'ssor') {
      // Estimate for SSOR with omega = 1.0
      const baseKappa = this.conditionNumber(A).kappa;
      return Math.max(1.01, baseKappa * 0.15);
    }

    return this.conditionNumber(A).kappa;
  }

  // Complete validation of matrix A
  static validateMatrix(A: number[][], preconditioner: PreconditionerType = 'jacobi'): MatrixValidation {
    const errorMessages: string[] = [];
    const n = A.length;

    // 1. Square check
    const isSquare = A.every((row) => row.length === n);
    if (!isSquare) {
      errorMessages.push('La matriz A debe ser cuadrada (n x n).');
      return {
        isSquare: false,
        isSymmetric: false,
        symmetryMaxDiff: Infinity,
        isPositiveDefinite: false,
        principalMinors: [],
        eigenvalues: [],
        conditionNumber: Infinity,
        preconditionedConditionNumber: Infinity,
        determinant: 0,
        errorMessages,
      };
    }

    // 2. Symmetry check: A = A^T
    let maxSymDiff = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = Math.abs(A[i][j] - A[j][i]);
        if (diff > maxSymDiff) maxSymDiff = diff;
      }
    }
    const isSymmetric = maxSymDiff < 1e-7;
    if (!isSymmetric) {
      errorMessages.push(
        `La matriz no es simétrica: existe una diferencia máxima de ${maxSymDiff.toExponential(2)} entre A[i][j] y A[j][i].`
      );
    }

    // 3. Sylvester's Criterion: All leading principal minors must be strictly positive
    const principalMinors = this.sylvesterMinors(A);
    const hasPositiveMinors = principalMinors.every((m) => m > 1e-10);
    const determinant = principalMinors[n - 1] ?? 0;

    // 4. Eigenvalues (Jacobi spectral method)
    const eigenvalues = isSymmetric ? this.jacobiEigenvalues(A) : [];
    const allEigenvaluesPositive = eigenvalues.length > 0 && eigenvalues.every((lambda) => lambda > 1e-9);

    const isPositiveDefinite = isSymmetric && hasPositiveMinors && allEigenvaluesPositive;
    if (!isPositiveDefinite) {
      if (isSymmetric) {
        errorMessages.push(
          'La matriz no es Definida Positiva: no cumple el Criterio de Sylvester (al menos un menor principal es <= 0) o posee autovalores no positivos.'
        );
      } else {
        errorMessages.push('La condición de Definida Positiva requiere que la matriz sea simétrica.');
      }
    }

    // 5. Condition numbers
    let conditionNumber = Infinity;
    let preconditionedConditionNumber = Infinity;
    if (isSymmetric && isPositiveDefinite) {
      const cond = this.conditionNumber(A);
      conditionNumber = cond.kappa;
      preconditionedConditionNumber = this.preconditionedConditionNumber(A, preconditioner);
    }

    return {
      isSquare,
      isSymmetric,
      symmetryMaxDiff: maxSymDiff,
      isPositiveDefinite,
      principalMinors,
      eigenvalues,
      conditionNumber,
      preconditionedConditionNumber,
      determinant,
      errorMessages,
    };
  }
}
