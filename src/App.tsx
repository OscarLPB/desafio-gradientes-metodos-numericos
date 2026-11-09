import React, { useMemo, useState } from 'react';
import { CaseStudy } from './components/CaseStudy';
import { ComparativeTable } from './components/ComparativeTable';
import { ConclusionsView } from './components/ConclusionsView';
import { ConvergenceView } from './components/ConvergenceView';
import { DirectSolutionView } from './components/DirectSolutionView';
import { ErrorAnalysisView } from './components/ErrorAnalysisView';
import { Header } from './components/Header';
import { MatrixEditor } from './components/MatrixEditor';
import { Navigation } from './components/Navigation';
import { QAModuleView } from './components/QAModuleView';
import { DirectSolver } from './core/directSolver';
import { ErrorAnalysis } from './core/errorAnalysis';
import { MatrixOps } from './core/matrix';
import { ConjugateGradientSolvers } from './core/solvers';
import { PreconditionerType } from './core/types';
import { SOFTWARE_FINANCIAL_SCENARIOS } from './data/scenarios';

export const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<
    'ideal' | 'stress' | 'ill_conditioned' | 'custom'
  >('ideal');

  const [A, setA] = useState<number[][]>(() =>
    SOFTWARE_FINANCIAL_SCENARIOS[0].A.map((r) => [...r])
  );
  const [b, setB] = useState<number[]>(() => [...SOFTWARE_FINANCIAL_SCENARIOS[0].b]);
  const [x0, setX0] = useState<number[]>([0, 0, 0, 0]);
  const [tolerance, setTolerance] = useState<number>(1e-6);
  const [maxIterations] = useState<number>(100);
  const [preconditioner, setPreconditioner] = useState<PreconditionerType>('jacobi');
  const [activeSection, setActiveSection] = useState<string>('case-study');

  // Real-time Matrix Validation (Symmetry, Sylvester, Eigenvalues, Condition)
  const validation = useMemo(() => {
    return MatrixOps.validateMatrix(A, preconditioner);
  }, [A, preconditioner]);

  // Current Scenario metadata (or fallback)
  const currentScenario = useMemo(() => {
    return (
      SOFTWARE_FINANCIAL_SCENARIOS.find((sc) => sc.id === activeScenarioId) ||
      SOFTWARE_FINANCIAL_SCENARIOS[0]
    );
  }, [activeScenarioId]);

  // Direct Numerical Reference Solution (Cholesky / Gauss fallback)
  const directResult = useMemo(() => {
    if (!validation.isSquare) return { x: null, L: null, error: 'Matriz no cuadrada' };
    try {
      const { x, L } = DirectSolver.solveCholesky(A, b);
      return { x, L, error: null };
    } catch (err: unknown) {
      try {
        const xGauss = DirectSolver.solveGauss(A, b);
        return {
          x: xGauss,
          L: null,
          error: `Cholesky falló (no es definida positiva). Se aplicó Gauss-Jordan como alternativa: ${(err as Error).message}`,
        };
      } catch (gaussErr: unknown) {
        return {
          x: null,
          L: null,
          error: `Error irrecuperable en métodos directos: ${(gaussErr as Error).message}`,
        };
      }
    }
  }, [A, b, validation.isSquare]);

  // Conjugate Gradient Solvers (GC vs GCP Suñagua 2020)
  const { gcResult, gcpResult } = useMemo(() => {
    if (!validation.isSquare) return { gcResult: null, gcpResult: null };

    const gc = ConjugateGradientSolvers.solveGC(A, b, x0, tolerance, maxIterations);
    const gcp = ConjugateGradientSolvers.solveGCP(
      A,
      b,
      x0,
      tolerance,
      maxIterations,
      preconditioner
    );

    return { gcResult: gc, gcpResult: gcp };
  }, [A, b, x0, tolerance, maxIterations, preconditioner, validation.isSquare]);

  // Error Analysis metrics (Ea, Er, Ep)
  const errorMetrics = useMemo(() => {
    if (!directResult.x || !gcpResult) return [];
    return ErrorAnalysis.calculateErrors(
      directResult.x,
      gcpResult.x,
      currentScenario.variableNames
    );
  }, [directResult.x, gcpResult, currentScenario.variableNames]);

  // Global Relative Residual ||b - A*x_GCP|| / ||b||
  const globalResidual = useMemo(() => {
    if (!gcpResult) return 0;
    return ErrorAnalysis.globalRelativeResidual(A, b, gcpResult.x);
  }, [A, b, gcpResult]);

  // Handlers
  const handleScenarioChange = (id: 'ideal' | 'stress' | 'ill_conditioned') => {
    const sc = SOFTWARE_FINANCIAL_SCENARIOS.find((s) => s.id === id);
    if (sc) {
      setActiveScenarioId(id);
      setA(sc.A.map((row) => [...row]));
      setB([...sc.b]);
      setX0([0, 0, 0, 0]);
      setPreconditioner(sc.recommendedPreconditioner);
    }
  };

  const handleMatrixChange = (newA: number[][]) => {
    setActiveScenarioId('custom');
    setA(newA);
  };

  const handleVectorBChange = (newB: number[]) => {
    setActiveScenarioId('custom');
    setB(newB);
  };

  const handleReset = () => {
    const baseId = activeScenarioId === 'custom' ? 'ideal' : activeScenarioId;
    handleScenarioChange(baseId as 'ideal' | 'stress' | 'ill_conditioned');
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Módulo 1: Portada Académica & Cabecera */}
      <Header />

      {/* Barra de Navegación Sticky */}
      <Navigation activeSection={activeSection} onSelectSection={handleSelectSection} />

      {/* Main Content Sections Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1 w-full">
        {/* Módulos 2 & 3: Caso Financiero I+D & Formulación Matemática */}
        <CaseStudy />

        {/* Módulos 4 & 5: Editor Matricial & Carga de Escenarios */}
        <MatrixEditor
          activeScenarioId={activeScenarioId}
          A={A}
          b={b}
          x0={x0}
          tolerance={tolerance}
          maxIterations={maxIterations}
          preconditioner={preconditioner}
          validation={validation}
          onScenarioChange={handleScenarioChange}
          onMatrixChange={handleMatrixChange}
          onVectorBChange={handleVectorBChange}
          onVectorX0Change={setX0}
          onToleranceChange={setTolerance}
          onPreconditionerChange={setPreconditioner}
          onReset={handleReset}
        />

        {/* Módulo 6: Solución Numérica de Referencia (Cholesky) */}
        <DirectSolutionView
          xRef={directResult.x}
          choleskyL={directResult.L}
          errorMsg={directResult.error}
          variableNames={currentScenario.variableNames}
        />

        {/* Módulo 7: Comparativa GCP vs GC (Suñagua 2020) & Gráfico Dinámico */}
        <ConvergenceView
          gcResult={gcResult}
          gcpResult={gcpResult}
          tolerance={tolerance}
          preconditioner={preconditioner}
        />

        {/* Módulo 8: Análisis Numérico de Errores & Condicionamiento */}
        <ErrorAnalysisView
          errorMetrics={errorMetrics}
          globalResidual={globalResidual}
          validation={validation}
        />

        {/* Sección 8 Obligatoria del PDF: Gran Tabla Comparativa de los 3 Escenarios */}
        <ComparativeTable />

        {/* Módulo 9: Módulo de Pruebas de Software (QA Obligatorio) */}
        <QAModuleView />

        {/* Módulo 10: Conclusiones Técnicas, Financieras & Bibliografía */}
        <ConclusionsView />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Desafío Académico de Métodos Numéricos · Aplicación del Método de Gradientes Conjugados Precondicionado en Problemas Financieros.
          </p>
          <p className="mt-1 text-slate-400">
            Universidad Mayor de San Andrés · Carrera de Informática · Estudiante: Oscar Felipe Valencia Sanchez · Docente: Brigida Carvajal Blanco · 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
