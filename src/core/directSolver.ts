import { MatrixOps } from './matrix';

export class DirectSolver {
  /**
   * Cholesky Decomposition Solver: A = L * L^T
   * For Symmetric Positive Definite matrices.
   * Provides the official "Solución numérica de referencia" (Solución exacta).
   */
  static solveCholesky(A: number[][], b: number[]): { x: number[]; L: number[][] } {
    const n = A.length;
    const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    // Compute Cholesky factor L
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }

        if (i === j) {
          const val = A[i][i] - sum;
          if (val <= 0) {
            throw new Error(`La matriz no es definida positiva en el pivote (${i}, ${i}): valor = ${val}`);
          }
          L[i][j] = Math.sqrt(val);
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }
      }
    }

    // Forward substitution: L * y = b
    const y: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * y[k];
      }
      y[i] = (b[i] - sum) / L[i][i];
    }

    // Backward substitution: L^T * x = y
    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let k = i + 1; k < n; k++) {
        sum += L[k][i] * x[k]; // L^T[i][k] = L[k][i]
      }
      x[i] = (y[i] - sum) / L[i][i];
    }

    return { x, L };
  }

  /**
   * Gaussian Elimination with Partial Pivoting (Fallback direct solver)
   */
  static solveGauss(A: number[][], b: number[]): number[] {
    const n = A.length;
    const M = MatrixOps.cloneMatrix(A);
    const B = [...b];

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

      if (maxVal < 1e-14) {
        throw new Error('El sistema es singular o casi singular; no tiene solución única.');
      }

      if (maxRow !== i) {
        const tmpRow = M[i];
        M[i] = M[maxRow];
        M[maxRow] = tmpRow;

        const tmpB = B[i];
        B[i] = B[maxRow];
        B[maxRow] = tmpB;
      }

      for (let r = i + 1; r < n; r++) {
        const factor = M[r][i] / M[i][i];
        for (let c = i; c < n; c++) {
          M[r][c] -= factor * M[i][c];
        }
        B[r] -= factor * B[i];
      }
    }

    // Back substitution
    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let c = i + 1; c < n; c++) {
        sum += M[i][c] * x[c];
      }
      x[i] = (B[i] - sum) / M[i][i];
    }

    return x;
  }
}
