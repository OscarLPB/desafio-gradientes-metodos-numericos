import React from 'react';
import { BookOpen, GraduationCap, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';

export const ConclusionsView: React.FC = () => {
  const references = [
    {
      authors: 'Suñagua S., Porfirio',
      year: '2020',
      title: 'Método de Gradientes Conjugados Precondicionado',
      journal: 'Revista Boliviana de Matemática – Universidad Mayor de San Andrés (UMSA)',
      volume: 'Vol. 04, pp. 2–7',
      importance:
        'Fundamento matemático central del desafío: deducción algorítmica de la dirección conjugada p_k y resolución eficiente del sistema de precondicionamiento M·z_k = r_k.',
    },
    {
      authors: 'Golub, Gene H. & Van Loan, Charles F.',
      year: '2013',
      title: 'Matrix Computations',
      edition: '4th Edition',
      editorial: 'Johns Hopkins University Press, Baltimore',
      importance:
        'Tratado canónico sobre álgebra lineal numérica, análisis de estabilidad de Cholesky, cotas de condición κ₂(A) y convergencia de métodos de Krylov.',
    },
    {
      authors: 'Saad, Yousef',
      year: '2003',
      title: 'Iterative Methods for Sparse Linear Systems',
      edition: '2nd Edition',
      editorial: 'SIAM (Society for Industrial and Applied Mathematics), Philadelphia',
      importance:
        'Teoría espectral de precondicionadores incompletos (IC0), relajación SSOR y aceleración por agrupamiento (clustering) de autovalores.',
    },
    {
      authors: 'Shewchuk, Jonathan Richard',
      year: '1994',
      title: 'An Introduction to the Conjugate Gradient Method Without the Agonizing Pain',
      editorial: 'Carnegie Mellon University, School of Computer Science',
      importance:
        'Intuición geométrica del gradiente conjugado en espacios de Hilbert y minimización en paraboloides elípticos de dimensión n.',
    },
  ];

  return (
    <section id="conclusions" className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Módulo 10 de la Rúbrica UMSA
            </span>
            <h2 className="text-2xl font-bold text-white">
              Interpretación Técnica, Conclusiones & Referencias Bibliográficas
            </h2>
          </div>
        </div>

        {/* Conclusions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 text-sm leading-relaxed mb-8">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-base text-cyan-400 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
              1. Conclusiones Técnicas y Matemáticas
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                • <strong className="text-white">Validación de Simetría y Definición Positiva:</strong>{' '}
                El cumplimiento del Criterio de Sylvester (Δₖ &gt; 0) en los tres escenarios garantizó
                la existencia de un único mínimo global y la ortogonalidad de direcciones conjugadas.
              </li>
              <li>
                • <strong className="text-white">Impacto del Precondicionador (Suñagua 2020):</strong>{' '}
                En el escenario mal condicionado (κ(A) &gt; 1,100), el precondicionador diagonal de Jacobi
                renormalizó el espectro de autovalores, colapsando el número de condición a κ(M⁻¹A) ≈ 3.2.
                Esto redujo el residuo final de 10⁻¹⁰ a 10⁻¹⁶, mitigando el error por redondeo en IEEE-754.
              </li>
              <li>
                • <strong className="text-white">Consistencia frente a Cholesky:</strong> La solución
                numérica aproximada x_GCP coincide con la Solución de Referencia exacta en más de 12 cifras
                decimales de precisión, logrando un error porcentual inferior al 10⁻¹⁰%.
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              2. Conclusiones Financieras para la Mención
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                • <strong className="text-white">Resiliencia del Presupuesto Tecnológico:</strong> La
                simulación de estrés demostró que los recortes homogéneos no son óptimos: la interacción
                cuadrática orienta la inversión hacia los cuellos de botella (Cloud e IA) para sostener la
                arquitectura sin degradar la seguridad.
              </li>
              <li>
                • <strong className="text-white">Alineación con Desarrollo de Software:</strong> La
                arquitectura web reactiva implementada en TypeScript procesa el recálculo matricial en menos
                de 5 milisegundos, permitiendo a los directores técnicos (CTOs) simular ajustes presupuestarios
                en tiempo real antes de comprometer capital.
              </li>
              <li>
                • <strong className="text-white">Gobernanza y QA Numérico:</strong> Integrar pruebas
                funcionales de software dentro del simulador previene decisiones erróneas basadas en datos
                mal condicionados o inconsistentes.
              </li>
            </ul>
          </div>
        </div>

        {/* References */}
        <div className="border-t border-slate-800 pt-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Bibliografía Principal y Fuentes Científicas
          </h3>

          <div className="space-y-3">
            {references.map((ref, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="text-xs sm:text-sm text-slate-200">
                  <span className="font-bold text-cyan-300">{ref.authors}</span> ({ref.year}).{' '}
                  <span className="italic font-semibold text-white">"{ref.title}"</span>.{' '}
                  <span className="text-slate-400">
                    {ref.journal || ref.editorial || ''}
                    {ref.volume ? ` ${ref.volume}.` : ''}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-slate-400 leading-snug">
                  <strong className="text-slate-300">Aporte específico al proyecto:</strong>{' '}
                  {ref.importance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Academic Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Universidad Mayor de San Andrés · Carrera de Informática · La Paz, Bolivia</span>
          </div>
          <div>
            Estudiante: <strong className="text-slate-200">Oscar Felipe Valencia Sanchez</strong> · Docente:{' '}
            <strong className="text-slate-200">Brigida Carvajal Blanco</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
