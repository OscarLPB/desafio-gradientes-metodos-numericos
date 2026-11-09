import React from 'react';
import {
  Activity,
  Calculator,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  LineChart,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const navItems = [
    { id: 'case-study', label: '1. Caso & Formulación', icon: FileText },
    { id: 'matrix-editor', label: '2. Editor Matricial & Escenarios', icon: Sliders },
    { id: 'direct-solution', label: '3. Cholesky (Referencia)', icon: Calculator },
    { id: 'gcp-vs-gc', label: '4. GCP vs GC (Suñagua)', icon: LineChart },
    { id: 'error-analysis', label: '5. Errores & Condicionamiento', icon: Activity },
    { id: 'comparative-table', label: '6. Tabla Comparativa', icon: FileSpreadsheet },
    { id: 'qa-module', label: '7. Módulo QA (Pruebas)', icon: CheckCircle2 },
    { id: 'conclusions', label: '8. Conclusiones & Citas', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
