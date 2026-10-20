import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Clock, 
  ChevronDown,
  Plus,
  Home,
  Sparkles
} from 'lucide-react';
import { Company, SessionConfig } from '../types/simulation';

interface HeaderProps {
  currentView: 'portal' | 'trainer' | 'company';
  onViewChange: (view: 'portal' | 'trainer' | 'company') => void;
  session: SessionConfig;
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  onOpenCreateCompany: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  session,
  companies,
  selectedCompanyId,
  onSelectCompany,
  onOpenCreateCompany,
}) => {
  const pendingCount = companies.filter(c => c.status === 'pending').length;
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/80 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => onViewChange('portal')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                  SimuBiz
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wide bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                  Virtuelle
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Simulateur de Gestion & Compétition
              </p>
            </div>
          </div>

          {/* Center Navigation Switch: Accueil / Formateur / Entreprises */}
          <div className="flex items-center bg-orange-50/70 p-1 rounded-2xl border border-orange-200/80 shadow-inner">
            <button
              onClick={() => onViewChange('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'portal'
                  ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Retour à l'accueil"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Accueil</span>
            </button>

            <button
              onClick={() => onViewChange('trainer')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'trainer'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-orange-200" />
              <span>Formateur</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[10px] font-black rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('company')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'company'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Building2 className="w-4 h-4 text-orange-200" />
              <span>Entreprises</span>
              <span className="hidden md:inline-block text-[10px] text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded-full font-bold">
                {companies.length}
              </span>
            </button>
          </div>

          {/* Right Area: Session Period Badge & Company Quick Switcher */}
          <div className="flex items-center gap-3">
            {/* Session Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>{session.periodLabel} :</span>
              <span className="font-extrabold text-orange-700">
                {session.currentPeriod} / {session.maxPeriods}
              </span>
            </div>

            {/* Company selector */}
            {currentView === 'company' ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => onSelectCompany(e.target.value)}
                    aria-label="Sélectionner une entreprise"
                    className="appearance-none bg-white border border-orange-200 hover:border-orange-300 text-slate-800 text-xs sm:text-sm rounded-xl pl-3 pr-8 py-1.5 font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[200px] truncate shadow-xs"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.status === 'pending' ? '⏳' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-orange-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  onClick={onOpenCreateCompany}
                  className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
                  title="Créer une nouvelle entreprise"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Créer</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenCreateCompany}
                className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Créer Entreprise</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
