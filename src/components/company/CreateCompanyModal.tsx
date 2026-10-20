import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Sparkles, 
  Users, 
  Target, 
  Coins, 
  CheckCircle2,
  Cpu,
  Car,
  Leaf,
  ShoppingBag,
  HeartPulse,
  Zap
} from 'lucide-react';
import { Company, CompanySector, StrategicGoal, SessionConfig } from '../../types/simulation';
import { SECTOR_INFO } from '../../utils/defaultData';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionConfig;
  onCreate: (company: Company) => void;
  isTrainer?: boolean;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
  session,
  onCreate,
  isTrainer = false,
}) => {
  const [name, setName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [sector, setSector] = useState<CompanySector>('tech');
  const [slogan, setSlogan] = useState('');
  const [strategicGoal, setStrategicGoal] = useState<StrategicGoal>('profit');
  const [autoApprove, setAutoApprove] = useState(isTrainer);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const team = teamMembersInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: name.trim(),
      creatorName: creatorName.trim() || 'Équipe Nouvelle Entreprise',
      teamMembers: team.length > 0 ? team : [creatorName || 'Fondateur'],
      sector,
      logoColor: 'from-blue-600 to-indigo-600',
      slogan: slogan.trim() || 'Innover et performer durablement',
      status: autoApprove ? 'approved' : 'pending',
      trainerNotes: autoApprove 
        ? 'Entreprise validée directement.' 
        : 'Nouvelle demande de création soumise au formateur pour examen des prévisions.',
      createdAt: new Date().toISOString().split('T')[0],
      strategicGoal,
      cash: session.startingBudget,
      totalDebt: 0,
      equity: session.startingBudget,
      fixedAssets: 25000,
      stockInventory: 0,
      cumulativeProfit: 0,
      cumulativeRevenue: 0,
      globalScore: 50,
      decisions: {
        unitPrice: session.baseReferencePrice,
        targetProduction: 4000,
        distributionChannels: {
          directWeb: true,
          retailStores: false,
          b2bNetwork: false,
          export: false,
        },
        discountRate: 0,
        digitalAdsBudget: 10000,
        mediaBrandingBudget: 5000,
        customerCareBudget: 3000,
        headcountSales: 3,
        headcountProduction: 9,
        headcountMarketing: 2,
        headcountSupport: 2,
        averageSalary: session.baseReferenceSalary,
        trainingBudget: 3000,
        wellbeingBudget: 2500,
        loanRequested: 0,
        loanRepayment: 0,
        rdBudget: 8000,
        automationInvestment: 5000,
      },
      history: [],
    };

    onCreate(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header - Orange & Blanc */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Créer une Nouvelle Entreprise Virtuelle
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                Enregistrement du statut juridique et soumission au Formateur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la modal"
            className="text-white hover:bg-white/20 p-1.5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Identité Entreprise */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              1. Identité & Raison Sociale
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l’Entreprise <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Apex Dynamics, Solaris Tech..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l’Équipe / Responsable <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Ex: Équipe Alpha (Marc & Sophie)"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan & Mission
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Ex: La mobilité électrique accessible à tous sans compromis"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Membres de l’équipe (séparés par des virgules)
              </label>
              <input
                type="text"
                value={teamMembersInput}
                onChange={(e) => setTeamMembersInput(e.target.value)}
                placeholder="Ex: Sophie Martin, Marc Dubois, Alex K."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Secteur d'activité */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              2. Secteur d’Activité
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(SECTOR_INFO) as CompanySector[]).map((s) => {
                const info = SECTOR_INFO[s];
                const isSelected = sector === s;

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSector(s)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{info.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {info.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objectif Stratégique Principal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              3. Objectif Stratégique Principal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'profit',
                  title: 'Maximisation du Profit Net',
                  desc: 'Optimiser les marges et la rentabilité financière immédiate.',
                },
                {
                  id: 'market_share',
                  title: 'Conquête de Part de Marché',
                  desc: 'Stratégie agressive de volume, marketing et présence commerciale.',
                },
                {
                  id: 'hr_excellence',
                  title: 'Excellence RH & QVT',
                  desc: 'Salaires attractifs, formation continue et bien-être des salariés.',
                },
                {
                  id: 'quality_innovation',
                  title: 'Qualité Produit & R&D',
                  desc: 'Forte valeur perçue, innovation technologique et fiabilité.',
                },
              ].map((goal) => {
                const isSelected = strategicGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setStrategicGoal(goal.id as StrategicGoal)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{goal.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{goal.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capital de départ & Validation Mode */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Capital de départ alloué :
                </span>
                <span className="text-sm font-extrabold text-emerald-600">
                  {session.startingBudget.toLocaleString('fr-FR')} MAD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fixé par les paramètres du formateur pour la session en cours.
              </p>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">
                Valider immédiatement
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Soumettre la Création d’Entreprise</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
