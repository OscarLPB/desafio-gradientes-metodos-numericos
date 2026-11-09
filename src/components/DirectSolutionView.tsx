import React from 'react';
import { Calculator, CheckCircle, ShieldCheck } from 'lucide-react';

interface DirectSolutionViewProps {
  xRef: number[] | null;
  choleskyL: number[][] | null;
  errorMsg: string | null;
  variableNames: string[];
}

export const DirectSolutionView: React.FC<DirectSolutionViewProps> = ({
  xRef,
  choleskyL,
  errorMsg,
  variableNames,
}) => {
  return (
    <section id="direct-solution" className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Módulo 6 de la Rúbrica UMSA
            </span>
            <h2 className="text-2xl font-bold text-white">
              Solución Numérica de Referencia (Método Directo de Cholesky)
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-6">
          De acuerdo con la Sección 6.2 del desafío, se calcula la{' '}
          <strong className="text-white">Solución Numérica de Referencia (formalmente clasificada como "Solución Exacta")</strong>{' '}
          empleando la Factorización de Cholesky (<span className="font-mono text-cyan-300 font-bold">A = L · Lᵀ</span>),
          especializada para sistemas simétricos definidos positivos. Este vector sirve de estándar áureo para calcular los errores
          absoluto, relativo y porcentual de los métodos iterativos.
        </p>

        {errorMsg ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm">
            <strong>Error en el cálculo directo:</strong> {errorMsg}
          </div>
        ) : xRef && choleskyL ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Vector Solución de Referencia */}
            <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Vector de Referencia x_ref (Solución Exacta)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Dimensiones 4×1</span>
              </div>

              <div className="space-y-2.5">
                {xRef.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        x_ref,{idx + 1}:
                      </span>{' '}
                      <span className="text-xs text-slate-300 ml-1">
                        {variableNames[idx] ? variableNames[idx].split(':')[1] : `Variable ${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-white">
                        {val.toFixed(6)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">$k USD</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Precisión de doble coma flotante IEEE-754 (64 bits)
                </span>
                <span className="font-mono text-slate-400">ε_mach ≈ 2.22×10⁻¹⁶</span>
              </div>
            </div>

            {/* Matriz Triangular Inferior de Cholesky L */}
            <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-indigo-400 font-mono">
                  Factor Triangular Inferior L (A = L · Lᵀ)
                </span>
                <span className="text-[11px] font-mono text-slate-400">l_ii &gt; 0</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <tbody>
                    {choleskyL.map((row, i) => (
                      <tr key={i} className="border-t border-slate-800/40">
                        <td className="p-1.5 text-left text-xs font-mono font-semibold text-slate-400">
                          Fila {i + 1}
                        </td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`p-1.5 font-mono text-xs sm:text-sm ${
                              i >= j
                                ? i === j
                                  ? 'text-cyan-300 font-bold bg-cyan-950/30'
                                  : 'text-slate-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {val === 0 ? '0' : val.toFixed(4)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 space-y-1">
                <div className="font-semibold text-indigo-300">Procedimiento en dos etapas:</div>
                <div className="font-mono text-[11px] text-slate-300">
                  1. Sustitución progresiva: L · y = b ⟹ vector intermedio y.
                  <br />
                  2. Sustitución regresiva: Lᵀ · x = y ⟹ vector solución exacto x_ref.
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
