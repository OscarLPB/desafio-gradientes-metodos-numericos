import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { MatrixValidation, PreconditionerType } from '../core/types';
import { SOFTWARE_FINANCIAL_SCENARIOS } from '../data/scenarios';

interface MatrixEditorProps {
  activeScenarioId: 'ideal' | 'stress' | 'ill_conditioned' | 'custom';
  A: number[][];
  b: number[];
  x0: number[];
  tolerance: number;
  maxIterations: number;
  preconditioner: PreconditionerType;
  validation: MatrixValidation;
  onScenarioChange: (id: 'ideal' | 'stress' | 'ill_conditioned') => void;
  onMatrixChange: (newA: number[][]) => void;
  onVectorBChange: (newB: number[]) => void;
  onVectorX0Change: (newX0: number[]) => void;
  onToleranceChange: (newTol: number) => void;
  onPreconditionerChange: (p: PreconditionerType) => void;
  onReset: () => void;
}

export const MatrixEditor: React.FC<MatrixEditorProps> = ({
  activeScenarioId,
  A,
  b,
  x0,
  tolerance,
  preconditioner,
  validation,
  onScenarioChange,
  onMatrixChange,
  onVectorBChange,
  onVectorX0Change,
  onToleranceChange,
  onPreconditionerChange,
  onReset,
}) => {
  const n = A.length;
  const variableLabels = ['Cloud (x₁)', 'IA MLOps (x₂)', 'QA/Sec (x₃)', 'Frontend (x₄)'];

  const handleCellChange = (i: number, j: number, valueStr: string) => {
    const val = parseFloat(valueStr);
    const newA = A.map((row) => [...row]);
    newA[i][j] = isNaN(val) ? 0 : val;
    onMatrixChange(newA);
  };

  const handleBCellChange = (i: number, valueStr: string) => {
    const val = parseFloat(valueStr);
    const newB = [...b];
    newB[i] = isNaN(val) ? 0 : val;
    onVectorBChange(newB);
  };

  const handleX0CellChange = (i: number, valueStr: string) => {
    const val = parseFloat(valueStr);
    const newX0 = [...x0];
    newX0[i] = isNaN(val) ? 0 : val;
    onVectorX0Change(newX0);
  };

  // Helper to make matrix automatically symmetric with 1 click
  const makeSymmetric = () => {
    const newA = A.map((row) => [...row]);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const avg = (newA[i][j] + newA[j][i]) / 2;
        newA[i][j] = avg;
        newA[j][i] = avg;
      }
    }
    onMatrixChange(newA);
  };

  return (
    <section id="matrix-editor" className="space-y-6">
      {/* Module 5: Botones de Carga Rápida de los Tres Escenarios */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Módulos 4 & 5 de la Rúbrica UMSA
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              Entrada de Datos & Carga de Escenarios Obligatorios
            </h2>
          </div>

          <button
            onClick={onReset}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reiniciar al escenario actual"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Valores
          </button>
        </div>

        {/* 3 Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {SOFTWARE_FINANCIAL_SCENARIOS.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            let icon = Zap;
            let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            if (sc.id === 'stress') {
              icon = Flame;
              badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            } else if (sc.id === 'ill_conditioned') {
              icon = AlertTriangle;
              badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            }
            const Icon = icon;

            return (
              <button
                key={sc.id}
                onClick={() => onScenarioChange(sc.id)}
                className={`text-left p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {sc.id === 'ideal' && 'Escenario 1 · Ideal'}
                      {sc.id === 'stress' && 'Escenario 2 · Estrés'}
                      {sc.id === 'ill_conditioned' && 'Escenario 3 · Mal Condicionado'}
                    </span>
                    {isSelected && (
                      <span className="flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{sc.name.split(':')[1]}</h3>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{sc.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
                  <span>Precond.: <strong className="text-cyan-300 uppercase">{sc.recommendedPreconditioner}</strong></span>
                  <span className="font-semibold text-cyan-400">Cargar Datos →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-time Matrix Validation Banner */}
        <div
          className={`p-4 rounded-xl border mb-8 transition-colors ${
            validation.isPositiveDefinite
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
              : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              {validation.isPositiveDefinite ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {validation.isPositiveDefinite
                    ? 'Matriz Válida: Simétrica y Definida Positiva (SPD)'
                    : 'Atención: Restricción Matemática Incumplida'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {validation.isPositiveDefinite
                    ? 'Cumple con A = Aᵀ y el Criterio de Sylvester (todos los menores principales y autovalores son positivos). El método convergerá.'
                    : validation.errorMessages[0] || 'La matriz no cumple con los requisitos del desafío.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto font-mono text-xs">
              {!validation.isSymmetric && (
                <button
                  onClick={makeSymmetric}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-sans text-xs font-semibold"
                >
                  Sincronizar Simetría (a_ij = a_ji)
                </button>
              )}
              <div className="bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700">
                κ(A):{' '}
                <strong
                  className={
                    validation.conditionNumber > 500
                      ? 'text-rose-400 font-bold'
                      : validation.conditionNumber > 20
                      ? 'text-amber-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {isFinite(validation.conditionNumber)
                    ? validation.conditionNumber.toLocaleString(undefined, { maximumFractionDigits: 1 })
                    : '∞'}
                </strong>
              </div>
              <div className="bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700">
                κ(M⁻¹A):{' '}
                <strong className="text-cyan-400 font-bold">
                  {isFinite(validation.preconditionedConditionNumber)
                    ? validation.preconditionedConditionNumber.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })
                    : '∞'}
                </strong>
              </div>
            </div>
          </div>

          {/* Sylvester Details & Eigenvalues */}
          <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-0.5">Menores Principales (Sylvester Δₖ):</span>
              <div className="flex gap-2 flex-wrap">
                {validation.principalMinors.map((minor, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                      minor > 0
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/80 font-bold'
                    }`}
                  >
                    Δ{idx + 1} = {minor.toExponential(2)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Autovalores Reales (λᵢ):</span>
              <div className="flex gap-2 flex-wrap">
                {validation.eigenvalues.map((ev, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                      ev > 0
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                    }`}
                  >
                    λ{idx + 1} = {ev.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matrix & Vector Editing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Matrix A Editor (4x4) */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-400 text-sm">Matriz de Coeficientes A (4×4)</span>
                <span className="text-[11px] text-slate-400">a_ij (Costos & Interacciones cruzadas)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Simetría: {validation.isSymmetric ? '✓ OK' : '✗ Asimétrica'}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 text-[11px] text-slate-400 font-normal text-left">Área</th>
                    {variableLabels.map((lbl, idx) => (
                      <th key={idx} className="p-1.5 text-[11px] font-mono text-cyan-300 font-semibold">
                        {lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {A.map((row, i) => (
                    <tr key={i} className="border-t border-slate-800/60">
                      <td className="p-1.5 text-left text-xs font-mono font-semibold text-slate-400 whitespace-nowrap">
                        {variableLabels[i]}
                      </td>
                      {row.map((val, j) => {
                        const isDiag = i === j;
                        return (
                          <td key={j} className="p-1.5">
                            <input
                              type="number"
                              step="any"
                              value={val}
                              onChange={(e) => handleCellChange(i, j, e.target.value)}
                              className={`w-full max-w-[85px] px-2 py-1.5 rounded-lg text-center font-mono text-xs sm:text-sm font-semibold transition border ${
                                isDiag
                                  ? 'bg-cyan-950/40 border-cyan-800/70 text-cyan-300 focus:ring-1 focus:ring-cyan-400'
                                  : 'bg-slate-900 border-slate-800 text-slate-200 focus:ring-1 focus:ring-slate-400'
                              } focus:outline-none`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 italic">
              * Nota: Las celdas resaltadas en celeste representan la diagonal principal a_ii (costos directos de escalamiento).
            </p>
          </div>

          {/* Vector b (RHS) & Vector x0 */}
          <div className="lg:col-span-4 space-y-4">
            {/* Vector b */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-emerald-400 text-sm">Vector b (Metas/Presupuesto)</span>
                <span className="text-[11px] text-slate-400 font-mono">4×1 ($k USD)</span>
              </div>
              <div className="space-y-2">
                {b.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 w-24 shrink-0">b_{i + 1} ({variableLabels[i].split(' ')[0]}):</span>
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleBCellChange(i, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-800/50 text-emerald-300 font-mono text-xs sm:text-sm font-bold text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Parámetros Numéricos */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" /> Parámetros Numéricos del Algoritmo
              </div>

              {/* Precondicionador */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Precondicionador M:</span>
                  <span className="text-[11px] text-cyan-400 font-mono font-semibold">Suñagua (2020)</span>
                </label>
                <select
                  value={preconditioner}
                  onChange={(e) => onPreconditionerChange(e.target.value as PreconditionerType)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="jacobi">Precondicionador de Jacobi (M = diag(A))</option>
                  <option value="ssor">Precondicionador SSOR (ω = 1.0)</option>
                  <option value="none">Sin Precondicionar (GC Estándar)</option>
                </select>
              </div>

              {/* Tolerancia */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Tolerancia de Parada:</span>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">||r_k|| / ||b|| &lt; tol</span>
                </label>
                <select
                  value={tolerance}
                  onChange={(e) => onToleranceChange(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value={1e-6}>10⁻⁶ (Estipulada en el Desafío UMSA)</option>
                  <option value={1e-4}>10⁻⁴ (Rápida)</option>
                  <option value={1e-8}>10⁻⁸ (Alta Precisión)</option>
                </select>
              </div>

              {/* Vector Inicial x0 */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Vector Inicial x₀ (por defecto x₀ = 0):</span>
                  <button
                    onClick={() => onVectorX0Change([0, 0, 0, 0])}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Reset x₀=0
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {x0.map((val, idx) => (
                    <input
                      key={idx}
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleX0CellChange(idx, e.target.value)}
                      placeholder="0"
                      className="px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-center font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
