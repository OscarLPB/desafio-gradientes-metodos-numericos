import React from 'react';
import { Activity, TrendingDown } from 'lucide-react';
import { ErrorMetrics, MatrixValidation } from '../core/types';

interface ErrorAnalysisViewProps {
  errorMetrics: ErrorMetrics[];
  globalResidual: number;
  validation: MatrixValidation;
}

export const ErrorAnalysisView: React.FC<ErrorAnalysisViewProps> = ({
  errorMetrics,
  globalResidual,
  validation,
}) => {
  const reductionPercent =
    validation.conditionNumber > 0 && isFinite(validation.conditionNumber)
      ? Math.max(
          0,
          ((validation.conditionNumber - validation.preconditionedConditionNumber) /
            validation.conditionNumber) *
            100
        )
      : 0;

  return (
    <section id="error-analysis" className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Módulo 8 de la Rúbrica UMSA
            </span>
            <h2 className="text-2xl font-bold text-white">
              Análisis Numérico de Errores & Condicionamiento Espectral
            </h2>
          </div>
        </div>

        {/* Global Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 font-sans block mb-1">
              Residuo Relativo Global ||b − Ax_GCP||₂ / ||b||₂
            </span>
            <div className="text-lg font-extrabold text-emerald-400">
              {globalResidual.toExponential(4)}
            </div>
            <span className="text-[10px] text-slate-500 font-sans">
              {globalResidual < 1e-6 ? '✓ Cumple criterio (< 10⁻⁶)' : '⚠️ Superior a la tolerancia'}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 font-sans block mb-1">
              Número de Condición Original κ(A)
            </span>
            <div
              className={`text-lg font-extrabold ${
                validation.conditionNumber > 500
                  ? 'text-rose-400'
                  : validation.conditionNumber > 25
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {isFinite(validation.conditionNumber) ? validation.conditionNumber.toFixed(2) : '∞'}
            </div>
            <span className="text-[10px] text-slate-400 font-sans">
              λ_max / λ_min ({validation.eigenvalues[0]?.toFixed(1) || '0'} /{' '}
              {validation.eigenvalues[validation.eigenvalues.length - 1]?.toFixed(2) || '0'})
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[11px] text-slate-400 font-sans block mb-1">
              Condición Precondicionada κ(M⁻¹A)
            </span>
            <div className="text-lg font-extrabold text-cyan-400">
              {isFinite(validation.preconditionedConditionNumber)
                ? validation.preconditionedConditionNumber.toFixed(2)
                : '—'}
            </div>
            <span className="text-[10px] text-cyan-300 font-sans flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Reducción del {reductionPercent.toFixed(1)}% de dispersión
            </span>
          </div>
        </div>

        {/* Component-Wise Error Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="p-3 font-sans font-semibold">Variable Financiera</th>
                <th className="p-3">Solución Referencia (x_ref)</th>
                <th className="p-3 text-cyan-400">Aproximación (x_GCP)</th>
                <th className="p-3 text-amber-400">Error Absoluto (Ea)</th>
                <th className="p-3 text-emerald-400">Error Relativo (Er)</th>
                <th className="p-3 text-indigo-400">Error Porcentual (Ep)</th>
              </tr>
            </thead>
            <tbody>
              {errorMetrics.map((em, idx) => (
                <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                  <td className="p-3 font-sans font-semibold text-slate-200">
                    <span className="text-cyan-400 font-mono mr-1.5">x_{idx + 1}:</span>
                    {em.variableName.split(':')[1] || em.variableName}
                  </td>
                  <td className="p-3 text-white font-bold">{em.exact.toFixed(6)}</td>
                  <td className="p-3 text-cyan-300 font-bold">{em.approx.toFixed(6)}</td>
                  <td className="p-3 text-amber-300">{em.absoluteError.toExponential(3)}</td>
                  <td className="p-3 text-emerald-300">
                    {em.relativeError !== null ? em.relativeError.toExponential(3) : 'No Definido (x=0)'}
                  </td>
                  <td className="p-3 text-indigo-300 font-bold">
                    {em.percentError !== null ? `${em.percentError.toExponential(2)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulas Footer */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400 font-mono">
          <div>
            <strong className="text-slate-300 font-sans block">Error Absoluto:</strong>
            Ea,i = |x_ref,i − x_GCP,i|
          </div>
          <div>
            <strong className="text-slate-300 font-sans block">Error Relativo:</strong>
            Er,i = Ea,i / |x_ref,i| (x_ref,i ≠ 0)
          </div>
          <div>
            <strong className="text-slate-300 font-sans block">Error Porcentual:</strong>
            Ep,i = Er,i × 100%
          </div>
        </div>
      </div>
    </section>
  );
};
