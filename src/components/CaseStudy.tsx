import React from 'react';
import {
  BrainCircuit,
  CheckCircle,
  Code2,
  DollarSign,
  Layers,
  Network,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const CaseStudy: React.FC = () => {
  const variables = [
    {
      symbol: 'x₁',
      name: 'Infraestructura Cloud, Microservicios & DevOps',
      costMetric: 'Presupuesto en miles de USD ($k)',
      description:
        'Aprovisionamiento de servidores elásticos, clústeres Kubernetes, mallas de servicios (Istio), pipelines de CI/CD automatizados y observabilidad continua con Prometheus/Grafana.',
      icon: Network,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    },
    {
      symbol: 'x₂',
      name: 'Innovación en Inteligencia Artificial & MLOps',
      costMetric: 'Presupuesto en miles de USD ($k)',
      description:
        'Computación acelerada por GPUs para fine-tuning, orquestación de embeddings y vector stores, pipelines de inferencia de baja latencia y monitoreo de deriva de modelos (model drift).',
      icon: BrainCircuit,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    },
    {
      symbol: 'x₃',
      name: 'Ciberseguridad, QA & Automatización de Pruebas',
      costMetric: 'Presupuesto en miles de USD ($k)',
      description:
        'Seguridad de la cadena de suministro de software (SBOM, SAST/DAST), suites de pruebas end-to-end con Playwright/Cypress y simulaciones de penetración continua.',
      icon: ShieldAlert,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    },
    {
      symbol: 'x₄',
      name: 'Frontend, UI/UX & Plataformas Web/Móviles',
      costMetric: 'Presupuesto en miles de USD ($k)',
      description:
        'Desarrollo de interfaces reactivas, sistemas de diseño corporativos (Design Systems), accesibilidad WCAG y optimización del rendimiento en Core Web Vitals.',
      icon: Code2,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    },
  ];

  return (
    <section id="case-study" className="space-y-8">
      {/* Module 2: Contexto Financiero & Justificación */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Módulos 2 & 3 de la Rúbrica UMSA
            </span>
            <h2 className="text-2xl font-bold text-white">
              Caso de Estudio: Asignación Óptima de Presupuesto en I+D de Software
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-300 text-sm leading-relaxed">
          <div className="lg:col-span-2 space-y-4">
            <p>
              En el desarrollo de software moderno y la innovación tecnológica corporativa, la
              asignación de recursos económicos no puede realizarse de forma aislada. Cada área de
              ingeniería interactúa fuertemente con las demás: una expansión en capacidades de{' '}
              <strong className="text-purple-300">Inteligencia Artificial (x₂)</strong> demanda
              inevitablemente mayor capacidad en{' '}
              <strong className="text-blue-300">Infraestructura Cloud (x₁)</strong>, incrementa la
              superficie de ataque que debe proteger{' '}
              <strong className="text-emerald-300">Ciberseguridad y QA (x₃)</strong>, y genera nuevas
              experiencias para el usuario en{' '}
              <strong className="text-amber-300">Frontend (x₄)</strong>.
            </p>
            <p>
              El modelo matemático se formula como un problema de{' '}
              <strong className="text-white">optimización cuadrática de costos y fricción operativa</strong>:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto text-center">
              min f(x) = ½ · xᵀ A x − bᵀ x
            </div>
            <p>
              Por condiciones de primer orden de optimalidad, el gradiente debe anularse en el punto óptimo:{' '}
              <span className="font-mono text-cyan-300 font-semibold">∇f(x*) = A x* − b = 0</span>,
              conduciendo de forma rigurosa al sistema lineal de ecuaciones:{' '}
              <span className="font-mono text-emerald-300 font-bold">A x = b</span>.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Fundamentación de Coeficientes
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>
                  <strong className="text-white">a_ii (Diagonal):</strong> Tasa de costos marginales y
                  rendimientos decrecientes directos del departamento i. Siempre positivos (a_ii &gt; 0).
                </li>
                <li>
                  <strong className="text-white">a_ij (Cruzados):</strong> Costo de integración,
                  interdependencia técnica y fricción de comunicación entre los departamentos i y j.
                </li>
                <li>
                  <strong className="text-white">Simetría (a_ij = a_ji):</strong> La reciprocidad en el
                  acoplamiento técnico garantiza A = Aᵀ.
                </li>
                <li>
                  <strong className="text-white">Vector b:</strong> Retornos brutos proyectados y metas
                  estratégicas fijadas por la dirección ejecutiva.
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
              Fuente de datos: Métricas empíricas de distribución de costos en ingeniería de software
              (DevOps Institute 2024 & State of Cloud FinOps).
            </div>
          </div>
        </div>

        {/* Variables Cards */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Definición Explícita de las Variables Financieras (n = 4)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {variables.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.symbol}
                  className={`bg-slate-950/70 border rounded-xl p-4 transition-all hover:border-cyan-500/40 ${v.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-lg font-extrabold text-white">{v.symbol}</span>
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 mb-1">{v.name}</h4>
                  <div className="text-[11px] font-mono text-cyan-400/90 mb-2">{v.costMetric}</div>
                  <p className="text-xs text-slate-300 leading-snug">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Criterio de Sylvester & Definición Positiva */}
        <div className="mt-8 bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-5">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            Demostración Formal: Simetría y Definición Positiva (Criterio de Sylvester)
          </h3>
          <div className="text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Para que el Método de Gradientes Conjugados (GCP) converja rigurosamente al mínimo único
              de f(x), la matriz A debe ser <strong className="text-white">Simétrica y Definida Positiva (SPD)</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 font-mono text-xs">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">1. Condición de Simetría:</span>
                A = Aᵀ ⟺ a_ij = a_ji, ∀ i, j ∈ {'{'}1, ..., n{'}'}.
                <span className="text-slate-400 block mt-1 text-[11px]">
                  Garantiza que todos los autovalores λ_i sean reales y las direcciones conjugadas ortogonales respecto a A.
                </span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">2. Criterio de Sylvester (Menores Principales):</span>
                Δ_k = det(A_{'{1..k, 1..k}'}) &gt; 0, ∀ k = 1, 2, ..., n.
                <span className="text-slate-400 block mt-1 text-[11px]">
                  Todos los menores principales líderes son estrictamente positivos ⟺ xᵀ A x &gt; 0, ∀ x ≠ 0.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
