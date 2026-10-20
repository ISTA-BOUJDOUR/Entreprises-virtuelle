import React from 'react';
import { 
  Wallet, 
  Landmark, 
  Microscope, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  AlertCircle,
  PiggyBank,
  TrendingUp
} from 'lucide-react';
import { CompanyDecisions } from '../../types/simulation';

interface FinanceDepartmentProps {
  decisions: CompanyDecisions;
  onChange: (decisions: CompanyDecisions) => void;
  cash: number;
  totalDebt: number;
  equity: number;
}

export const FinanceDepartment: React.FC<FinanceDepartmentProps> = ({
  decisions,
  onChange,
  cash,
  totalDebt,
  equity,
}) => {
  const updateDecision = <K extends keyof CompanyDecisions>(
    key: K,
    value: number
  ) => {
    onChange({
      ...decisions,
      [key]: value,
    });
  };

  const currentInterestEstimate = Math.round((totalDebt + decisions.loanRequested) * (0.045 / 4));
  const debtRatio = equity > 0 ? Math.round(((totalDebt + decisions.loanRequested) / equity) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Département Finance & Investissements
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pilotez votre structure financière, vos investissements technologiques et vos financements bancaires.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 px-4 py-2.5 rounded-xl">
          <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-emerald-900">Trésorerie Actuelle : </span>
            <span className={`font-black ${cash >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {cash.toLocaleString('fr-FR')} MAD
            </span>
          </div>
        </div>
      </div>

      {/* Financial Structure Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Trésorerie Disponible</span>
          <span className={`text-2xl font-black mt-1 block ${cash > 10000 ? 'text-slate-900' : 'text-rose-600'}`}>
            {cash.toLocaleString('fr-FR')} MAD
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Liquidités en banque</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Dette Bancaire Totale</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {(totalDebt + decisions.loanRequested - decisions.loanRepayment).toLocaleString('fr-FR')} MAD
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Intérêts : ~{currentInterestEstimate} MAD / trimestre (4.5% an)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Capitaux Propres & Solvabilité</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            {equity.toLocaleString('fr-FR')} MAD
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ratio d’endettement : <span className="font-bold text-slate-700">{debtRatio}%</span>
          </span>
        </div>
      </div>

      {/* Investments & Loans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* R&D & Automation Investments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Microscope className="w-4 h-4 text-indigo-600" />
              Investissements R&D & Modernisation Industrielle
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Améliorez durablement la compétitivité hors-prix et les coûts unitaires.
            </p>
          </div>

          {/* R&D Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-indigo-600" />
                Budget Recherche & Développement (R&D)
              </span>
              <span className="text-sm font-extrabold text-indigo-600">
                {decisions.rdBudget.toLocaleString('fr-FR')} MAD
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="1000"
              value={decisions.rdBudget}
              onChange={(e) => updateDecision('rdBudget', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>15 000 MAD</span>
              <span>30 000 MAD</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Améliore la note de qualité perçue et la fidélisation des acheteurs exigeants.
            </p>
          </div>

          {/* Automation Investment */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                Automatisation & Robotisation des Usines
              </span>
              <span className="text-sm font-extrabold text-teal-600">
                {decisions.automationInvestment.toLocaleString('fr-FR')} MAD
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40000"
              step="1000"
              value={decisions.automationInvestment}
              onChange={(e) => updateDecision('automationInvestment', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>20 000 MAD</span>
              <span>40 000 MAD</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Réduit le coût unitaire de fabrication de vos produits (jusqu’à -25% d’économie d'échelle).
            </p>
          </div>

        </div>

        {/* Banking Operations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              Opérations Bancaires & Crédit
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Financez votre fonds de roulement ou désendettez la société.
            </p>
          </div>

          {/* Loan Request */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                Nouvel Emprunt Bancaire Demandé
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                +{decisions.loanRequested.toLocaleString('fr-FR')} MAD
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80000"
              step="5000"
              value={decisions.loanRequested}
              onChange={(e) => updateDecision('loanRequested', Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>40 000 MAD</span>
              <span>80 000 MAD</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Taux bancaire appliqué : 4,5% l'an (soit ~1,12% par trimestre).
            </p>
          </div>

          {/* Loan Repayment */}
          {totalDebt > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                  Remboursement Anticipé du Capital
                </span>
                <span className="text-sm font-extrabold text-rose-600">
                  -{decisions.loanRepayment.toLocaleString('fr-FR')} MAD
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(totalDebt, Math.max(0, cash - 10000))}
                step="2500"
                value={decisions.loanRepayment}
                onChange={(e) => updateDecision('loanRepayment', Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 MAD</span>
                <span>{Math.min(totalDebt, Math.max(0, cash - 10000)).toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>
          )}

          {/* Solvency Warning */}
          {debtRatio > 80 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Attention au surendettement : Votre ratio dette / capitaux propres atteint {debtRatio}%. Les banques appliquent des primes de risque si la dette dépasse les fonds propres.
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
