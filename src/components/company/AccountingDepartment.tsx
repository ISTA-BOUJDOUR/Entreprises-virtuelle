import React from 'react';
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Company, SessionConfig, PeriodPerformance } from '../../types/simulation';

interface AccountingDepartmentProps {
  company: Company;
  session: SessionConfig;
}

export const AccountingDepartment: React.FC<AccountingDepartmentProps> = ({
  company,
  session,
}) => {
  const lastPerf = company.history[company.history.length - 1];

  // If no simulation has run yet, calculate a preview estimate from current decisions
  const isEstimated = !lastPerf;

  const revenue = lastPerf ? lastPerf.revenue : Math.round(company.decisions.targetProduction * company.decisions.unitPrice * 0.95);
  const cogs = lastPerf ? lastPerf.costOfGoodsSold : Math.round(company.decisions.targetProduction * session.baseReferencePrice * 0.44);
  const grossMargin = lastPerf ? lastPerf.grossMargin : revenue - cogs;
  
  const totalStaff = company.decisions.headcountSales + company.decisions.headcountProduction + company.decisions.headcountMarketing + company.decisions.headcountSupport;
  const hrCost = lastPerf ? lastPerf.hrCost : Math.round(totalStaff * company.decisions.averageSalary * 1.42 * 3) + company.decisions.trainingBudget + company.decisions.wellbeingBudget;
  const marketingCost = lastPerf ? lastPerf.marketingCost : company.decisions.digitalAdsBudget + company.decisions.mediaBrandingBudget + company.decisions.customerCareBudget;
  const fixedCosts = lastPerf ? lastPerf.fixedCosts : 18000;
  const financialInterest = lastPerf ? lastPerf.financialInterest : Math.round(company.totalDebt * (0.045 / 4));
  
  const ebit = lastPerf ? lastPerf.ebit : grossMargin - hrCost - marketingCost - fixedCosts - financialInterest;
  const taxes = lastPerf ? lastPerf.taxes : (ebit > 0 ? Math.round(ebit * 0.25) : 0);
  const netProfit = lastPerf ? lastPerf.netProfit : ebit - taxes;

  // Balance sheet metrics
  const fixedAssets = company.fixedAssets;
  const stockValue = company.stockInventory * Math.round(session.baseReferencePrice * 0.44);
  const cash = company.cash;
  const totalAssets = fixedAssets + stockValue + cash;

  const equity = company.equity;
  const debt = company.totalDebt;
  const retainedProfit = company.cumulativeProfit;
  const totalLiabilities = equity + debt + retainedProfit;

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Département Comptabilité & États Financiers
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Examen du Compte de Résultat (SIG) et du Bilan comptable synthétique (Actif / Passif).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEstimated ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              📊 Prévisionnel Période {session.currentPeriod}
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Réalisé Période {lastPerf.period} ({session.periodLabel})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compte de Résultat (Income Statement) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Compte de Résultat Synthétique
            </h4>
            <span className="text-xs font-semibold text-slate-500">En Dirhams (MAD HT)</span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            
            {/* Chiffre d'Affaires */}
            <div className="py-2.5 flex items-center justify-between font-bold text-slate-900">
              <span>Chiffre d’Affaires Net (CA)</span>
              <span className="text-base text-blue-600">
                +{revenue.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Coûts de Production (COGS) */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Coût des Marchandises & Production</span>
              <span className="text-rose-600 font-semibold">
                -{cogs.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Marge Brute */}
            <div className="py-2 flex items-center justify-between font-bold text-slate-800 bg-slate-50 px-3 rounded-lg">
              <span>= Marge Brute Globale</span>
              <span className="text-emerald-600">
                {grossMargin.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Charges RH */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Charges de Personnel & RH (salaires + cotisations)</span>
              <span className="text-rose-600 font-semibold">
                -{hrCost.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Marketing */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Dépenses Publicitaires & Marketing</span>
              <span className="text-rose-600 font-semibold">
                -{marketingCost.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Charges Fixes */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Charges Fixes d’Exploitation (loyers, canaux)</span>
              <span className="text-rose-600 font-semibold">
                -{fixedCosts.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Frais Financiers */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Intérêts Financiers de la Dette Bancaire</span>
              <span className="text-rose-600 font-semibold">
                -{financialInterest.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Résultat d'Exploitation (EBITDA) */}
            <div className="py-2.5 flex items-center justify-between font-bold text-slate-900 bg-slate-50 px-3 rounded-lg">
              <span>= Résultat Courant d’Exploitation (EBIT)</span>
              <span className={ebit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {ebit >= 0 ? '+' : ''}{ebit.toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Impôt sur les Sociétés */}
            <div className="py-2 flex items-center justify-between text-slate-600 text-xs">
              <span className="pl-3">- Impôt sur les Sociétés (IS à 25%)</span>
              <span className="text-slate-700 font-semibold">
                {taxes > 0 ? `-${taxes.toLocaleString('fr-FR')} MAD` : '0 MAD (déficit)'}
              </span>
            </div>

            {/* Résultat Net Final */}
            <div className={`py-3.5 px-3.5 rounded-xl flex items-center justify-between font-extrabold text-base mt-2 ${
              netProfit >= 0 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              <span>RÉSULTAT NET COMPTABLE</span>
              <span className={`text-lg font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fr-FR')} MAD
              </span>
            </div>

          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
            Marge nette : <span className="font-bold text-slate-800">{revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0}%</span> du chiffre d’affaires.
          </div>
        </div>

        {/* Bilan Comptable (Balance Sheet) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Bilan Comptable Synthétique
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Patrimoine de l'Entreprise
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* ACTIF */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                ACTIF (Emplois)
              </h5>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Immobilisations Nettes</span>
                  <span className="font-bold text-slate-800">{fixedAssets.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Stocks Marchandises ({company.stockInventory} u.)</span>
                  <span className="font-bold text-slate-800">{stockValue.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Trésorerie Active (Banque)</span>
                  <span className="font-bold text-slate-800">{cash.toLocaleString('fr-FR')} MAD</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-xs text-slate-900">
                <span>TOTAL ACTIF</span>
                <span className="text-blue-600 font-black">{totalAssets.toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>

            {/* PASSIF */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                PASSIF (Ressources)
              </h5>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Capital Social Initial</span>
                  <span className="font-bold text-slate-800">{equity.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Résultats Cumulés Reportés</span>
                  <span className={`font-bold ${retainedProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {retainedProfit >= 0 ? '+' : ''}{retainedProfit.toLocaleString('fr-FR')} MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Emprunts & Dettes Bancaires</span>
                  <span className="font-bold text-slate-800">{debt.toLocaleString('fr-FR')} MAD</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-xs text-slate-900">
                <span>TOTAL PASSIF</span>
                <span className="text-indigo-600 font-black">{totalLiabilities.toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>

          </div>

          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950">
              <span className="font-bold block">Principe de la partie double respecté :</span>
              L’actif représente ce que l’entreprise possède pour fonctionner (outils, stocks, trésorerie) tandis que le passif détaille d’où provient l’argent (actionnaires et emprunts bancaires).
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
