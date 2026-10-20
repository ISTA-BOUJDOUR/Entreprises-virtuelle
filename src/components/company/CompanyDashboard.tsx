import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  Megaphone, 
  Users, 
  Landmark, 
  Calculator, 
  Trophy, 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  GraduationCap, 
  ArrowRight,
  ChevronRight,
  Compass
} from 'lucide-react';
import { Company, SessionConfig, CompanyDecisions, ActiveTab } from '../../types/simulation';
import { CompanyOverview } from './CompanyOverview';
import { CommerceDepartment } from './CommerceDepartment';
import { MarketingDepartment } from './MarketingDepartment';
import { HRDepartment } from './HRDepartment';
import { FinanceDepartment } from './FinanceDepartment';
import { AccountingDepartment } from './AccountingDepartment';
import { LeaderboardView } from '../common/LeaderboardView';
import { SECTOR_INFO } from '../../utils/defaultData';

interface CompanyDashboardProps {
  company: Company;
  session: SessionConfig;
  allCompanies: Company[];
  onUpdateDecisions: (companyId: string, decisions: CompanyDecisions) => void;
  onSwitchToTrainer: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  company,
  session,
  allCompanies,
  onUpdateDecisions,
  onSwitchToTrainer,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const sector = SECTOR_INFO[company.sector];

  // If company is still pending approval by the trainer
  if (company.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
        
        {/* Pending Notification Banner - Orange & White */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <Hourglass className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-2 border border-white/30">
                  Dossier en cours d’examen
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Entreprise en Attente de Validation
                </h2>
                <p className="text-sm text-orange-100 font-medium mt-1 max-w-xl">
                  Votre société <strong className="text-white">« {company.name} »</strong> a été créée avec succès. Avant de pouvoir prendre des décisions opérationnelles, votre dossier doit être validé par le formateur.
                </p>
              </div>
            </div>

            <button
              onClick={onSwitchToTrainer}
              className="bg-white hover:bg-orange-50 text-orange-700 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>Ouvrir l’Espace Formateur</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Submitted Dossier Summary */}
        <div className="bg-white rounded-3xl border border-orange-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-orange-100 pb-4 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">
              Récapitulatif de la Demande d’Enregistrement
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sector.color}`}>
              {sector.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <span className="text-xs text-slate-500 font-bold uppercase block">Raison Sociale</span>
              <span className="text-base font-black text-slate-900 block mt-1">{company.name}</span>
              <span className="text-xs text-slate-500 italic block mt-0.5">« {company.slogan} »</span>
            </div>

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <span className="text-xs text-slate-500 font-bold uppercase block">Équipe Fondatrice</span>
              <span className="text-base font-black text-slate-900 block mt-1">{company.creatorName}</span>
              <span className="text-xs text-slate-500 block mt-0.5">{company.teamMembers.join(', ')}</span>
            </div>

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <span className="text-xs text-slate-500 font-bold uppercase block">Capital de Départ Alloué</span>
              <span className="text-base font-black text-emerald-600 block mt-1">
                {company.cash.toLocaleString('fr-FR')} MAD
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Budget formateur certifié</span>
            </div>
          </div>

          <div className="p-5 bg-orange-50/70 rounded-2xl border border-orange-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-950 font-medium">
              <span className="font-black block text-orange-900">Consigne pédagogique :</span>
              Pendant que le formateur procède à la validation de votre dossier, vous pouvez vous concerter en équipe pour établir votre première stratégie de prix, vos volumes cibles et la répartition de vos budgets marketing et RH.
            </div>
          </div>
        </div>

      </div>
    );
  }

  // If rejected
  if (company.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Dossier Refusé par le Formateur
        </h2>
        <p className="text-sm text-slate-600">
          {company.trainerNotes || 'Veuillez revoir vos hypothèses et contacter le formateur.'}
        </p>
        <button
          onClick={onSwitchToTrainer}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Aller sur l'Espace Formateur
        </button>
      </div>
    );
  }

  // Company is Approved: render Departmental Cockpit with Orange & White tabs
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Department Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-orange-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Vue d’Ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab('commerce')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'commerce'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commerce & Ventes</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'marketing'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Marketing</span>
        </button>

        <button
          onClick={() => setActiveTab('hr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'hr'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ressources Humaines</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'finance'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Finance & R&D</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'accounting'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Comptabilité & Bilan</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Classement & Marché</span>
        </button>

      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'overview' && (
          <CompanyOverview
            company={company}
            session={session}
            onGoToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'commerce' && (
          <CommerceDepartment
            decisions={company.decisions}
            onChange={(decisions) => onUpdateDecisions(company.id, decisions)}
            session={session}
            stockInventory={company.stockInventory}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingDepartment
            decisions={company.decisions}
            onChange={(decisions) => onUpdateDecisions(company.id, decisions)}
            brandAwareness={company.history[company.history.length - 1]?.brandAwareness || 35}
          />
        )}

        {activeTab === 'hr' && (
          <HRDepartment
            decisions={company.decisions}
            onChange={(decisions) => onUpdateDecisions(company.id, decisions)}
            session={session}
            currentClimate={company.history[company.history.length - 1]?.hrClimate || 70}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceDepartment
            decisions={company.decisions}
            onChange={(decisions) => onUpdateDecisions(company.id, decisions)}
            cash={company.cash}
            totalDebt={company.totalDebt}
            equity={company.equity}
          />
        )}

        {activeTab === 'accounting' && (
          <AccountingDepartment
            company={company}
            session={session}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            companies={allCompanies}
            session={session}
            onSelectCompany={() => {}}
            isTrainer={false}
          />
        )}
      </div>

    </div>
  );
};
