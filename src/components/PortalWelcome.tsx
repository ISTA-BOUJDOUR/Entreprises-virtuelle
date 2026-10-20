import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Users,
  Compass,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Company, SessionConfig } from '../types/simulation';

interface PortalWelcomeProps {
  session: SessionConfig;
  companies: Company[];
  onSelectView: (view: 'trainer' | 'company') => void;
  onOpenCreateCompany: () => void;
}

export const PortalWelcome: React.FC<PortalWelcomeProps> = ({
  session,
  companies,
  onSelectView,
  onOpenCreateCompany,
}) => {
  const pendingCount = companies.filter(c => c.status === 'pending').length;
  const approvedCount = companies.filter(c => c.status === 'approved').length;

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      
      {/* Brand & Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Simulateur Pédagogique d'Entreprise Virtuelle
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Bienvenue sur <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">SimuBiz</span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Choisissez votre espace d'accès pour démarrer la session. Pilotez la simulation en tant que <strong className="text-orange-700">Formateur</strong> ou concourez en équipe avec votre <strong className="text-orange-700">Entreprise</strong>.
        </p>

        {/* Session context badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-orange-200/80 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            Session : {session.periodLabel} {session.currentPeriod} / {session.maxPeriods}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-orange-200/80 shadow-xs">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            Budget de départ : {session.startingBudget.toLocaleString('fr-FR')} MAD
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-orange-200/80 shadow-xs">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            {companies.length} Entreprise(s) inscrite(s)
          </span>
        </div>
      </div>

      {/* The 2 Main Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* Portal 1: ESPACE FORMATEUR */}
        <div 
          onClick={() => onSelectView('trainer')}
          className="group relative bg-white hover:bg-gradient-to-b hover:from-white hover:to-orange-50/40 rounded-3xl border-2 border-orange-200/90 hover:border-orange-500 p-8 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-300 uppercase tracking-wider">
              Espace Formateur
            </span>
          </div>

          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                Espace Formateur
              </h2>
              <p className="text-xs font-bold text-orange-600 mt-0.5">
                Pilotage Pédagogique & Validation des Sociétés
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Supervisez la session, fixez le budget initial de chaque société, <strong>validez les demandes de création d'entreprises</strong>, injectez les scénarios de marché et <strong>clôturez les périodes pour générer les classements</strong>.
            </p>

            {/* Quick indicators */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100">
                <span className="text-[11px] text-slate-500 block font-semibold">Dossiers en attente</span>
                <span className={`text-base font-black ${pendingCount > 0 ? 'text-orange-700 animate-pulse' : 'text-slate-800'}`}>
                  {pendingCount} à valider
                </span>
              </div>

              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100">
                <span className="text-[11px] text-slate-500 block font-semibold">Sociétés actives</span>
                <span className="text-base font-black text-slate-800">
                  {approvedCount} en compétition
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-orange-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              Accéder au Cockpit Formateur
              <ArrowRight className="w-4 h-4" />
            </span>

            <div className="w-10 h-10 rounded-xl bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Portal 2: ESPACE CREATION & GESTION D'ENTREPRISE */}
        <div className="group relative bg-white hover:bg-gradient-to-b hover:from-white hover:to-amber-50/40 rounded-3xl border-2 border-orange-200/90 hover:border-amber-500 p-8 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
              Espace Entreprises
            </span>
          </div>

          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-amber-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                Création & Gestion d'Entreprise
              </h2>
              <p className="text-xs font-bold text-amber-600 mt-0.5">
                Étudiants & Équipes en Compétition
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <strong>Créez votre société virtuelle</strong> et soumettez-la au formateur. Une fois validée, pilotez vos départements <strong>Finance, RH, Commerce, Marketing et Comptabilité</strong> pour maximiser votre profit et remporter le classement.
            </p>

            {/* Quick action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateCompany();
                }}
                className="w-full p-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une Entreprise</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectView('company')}
                className="w-full p-3 bg-white hover:bg-orange-50 text-slate-800 font-extrabold text-xs rounded-xl border border-orange-200 shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Building2 className="w-4 h-4 text-orange-600" />
                <span>Gérer les Sociétés ({companies.length})</span>
              </button>
            </div>
          </div>

          <div 
            onClick={() => onSelectView('company')}
            className="mt-8 pt-6 border-t border-orange-100 flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              Entrer dans le Cockpit d'Entreprise
              <ArrowRight className="w-4 h-4" />
            </span>

            <div className="w-10 h-10 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Pedagogical info banner */}
      <div className="mt-10 max-w-4xl w-full bg-white rounded-2xl border border-orange-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0" />
          <span>
            <strong>Règle du jeu :</strong> Toute entreprise nouvellement créée doit être approuvée par le formateur avant de pouvoir prendre ses décisions de gestion et vendre ses produits.
          </span>
        </div>
        <span className="text-[11px] font-bold text-orange-700 shrink-0">
          Simulateur Économique Temps Réel
        </span>
      </div>

    </div>
  );
};
