import React from 'react';
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  Users, 
  PieChart, 
  Trophy, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Smile,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { Company, SessionConfig } from '../../types/simulation';
import { SECTOR_INFO } from '../../utils/defaultData';
import { TrendMiniChart, PerformanceGauge } from '../common/MiniCharts';

interface CompanyOverviewProps {
  company: Company;
  session: SessionConfig;
  onGoToTab: (tab: any) => void;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  company,
  session,
  onGoToTab,
}) => {
  const lastPerf = company.history[company.history.length - 1];
  const prevPerf = company.history.length > 1 ? company.history[company.history.length - 2] : undefined;
  const sector = SECTOR_INFO[company.sector];

  // Prepare trend data across all periods for mini-charts
  const revenueTrendData = company.history.length > 0
    ? company.history.map(h => ({
        label: `P${h.period}`,
        value: h.revenue,
      }))
    : [
        { label: 'Départ', value: 0 },
        { label: `P${session.currentPeriod}`, value: company.decisions.targetProduction * company.decisions.unitPrice * 0.95 }
      ];

  const cashTrendData = company.history.length > 0
    ? [
        { label: 'Init', value: session.startingBudget },
        ...company.history.map(h => ({
          label: `P${h.period}`,
          value: h.cashFlowEnd,
        }))
      ]
    : [
        { label: 'Init', value: session.startingBudget },
        { label: `P${session.currentPeriod}`, value: company.cash }
      ];

  const profitTrendData = company.history.length > 0
    ? company.history.map(h => ({
        label: `P${h.period}`,
        value: h.netProfit,
      }))
    : [
        { label: 'Départ', value: 0 },
        { label: `P${session.currentPeriod}`, value: 15000 }
      ];

  // HR & Operational metrics
  const currentHRClimate = lastPerf ? lastPerf.hrClimate : 70;
  const currentSatisfaction = lastPerf ? lastPerf.clientSatisfaction : 75;
  const currentMarketShare = lastPerf ? lastPerf.marketShare : 25;
  const currentProductivity = Math.round(Math.min(100, Math.max(30, 50 + ((currentHRClimate - 50) * 0.8))));

  return (
    <div className="space-y-6">
      
      {/* Hero Card - Orange & Blanc */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs border border-white/30">
                {sector.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/30 text-white backdrop-blur-xs border border-emerald-300/40">
                Statut : Entreprise Validée
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {company.name}
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 italic mt-1 font-medium">
              « {company.slogan} »
            </p>
            <p className="text-xs text-orange-100/90 mt-2">
              Équipe dirigeante : <strong className="text-white">{company.creatorName}</strong>
              {company.teamMembers.length > 0 && ` (${company.teamMembers.join(', ')})`}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 p-4 rounded-2xl shadow-inner">
            <div className="text-center">
              <span className="text-[11px] text-orange-100 block uppercase font-black tracking-wider">
                Rang Actuel
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-200 flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5 text-amber-300" />
                #{lastPerf ? lastPerf.rank : 1}
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[11px] text-orange-100 block uppercase font-black tracking-wider">
                Score Global
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {company.globalScore}
                <span className="text-xs text-orange-200 font-medium">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trainer feedback notice if any */}
        {company.trainerNotes && (
          <div className="mt-6 pt-4 border-t border-white/20 flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
            <div className="text-xs text-white">
              <span className="font-extrabold text-amber-200">Consigne du Formateur : </span>
              {company.trainerNotes}
            </div>
          </div>
        )}
      </div>

      {/* Mini-Graphiques d'Évolution (Chiffre d'Affaires, Trésorerie, Profit) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            Évolution Périodique (Mini-Graphiques de Tendance)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Visualisation des résultats sur les périodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Mini-Chart: Chiffre d'Affaires */}
          <TrendMiniChart
            title="Chiffre d'Affaires"
            data={revenueTrendData}
            color="orange"
            unit="MAD"
            currentValue={lastPerf ? lastPerf.revenue : (company.decisions.targetProduction * company.decisions.unitPrice * 0.95)}
            previousValue={prevPerf?.revenue}
          />

          {/* Mini-Chart: Trésorerie */}
          <TrendMiniChart
            title="Trésorerie Disponible"
            data={cashTrendData}
            color="emerald"
            unit="MAD"
            currentValue={company.cash}
            previousValue={prevPerf?.cashFlowEnd}
          />

          {/* Mini-Chart: Profit Net */}
          <TrendMiniChart
            title="Profit Net Périodique"
            data={profitTrendData}
            color="purple"
            unit="MAD"
            currentValue={lastPerf ? lastPerf.netProfit : 0}
            previousValue={prevPerf?.netProfit}
          />

        </div>
      </div>

      {/* Jauges de Performance (KPI) : RH, Productivité, Satisfaction Client, Part de Marché */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            Jauges de Performance & Climat RH
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Indicateurs qualitatifs et productivité
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Gauge 1: Climat Social RH */}
          <PerformanceGauge
            label="Climat Social RH"
            value={currentHRClimate}
            color={currentHRClimate >= 70 ? 'emerald' : currentHRClimate >= 50 ? 'amber' : 'orange'}
            subtitle="Motivation des collaborateurs"
            icon={<Users className="w-3.5 h-3.5 text-orange-600" />}
          />

          {/* Gauge 2: Productivité Usine */}
          <PerformanceGauge
            label="Productivité Usine"
            value={currentProductivity}
            color="orange"
            subtitle="Rendement moyen d'atelier"
            icon={<Zap className="w-3.5 h-3.5 text-orange-600" />}
          />

          {/* Gauge 3: Satisfaction Client */}
          <PerformanceGauge
            label="Satisfaction Client"
            value={currentSatisfaction}
            color="emerald"
            subtitle="Qualité et service après-vente"
            icon={<Smile className="w-3.5 h-3.5 text-emerald-600" />}
          />

          {/* Gauge 4: Part de Marché */}
          <PerformanceGauge
            label="Part de Marché"
            value={currentMarketShare}
            color="blue"
            subtitle="Pénétration de la demande"
            icon={<PieChart className="w-3.5 h-3.5 text-blue-600" />}
          />

        </div>
      </div>

      {/* Market Environment & Preparation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Condition Alert */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <Compass className="w-4 h-4 text-orange-600" />
            <span>Conjoncture ({session.periodLabel} {session.currentPeriod})</span>
          </div>

          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/70">
            <span className="font-black text-sm text-orange-950 block">
              {session.marketCondition.name}
            </span>
            <p className="text-xs mt-1 text-orange-800 font-medium">
              {session.marketCondition.description}
            </p>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Demande : <strong className="text-slate-800">x{session.marketCondition.demandMultiplier}</strong> • Coûts matières : <strong className="text-slate-800">x{session.marketCondition.costMultiplier}</strong>
          </p>
        </div>

        {/* Preparation Checklist */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Checklist Opérationnelle - Période {session.currentPeriod}
            </h4>
            <span className="text-xs font-bold text-orange-600">Actions requises</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div 
              onClick={() => onGoToTab('commerce')}
              className="p-3.5 bg-orange-50/50 hover:bg-orange-100/60 rounded-2xl border border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-orange-700">Commerce & Tarifs</span>
                <span className="text-slate-500 text-[11px]">Prix : {company.decisions.unitPrice} MAD • Prod : {company.decisions.targetProduction} u.</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div 
              onClick={() => onGoToTab('marketing')}
              className="p-3.5 bg-orange-50/50 hover:bg-orange-100/60 rounded-2xl border border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-orange-700">Marketing & Publicité</span>
                <span className="text-slate-500 text-[11px]">
                  Budget : {(company.decisions.digitalAdsBudget + company.decisions.mediaBrandingBudget + company.decisions.customerCareBudget).toLocaleString('fr-FR')} MAD
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div 
              onClick={() => onGoToTab('hr')}
              className="p-3.5 bg-orange-50/50 hover:bg-orange-100/60 rounded-2xl border border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-orange-700">Ressources Humaines</span>
                <span className="text-slate-500 text-[11px]">
                  Staff : {company.decisions.headcountSales + company.decisions.headcountProduction + company.decisions.headcountMarketing + company.decisions.headcountSupport} employés • Salaire : {company.decisions.averageSalary} MAD
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div 
              onClick={() => onGoToTab('finance')}
              className="p-3.5 bg-orange-50/50 hover:bg-orange-100/60 rounded-2xl border border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-orange-700">Finance & R&D</span>
                <span className="text-slate-500 text-[11px]">Trésorerie : {company.cash.toLocaleString('fr-FR')} MAD • R&D : {company.decisions.rdBudget} MAD</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* History of Past Periods */}
      {company.history.length > 0 && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Historique des Périodes Clôturées
            </h4>
            <span className="text-xs font-bold text-slate-500">
              {company.history.length} période(s) simulée(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-orange-50/70 text-[11px] font-black text-slate-600 uppercase border-b border-orange-100">
                <tr>
                  <th className="px-4 py-3">Période</th>
                  <th className="px-4 py-3 text-right">Ventes (Unités)</th>
                  <th className="px-4 py-3 text-right">C.A. Réalisé</th>
                  <th className="px-4 py-3 text-right">Profit Net</th>
                  <th className="px-4 py-3 text-right">Trésorerie Fin</th>
                  <th className="px-4 py-3 text-center">Part Marché</th>
                  <th className="px-4 py-3 text-center">Climat RH</th>
                  <th className="px-4 py-3 text-center">Rang</th>
                  <th className="px-6 py-3">Synthèse Pédagogique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 font-medium">
                {company.history.map((h) => (
                  <tr key={h.period} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {session.periodLabel} {h.period}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {h.unitsSold.toLocaleString('fr-FR')} u.
                    </td>
                    <td className="px-4 py-3 text-right font-black text-orange-600">
                      {h.revenue.toLocaleString('fr-FR')} MAD
                    </td>
                    <td className="px-4 py-3 text-right font-black">
                      <span className={h.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {h.netProfit >= 0 ? '+' : ''}{h.netProfit.toLocaleString('fr-FR')} MAD
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {h.cashFlowEnd.toLocaleString('fr-FR')} MAD
                    </td>
                    <td className="px-4 py-3 text-center font-extrabold text-amber-600">
                      {h.marketShare}%
                    </td>
                    <td className="px-4 py-3 text-center font-extrabold text-slate-800">
                      {h.hrClimate}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-black bg-orange-100 text-orange-800 text-[10px]">
                        #{h.rank}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[11px] text-slate-600 max-w-xs">
                      {h.periodSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
