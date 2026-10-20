import React, { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  Settings, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Compass, 
  FileSpreadsheet, 
  RefreshCw, 
  Sparkles, 
  Plus, 
  PieChart, 
  ArrowRight,
  ShieldAlert,
  Coins,
  MessageSquare,
  Trash2,
  KeyRound,
  Lock
} from 'lucide-react';
import { Company, SessionConfig, MarketCondition, CompanyStatus } from '../../types/simulation';
import { MARKET_SCENARIOS } from '../../utils/simulationEngine';
import { SECTOR_INFO } from '../../utils/defaultData';
import { LeaderboardView } from '../common/LeaderboardView';
import { SessionSettingsModal } from './SessionSettingsModal';

interface TrainerDashboardProps {
  session: SessionConfig;
  companies: Company[];
  onRunSimulation: () => void;
  onValidateCompany: (companyId: string, status: CompanyStatus, notes?: string) => void;
  onDeleteCompany: (companyId: string) => void;
  onDeleteAllCompanies: () => void;
  onApplyBonusMalus: (companyId: string, amount: number, reason: string) => void;
  onUpdateSession: (updated: Partial<SessionConfig>) => void;
  onResetSession: () => void;
  onOpenCreateCompany: () => void;
  onSelectCompany: (id: string) => void;
  onOpenPasswordChange: () => void;
  onLockTrainer: () => void;
}

type TrainerTab = 'validation' | 'comparison' | 'leaderboard' | 'scenarios' | 'logs';

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  session,
  companies,
  onRunSimulation,
  onValidateCompany,
  onDeleteCompany,
  onDeleteAllCompanies,
  onApplyBonusMalus,
  onUpdateSession,
  onResetSession,
  onOpenCreateCompany,
  onSelectCompany,
  onOpenPasswordChange,
  onLockTrainer,
}) => {
  const [activeTab, setActiveTab] = useState<TrainerTab>('validation');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [validationNotes, setValidationNotes] = useState<{ [key: string]: string }>({});
  const [selectedBonusCompany, setSelectedBonusCompany] = useState<string>(companies[0]?.id || '');
  const [bonusAmount, setBonusAmount] = useState<number>(10000);
  const [bonusReason, setBonusReason] = useState<string>('Subvention Innovation Régionale');

  const pendingCompanies = companies.filter(c => c.status === 'pending');
  const approvedCompanies = companies.filter(c => c.status === 'approved');
  const rejectedCompanies = companies.filter(c => c.status === 'rejected');

  const totalMarketProfit = approvedCompanies.reduce((sum, c) => sum + c.cumulativeProfit, 0);
  const totalMarketRevenue = approvedCompanies.reduce((sum, c) => sum + c.cumulativeRevenue, 0);

  const handleApprove = (companyId: string) => {
    const notes = validationNotes[companyId] || 'Dossier validé par le formateur. Prêt pour la simulation.';
    onValidateCompany(companyId, 'approved', notes);
  };

  const handleReject = (companyId: string) => {
    const notes = validationNotes[companyId] || 'Dossier refusé : plan financier ou prévisions irréalistes.';
    onValidateCompany(companyId, 'rejected', notes);
  };

  const handleDelete = (companyId: string, companyName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir SUPPRIMER définitivement l'entreprise "${companyName}" ? Cette action est irréversible.`)) {
      onDeleteCompany(companyId);
    }
  };

  const handleBonusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBonusCompany) return;
    onApplyBonusMalus(selectedBonusCompany, bonusAmount, bonusReason);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Trainer Cockpit Header - Orange & Blanc */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs border border-white/30 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                Cockpit Formateur / Administrateur
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 text-orange-100 border border-white/25">
                Code Session : {session.codePromo}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {session.title}
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Supervisez les entreprises virtuelles, validez les demandes d'immatriculation, pilotez les tours de simulation et proclamez les classements.
            </p>
          </div>

          {/* Master Simulation Button & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onRunSimulation}
              disabled={approvedCompanies.length === 0}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all transform hover:-translate-y-0.5 ${
                approvedCompanies.length === 0
                  ? 'bg-orange-300 text-orange-100 cursor-not-allowed'
                  : 'bg-white hover:bg-orange-50 text-orange-700 shadow-orange-900/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Clôturer {session.periodLabel} {session.currentPeriod} & Simuler</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-bold text-white transition-colors"
              title="Paramètres de session"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </button>

            <button
              onClick={onOpenPasswordChange}
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-bold text-white transition-colors"
              title="Modifier le mot de passe formateur"
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden sm:inline">Mot de passe</span>
            </button>

            <button
              onClick={onLockTrainer}
              className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-colors"
              title="Verrouiller l'Espace Formateur"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onDeleteAllCompanies}
              disabled={companies.length === 0}
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-rose-500/25 hover:bg-rose-500/40 border border-rose-300/40 text-xs font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Supprimer toutes les entreprises de la session (action formateur irréversible)"
            >
              <Trash2 className="w-4 h-4 text-rose-100" />
              <span className="hidden xl:inline">Supprimer Tout</span>
            </button>

            <button
              onClick={onResetSession}
              className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-colors"
              title="Réinitialiser la simulation aux valeurs par défaut"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/25">
            <span className="text-[11px] text-orange-100 block uppercase font-bold">Entreprises Actives</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
              {approvedCompanies.length} <span className="text-xs text-orange-200 font-medium">/ {companies.length}</span>
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/25">
            <span className="text-[11px] text-orange-100 block uppercase font-bold">En Attente Validation</span>
            <span className={`text-xl sm:text-2xl font-black mt-0.5 block ${
              pendingCompanies.length > 0 ? 'text-amber-200 animate-pulse' : 'text-white'
            }`}>
              {pendingCompanies.length} dossier(s)
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/25">
            <span className="text-[11px] text-orange-100 block uppercase font-bold">C.A. Global Cumulé</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
              {totalMarketRevenue.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/25">
            <span className="text-[11px] text-orange-100 block uppercase font-bold">Profit Total Promo</span>
            <span className="text-xl sm:text-2xl font-black text-amber-200 mt-0.5 block">
              {totalMarketProfit >= 0 ? '+' : ''}{totalMarketProfit.toLocaleString('fr-FR')} MAD
            </span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-orange-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('validation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'validation'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Validation des Entreprises</span>
          {pendingCompanies.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-orange-700 text-xs font-black">
              {pendingCompanies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'comparison'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tableau de Bord & Audit Promo</span>
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
          <span>Classement & Podium Session</span>
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'scenarios'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Conjoncture & Marché</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'logs'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Journal d’Activité ({session.simulationLogs.length})</span>
        </button>

      </div>

      {/* Tab 1: Validation des Entreprises (Demandes de Création) */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          
          {/* Pending Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Demandes d’Immatriculation en Attente ({pendingCompanies.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Chaque dossier doit être examiné avant la première simulation.
              </span>
            </div>

            {pendingCompanies.length === 0 ? (
              <div className="bg-white rounded-3xl border border-orange-200 p-8 text-center text-slate-500 space-y-3 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-black text-slate-800 text-base">Aucune demande en attente</h4>
                <p className="text-xs max-w-md mx-auto">
                  Toutes les entreprises créées ont été traitées. Vous pouvez lancer la simulation ou inviter de nouveaux étudiants à créer leur entreprise.
                </p>
                <button
                  onClick={onOpenCreateCompany}
                  className="inline-flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer une entreprise de test</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingCompanies.map((c) => {
                  const sector = SECTOR_INFO[c.sector];

                  return (
                    <div 
                      key={c.id}
                      className="bg-white rounded-3xl border-2 border-orange-300 p-6 shadow-md hover:shadow-lg transition-all space-y-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border mb-1.5 ${sector.color}`}>
                            {sector.label}
                          </span>
                          <h4 className="font-black text-slate-900 text-lg">{c.name}</h4>
                          <p className="text-xs text-slate-500 italic mt-0.5">« {c.slogan} »</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-300">
                          En attente
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100">
                        <div>
                          <span className="text-slate-400 block font-semibold">Fondateurs</span>
                          <span className="font-bold text-slate-800">{c.creatorName}</span>
                          <span className="text-[11px] text-slate-500 block truncate">{c.teamMembers.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Capital de départ</span>
                          <span className="font-black text-emerald-600">{c.cash.toLocaleString('fr-FR')} MAD</span>
                          <span className="text-[11px] text-slate-500 block">Objectif : {c.strategicGoal}</span>
                        </div>
                      </div>

                      {/* Trainer Feedback / Remark input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Remarques ou Consigne Pédagogique (optionnel) :
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Dossier validé. Surveillez votre seuil de rentabilité."
                          value={validationNotes[c.id] || ''}
                          onChange={(e) => setValidationNotes({ ...validationNotes, [c.id]: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
                          title="Supprimer définitivement l'entreprise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReject(c.id)}
                            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                          >
                            Refuser
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(c.id)}
                            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Valider</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Already Approved Companies */}
          <div className="bg-white rounded-3xl border border-orange-100 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Entreprises Déjà Validées & Compétitives ({approvedCompanies.length})
              </h3>
              {companies.length > 0 && (
                <button
                  type="button"
                  onClick={onDeleteAllCompanies}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer toutes les entreprises</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedCompanies.map((c) => {
                const sector = SECTOR_INFO[c.sector];
                return (
                  <div key={c.id} className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sector.color}`}>
                        {sector.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-orange-700">
                          Score : {c.globalScore}/100
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Supprimer cette entreprise"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500">{c.creatorName}</p>
                    <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Profit : <strong className={c.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{c.cumulativeProfit.toLocaleString('fr-FR')} MAD</strong></span>
                      <button
                        onClick={() => onSelectCompany(c.id)}
                        className="text-orange-600 hover:underline font-bold"
                      >
                        Voir le Cockpit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Tableau de Bord & Audit Comparatif Maître */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          
          {/* Arbitrage Bonus / Malus Tool */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Arbitrage Pédagogique : Bonus & Malus Exceptionnels
                </h3>
              </div>
              <span className="text-xs text-slate-500">Injectez des subventions ou pénalités en direct</span>
            </div>

            <form onSubmit={handleBonusSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Entreprise Cible
                </label>
                <select
                  value={selectedBonusCompany}
                  onChange={(e) => setSelectedBonusCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                >
                  {approvedCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Montant en Dirhams (MAD)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  placeholder="Ex: +10000 ou -5000"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motif Pédagogique
                </label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  placeholder="Ex: Subvention R&D ou Amende fiscale"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-colors shadow-md shadow-orange-500/20"
                >
                  Appliquer l’Arbitrage
                </button>
              </div>
            </form>
          </div>

          {/* Master Comparison Table */}
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Audit Comparatif Exhaustif de la Session
                </h3>
                <p className="text-xs text-slate-500">
                  Vue synthétique des {approvedCompanies.length} sociétés en lice
                </p>
              </div>
              <div className="flex items-center gap-3">
                {companies.length > 0 && (
                  <button
                    type="button"
                    onClick={onDeleteAllCompanies}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer tout</span>
                  </button>
                )}
                <span className="text-xs font-bold text-orange-700">
                  Période {session.currentPeriod} / {session.maxPeriods}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-orange-50/70 text-[11px] font-black text-slate-600 uppercase border-b border-orange-100">
                  <tr>
                    <th className="px-4 py-3">Entreprise</th>
                    <th className="px-3 py-3">Secteur</th>
                    <th className="px-3 py-3 text-right">Prix Unitaire</th>
                    <th className="px-3 py-3 text-right">C.A. Cumulé</th>
                    <th className="px-3 py-3 text-right">Profit Cumulé</th>
                    <th className="px-3 py-3 text-right">Trésorerie</th>
                    <th className="px-3 py-3 text-center">Part Marché</th>
                    <th className="px-3 py-3 text-center">Staff Total</th>
                    <th className="px-3 py-3 text-center">Climat RH</th>
                    <th className="px-3 py-3 text-center">Score Global</th>
                    <th className="px-3 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50 font-medium">
                  {approvedCompanies.map((c) => {
                    const lastPerf = c.history[c.history.length - 1];
                    const sector = SECTOR_INFO[c.sector];
                    const totalStaff = c.decisions.headcountSales + c.decisions.headcountProduction + c.decisions.headcountMarketing + c.decisions.headcountSupport;

                    return (
                      <tr key={c.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.creatorName}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sector.color}`}>
                            {sector.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-slate-800">
                          {c.decisions.unitPrice} MAD
                        </td>
                        <td className="px-3 py-3 text-right font-black text-orange-600">
                          {c.cumulativeRevenue.toLocaleString('fr-FR')} MAD
                        </td>
                        <td className="px-3 py-3 text-right font-black">
                          <span className={c.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {c.cumulativeProfit >= 0 ? '+' : ''}{c.cumulativeProfit.toLocaleString('fr-FR')} MAD
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold">
                          <span className={c.cash >= 0 ? 'text-slate-800' : 'text-rose-600'}>
                            {c.cash.toLocaleString('fr-FR')} MAD
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-amber-600">
                          {lastPerf ? `${lastPerf.marketShare}%` : 'En attente'}
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700">
                          {totalStaff} pers.
                        </td>
                        <td className="px-3 py-3 text-center font-semibold">
                          <span className={lastPerf && lastPerf.hrClimate < 50 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {lastPerf ? `${lastPerf.hrClimate}%` : '70%'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-800 text-[10px] border border-orange-200">
                            {c.globalScore}/100
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onSelectCompany(c.id)}
                              className="text-xs font-semibold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors"
                              title="Consulter le cockpit"
                            >
                              Cockpit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id, c.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Supprimer cette entreprise"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Classement & Podium Session */}
      {activeTab === 'leaderboard' && (
        <LeaderboardView
          companies={companies}
          session={session}
          onSelectCompany={onSelectCompany}
          isTrainer={true}
        />
      )}

      {/* Tab 4: Conjoncture Économique & Marché */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Sélection du Scénario Économique pour la Prochaine Période
                </h3>
                <p className="text-xs text-slate-500">
                  Injectez des aléas conjoncturels pour tester la réactivité des étudiants.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Actif : {session.marketCondition.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MARKET_SCENARIOS.map((sc) => {
                const isActive = session.marketCondition.id === sc.id;

                return (
                  <div
                    key={sc.id}
                    onClick={() => onUpdateSession({ marketCondition: sc })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-orange-500 bg-orange-50/70 shadow-md ring-2 ring-orange-500/20'
                        : 'border-orange-100 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sc.badgeColor}`}>
                        {sc.name}
                      </span>
                      {isActive && <CheckCircle2 className="w-5 h-5 text-orange-600" />}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {sc.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Demande : <strong>x{sc.demandMultiplier}</strong></span>
                      <span>Coûts : <strong>x{sc.costMultiplier}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Journal d'Activité & Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Journal des Événements de la Session
            </h3>
            <span className="text-xs text-slate-500">Historique des tours et arbitrages</span>
          </div>

          <div className="space-y-3">
            {session.simulationLogs.map((log, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/40 border border-orange-100 text-xs"
              >
                <span className="text-slate-400 font-mono font-bold shrink-0">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold shrink-0 text-[10px]">
                  Période {log.period}
                </span>
                <span className="text-slate-700 font-medium">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Settings Modal */}
      <SessionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        session={session}
        onSave={onUpdateSession}
      />

    </div>
  );
};
