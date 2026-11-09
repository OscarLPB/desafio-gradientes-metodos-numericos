import React, { useState } from 'react';
import {
  CheckCircle2,
  LineChart,
  Table as TableIcon,
  TrendingDown,
  XCircle,
  Zap,
} from 'lucide-react';
import { PreconditionerType, SolverResult } from '../core/types';

interface ConvergenceViewProps {
  gcResult: SolverResult | null;
  gcpResult: SolverResult | null;
  tolerance: number;
  preconditioner: PreconditionerType;
}

export const ConvergenceView: React.FC<ConvergenceViewProps> = ({
  gcResult,
  gcpResult,
  tolerance,
  preconditioner,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [hoveredPoint, setHoveredPoint] = useState<{
    method: string;
    iter: number;
    val: number;
  } | null>(null);

  if (!gcResult || !gcpResult) return null;

  // Compute SVG chart data
  const maxIter = Math.max(gcResult.history.length, gcpResult.history.length, 4);
  const minLog = -16;
  const maxLog = 0;

  const width = 680;
  const height = 280;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const toX = (iter: number) => padLeft + (iter / (maxIter - 1 || 1)) * chartW;
  const toY = (val: number) => {
    const safeVal = Math.max(val, 1e-16);
    const logVal = Math.log10(safeVal);
    const clamped = Math.max(minLog, Math.min(maxLog, logVal));
    const ratio = (clamped - minLog) / (maxLog - minLog);
    return padTop + (1 - ratio) * chartH;
  };

  const gcPoints = gcResult.history.map((h) => ({
    x: toX(h.iteration),
    y: toY(h.relativeResidual),
    iter: h.iteration,
    val: h.relativeResidual,
  }));

  const gcpPoints = gcpResult.history.map((h) => ({
    x: toX(h.iteration),
    y: toY(h.relativeResidual),
    iter: h.iteration,
    val: h.relativeResidual,
  }));

  const gcPath = gcPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const gcpPath = gcpPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const tolY = toY(tolerance);

  return (
    <section id="gcp-vs-gc" className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Módulo 7 de la Rúbrica UMSA
              </span>
              <h2 className="text-2xl font-bold text-white">
                Gradientes Conjugados Precondicionado (GCP) vs GC Simple
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTab === 'chart'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" /> Gráfico Dinámico
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTab === 'table'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Historial de Pasos
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* GCP Card */}
          <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> GCP Suñagua (2020) · Precondicionado ({preconditioner.toUpperCase()})
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  gcpResult.converged
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {gcpResult.converged ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Convergió
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" /> No Alcanzó Tol
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-center mb-3">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Iteraciones</div>
                <div className="text-xl font-extrabold text-cyan-300">{gcpResult.iterations}</div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Residuo Final</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  {gcpResult.finalRelativeResidual.toExponential(2)}
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Tiempo de Cómputo</div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {gcpResult.executionTimeMs.toFixed(2)} ms
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1 font-mono">
              <div className="text-slate-400 text-[11px]">Vector Solución Obtenido x_GCP:</div>
              <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-cyan-200 text-xs flex justify-between">
                {gcpResult.x.map((val, idx) => (
                  <span key={idx}>
                    x_{idx + 1} = <strong>{val.toFixed(4)}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GC Simple Card */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" /> GC Estándar (Sin Precondicionar)
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  gcResult.converged
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {gcResult.converged ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Convergió
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" /> No Alcanzó Tol
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-center mb-3">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Iteraciones</div>
                <div className="text-xl font-extrabold text-rose-300">{gcResult.iterations}</div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Residuo Final</div>
                <div className="text-xs font-bold text-slate-300 mt-1">
                  {gcResult.finalRelativeResidual.toExponential(2)}
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Tiempo de Cómputo</div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {gcResult.executionTimeMs.toFixed(2)} ms
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1 font-mono">
              <div className="text-slate-400 text-[11px]">Vector Solución Obtenido x_GC:</div>
              <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-slate-300 text-xs flex justify-between">
                {gcResult.x.map((val, idx) => (
                  <span key={idx}>
                    x_{idx + 1} = <strong>{val.toFixed(4)}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Convergence Chart */}
        {activeTab === 'chart' ? (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-cyan-400" /> Curva de Caída del Residuo Relativo
                  (||r_k||₂ / ||b||₂) en Escala Logarítmica
                </h3>
                <p className="text-xs text-slate-400">
                  Compara la velocidad de convergencia paso a paso de Suñagua (2020) con precondicionador vs GC simple.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm"></span> GCP ({preconditioner})
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> GC Estándar
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Tol 10⁻⁶
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto flex justify-center py-2">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl select-none">
                {/* Horizontal Grid lines */}
                {[-0, -2, -4, -6, -8, -10, -12, -14, -16].map((logVal) => {
                  const y = toY(Math.pow(10, logVal));
                  return (
                    <g key={logVal}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={width - padRight}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray={logVal === -6 ? '4,4' : undefined}
                        strokeWidth={logVal === -6 ? 1.5 : 1}
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 3}
                        fill={logVal === -6 ? '#10b981' : '#64748b'}
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        10^{logVal}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Iteration lines */}
                {Array.from({ length: maxIter }).map((_, it) => {
                  const x = toX(it);
                  return (
                    <g key={it}>
                      <line x1={x} y1={padTop} x2={x} y2={height - padBottom} stroke="#1e293b" />
                      <text
                        x={x}
                        y={height - padBottom + 16}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        k={it}
                      </text>
                    </g>
                  );
                })}

                {/* Tolerance Line (tol = 10^-6) */}
                <line
                  x1={padLeft}
                  y1={tolY}
                  x2={width - padRight}
                  y2={tolY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                />
                <text
                  x={width - padRight - 5}
                  y={tolY - 6}
                  fill="#10b981"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Tolerancia de Parada (10⁻⁶)
                </text>

                {/* GC Line & Points */}
                <path d={gcPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                {gcPoints.map((p, idx) => (
                  <circle
                    key={`gc-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.method === 'GC' && hoveredPoint.iter === p.iter ? 6 : 4}
                    fill="#f43f5e"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint({ method: 'GC', iter: p.iter, val: p.val })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* GCP Line & Points */}
                <path d={gcpPath} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                {gcpPoints.map((p, idx) => (
                  <circle
                    key={`gcp-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.method === 'GCP' && hoveredPoint.iter === p.iter ? 7 : 5}
                    fill="#22d3ee"
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint({ method: 'GCP', iter: p.iter, val: p.val })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Axes */}
                <line x1={padLeft} y1={padTop} x2={padLeft} y2={height - padBottom} stroke="#475569" strokeWidth="1.5" />
                <line
                  x1={padLeft}
                  y1={height - padBottom}
                  x2={width - padRight}
                  y2={height - padBottom}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text
                  x={width / 2}
                  y={height - 10}
                  fill="#cbd5e1"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Número de Iteraciones (k)
                </text>
              </svg>
            </div>

            {/* Hover Tooltip display */}
            {hoveredPoint && (
              <div className="mt-2 text-center text-xs font-mono bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800 text-slate-300">
                Detalle Punto:{' '}
                <strong className={hoveredPoint.method === 'GCP' ? 'text-cyan-400' : 'text-rose-400'}>
                  {hoveredPoint.method}
                </strong>{' '}
                en iteración <strong>k={hoveredPoint.iter}</strong> ➔ Residuo Relativo ={' '}
                <strong className="text-white">{hoveredPoint.val.toExponential(4)}</strong>
              </div>
            )}
          </div>
        ) : (
          /* Step-by-Step Table */
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 overflow-x-auto">
            <h3 className="font-bold text-sm text-white mb-3">Historial Iterativo Paso a Paso (GCP vs GC)</h3>
            <table className="w-full text-xs font-mono border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-2">Iteración (k)</th>
                  <th className="p-2 text-cyan-400">Residuo Relativo GCP</th>
                  <th className="p-2 text-cyan-400">Paso α_k (GCP)</th>
                  <th className="p-2 text-rose-400">Residuo Relativo GC</th>
                  <th className="p-2 text-rose-400">Paso α_k (GC)</th>
                  <th className="p-2 text-slate-400">Criterio (&lt; 10⁻⁶)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxIter }).map((_, k) => {
                  const gcpStep = gcpResult.history[k];
                  const gcStep = gcResult.history[k];
                  return (
                    <tr key={k} className="border-b border-slate-900 hover:bg-slate-900/50">
                      <td className="p-2 font-bold text-white">k = {k}</td>
                      <td className="p-2 text-cyan-300">
                        {gcpStep ? gcpStep.relativeResidual.toExponential(3) : '—'}
                      </td>
                      <td className="p-2 text-cyan-400/80">
                        {gcpStep?.alpha !== undefined ? gcpStep.alpha.toFixed(5) : '—'}
                      </td>
                      <td className="p-2 text-rose-300">
                        {gcStep ? gcStep.relativeResidual.toExponential(3) : '—'}
                      </td>
                      <td className="p-2 text-rose-400/80">
                        {gcStep?.alpha !== undefined ? gcStep.alpha.toFixed(5) : '—'}
                      </td>
                      <td className="p-2">
                        {gcpStep && gcpStep.relativeResidual < tolerance ? (
                          <span className="text-emerald-400 font-bold">✓ Alcanzada (GCP)</span>
                        ) : gcStep && gcStep.relativeResidual < tolerance ? (
                          <span className="text-emerald-400 font-bold">✓ Alcanzada (GC)</span>
                        ) : (
                          <span className="text-slate-500">En progreso</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
