export type PreconditionerType = 'jacobi' | 'ssor' | 'none';

export interface IterationStep {
  iteration: number;
  x: number[];
  residualNorm: number;
  relativeResidual: number;
  alpha?: number;
  beta?: number;
}

export interface SolverResult {
  converged: boolean;
  iterations: number;
  x: number[];
  finalResidualNorm: number;
  finalRelativeResidual: number;
  history: IterationStep[];
  executionTimeMs: number;
  methodName: string;
}

export interface ErrorMetrics {
  variableName: string;
  exact: number;
  approx: number;
  absoluteError: number;
  relativeError: number | null; // null if exact is 0
  percentError: number | null;
}

export interface MatrixValidation {
  isSquare: boolean;
  isSymmetric: boolean;
  symmetryMaxDiff: number;
  isPositiveDefinite: boolean;
  principalMinors: number[];
  eigenvalues: number[];
  conditionNumber: number;
  preconditionedConditionNumber: number;
  determinant: number;
  errorMessages: string[];
}

export interface FinancialScenario {
  id: 'ideal' | 'stress' | 'ill_conditioned';
  name: string;
  tagline: string;
  description: string;
  financialContext: string;
  mathematicalRationale: string;
  variableNames: string[];
  variableDescriptions: string[];
  A: number[][];
  b: number[];
  recommendedPreconditioner: PreconditionerType;
}

export interface QATestCase {
  id: number;
  title: string;
  description: string;
  inputDescription: string;
  expectedOutput: string;
  obtainedOutput?: string;
  passed?: boolean;
  conclusion?: string;
  runTest: () => { obtained: string; passed: boolean; conclusion: string };
}
