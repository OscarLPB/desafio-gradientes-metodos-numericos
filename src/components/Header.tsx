import React from 'react';
import { Award, BookOpen, Code2, Cpu, GraduationCap, ShieldCheck, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 text-white shadow-xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Institution and Project title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                UMSA · Facultad de Ciencias Puras y Naturales · Carrera de Informática
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                INF-373 · Métodos Numéricos I
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                Mención: Desarrollo de Software e Innovación Tecnológica
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Cpu className="w-9 h-9 text-cyan-400 inline-block shrink-0" />
              <span>
                Simulador de Asignación Presupuestaria en <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">I+D de Software</span>
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Modelado, análisis de condicionamiento y resolución de sistemas simétricos definidos positivos ($Ax = b$) mediante el <strong className="text-cyan-300 font-semibold">Método de Gradientes Conjugados Precondicionado (GCP)</strong> de Porfirio Suñagua S. (2020) frente a Factorización de Cholesky y Gradientes Conjugados simple.
            </p>
          </div>

          {/* Student & Academic details card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-lg lg:w-96 shrink-0 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              Ficha Técnica del Proyecto
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Estudiante:
                </span>
                <span className="font-semibold text-white">Oscar Felipe Valencia Sanchez</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Docente:
                </span>
                <span className="font-semibold text-slate-200">Brigida Carvajal Blanco</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dimensión:</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">n = 4 ecuaciones</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tolerancia Criterio:</span>
                <span className="font-mono text-emerald-400 font-semibold">||r_k||₂ / ||b||₂ &lt; 10⁻⁶</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
