import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  XCircle,
} from 'lucide-react';
import { QASuite } from '../core/qaTests';
import { QATestCase } from '../core/types';

export const QAModuleView: React.FC = () => {
  const [testCases, setTestCases] = useState<QATestCase[]>(() => QASuite.getTestCases());
  const [runningAll, setRunningAll] = useState(false);

  const runSingleTest = (testId: number) => {
    setTestCases((prev) =>
      prev.map((tc) => {
        if (tc.id === testId) {
          const res = tc.runTest();
          return {
            ...tc,
            obtainedOutput: res.obtained,
            passed: res.passed,
            conclusion: res.conclusion,
          };
        }
        return tc;
      })
    );
  };

  const runAllTests = () => {
    setRunningAll(true);
    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((tc) => {
          const res = tc.runTest();
          return {
            ...tc,
            obtainedOutput: res.obtained,
            passed: res.passed,
            conclusion: res.conclusion,
          };
        })
      );
      setRunningAll(false);
    }, 150);
  };

  const resetTests = () => {
    setTestCases(QASuite.getTestCases());
  };

  const executedTests = testCases.filter((t) => t.passed !== undefined);
  const passedCount = testCases.filter((t) => t.passed === true).length;

  return (
    <section id="qa-module" className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Módulo 9 de la Rúbrica UMSA (Aporte Específico de Desarrollo de Software)
              </span>
              <h2 className="text-2xl font-bold text-white">
                Módulo de Pruebas de Software (Control de Calidad QA)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={runAllTests}
              disabled={runningAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              {runningAll ? 'Ejecutando Suite...' : 'Ejecutar Suite QA Completa'}
            </button>
            {executedTests.length > 0 && (
              <button
                onClick={resetTests}
                className="p-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
                title="Limpiar resultados"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-6">
          En cumplimiento del estándar de calidad de software estipulado en la{' '}
          <strong className="text-white">Sección 9 del desafío</strong>, esta suite interactiva ejecuta y
          valida formalmente los 4 casos de prueba obligatorios con estructura estándar de QA:
          <span className="text-cyan-400 font-mono text-xs ml-1">
            Entrada ➔ Resultado Esperado ➔ Resultado Obtenido ➔ Conclusión
          </span>
          .
        </p>

        {/* Status Counter */}
        {executedTests.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Estado de la Suite:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  passedCount === testCases.length
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {passedCount === testCases.length ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 100% de Pruebas Superadas ({passedCount}/
                    {testCases.length})
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> {passedCount}/{testCases.length} Pruebas Pasadas
                  </>
                )}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Arquitectura: Validaciones Unitarias en Cliente
            </span>
          </div>
        )}

        {/* 4 QA Test Cards */}
        <div className="space-y-4">
          {testCases.map((tc) => {
            const hasRun = tc.passed !== undefined;
            return (
              <div
                key={tc.id}
                className={`border rounded-xl p-5 transition-all ${
                  hasRun
                    ? tc.passed
                      ? 'bg-emerald-950/10 border-emerald-800/40'
                      : 'bg-rose-950/20 border-rose-800/60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      QA-0{tc.id}
                    </span>
                    <h3 className="text-sm font-bold text-white">{tc.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {hasRun && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          tc.passed
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {tc.passed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> PASÓ
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> FALLÓ
                          </>
                        )}
                      </span>
                    )}
                    <button
                      onClick={() => runSingleTest(tc.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      Ejecutar Test
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4">{tc.description}</p>

                {/* Test Spec Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      1. Entrada (Test Input)
                    </span>
                    <div className="text-slate-300">{tc.inputDescription}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-sans font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      2. Resultado Esperado (Expected Output)
                    </span>
                    <div className="text-slate-300">{tc.expectedOutput}</div>
                  </div>
                </div>

                {/* Obtained Output & Conclusion */}
                {hasRun && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                      <span className="text-[11px] font-sans font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> 3. Resultado Obtenido en Ejecución (Obtained Output)
                      </span>
                      <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {tc.obtainedOutput}
                      </pre>
                    </div>

                    <div
                      className={`p-3 rounded-lg border font-sans text-xs ${
                        tc.passed
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-800/70 text-rose-200'
                      }`}
                    >
                      <strong className="block font-bold mb-0.5">4. Conclusión de Calidad:</strong>
                      {tc.conclusion}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
