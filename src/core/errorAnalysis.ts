import { MatrixOps } from './matrix';
import { ErrorMetrics } from './types';

export class ErrorAnalysis {
  /**
   * Calculates component-wise absolute, relative and percentage errors
   * according to Section 6.4 of the academic challenge.
   */
  static calculateErrors(
    xRef: number[],
    xApprox: number[],
    variableNames: string[]
  ): ErrorMetrics[] {
    const n = xRef.length;
    const metrics: ErrorMetrics[] = [];

    for (let i = 0; i < n; i++) {
      const exact = xRef[i];
      const approx = xApprox[i];
      const absoluteError = Math.abs(exact - approx);

      let relativeError: number | null = null;
      let percentError: number | null = null;

      if (Math.abs(exact) > 1e-14) {
        relativeError = absoluteError / Math.abs(exact);
        percentError = relativeError * 100;
      }

      metrics.push({
        variableName: variableNames[i] || `x_${i + 1}`,
        exact,
        approx,
        absoluteError,
        relativeError,
        percentError,
      });
    }

    return metrics;
  }

  /**
   * Calculates global relative residual: ||b - A * x||_2 / ||b||_2
   */
  static globalRelativeResidual(A: number[][], b: number[], x: number[]): number {
    const Ax = MatrixOps.matVecMul(A, x);
    const residual = MatrixOps.vecSub(b, Ax);
    const rNorm = MatrixOps.norm2(residual);
    const bNorm = MatrixOps.norm2(b);
    return bNorm > 1e-14 ? rNorm / bNorm : rNorm;
  }
}
