import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  X,
  PieChart
} from 'lucide-react';
import { Company, SessionConfig } from '../../types/simulation';

interface PeriodSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: number;
  session: SessionConfig;
  companies: Company[];
  onGoToLeaderboard: () => void;
}

export const PeriodSimulationModal: React.FC<PeriodSimulationModalProps> = ({
  isOpen,
  onClose,
  period,
  session,
  companies,
  onGoToLeaderboard,
}) => {
  if (!isOpen) return null;

  const approvedCompanies = companies.filter(c => c.status === 'approved');

  // Find best performers in this period
  const companiesWithThisPeriod = approvedCompanies
    .map(c => {
      const perf = c.history.find(h => h.period === period);
      return { company: c, perf };
    })
    .filter(item => item.perf !== undefined);

  const bestProfit = [...companiesWithThisPeriod].sort((a, b) => b.perf!.netProfit - a.perf!.netProfit)[0];
  const bestMarketShare = [...companiesWithThisPeriod].sort((a, b) => b.perf!.marketShare - a.perf!.marketShare)[0];
  const bestHR = [...companiesWithThisPeriod].sort((a, b) => b.perf!.hrClimate - a.perf!.hrClimate)[0];

  const totalMarketVolumeSold = companiesWithThisPeriod.reduce((sum, item) => sum + item.perf!.unitsSold, 0);
  const totalMarketRevenue = companiesWithThisPeriod.reduce((sum, item) => sum + item.perf!.revenue, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Orange & Blanc */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-white text-orange-600 flex items-center justify-center mx-auto shadow-xl mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-black text-orange-100 tracking-wider block mb-1">
            Résultats de la Simulation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Clôture de la Période {period} Réussie !
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md mx-auto font-medium">
            Le marché virtuel a traité l'ensemble des décisions commerciales, RH, marketing et financières.
          </p>
        </div>

        {/* Global Market Stats */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-bold block">Volume Total Vendu</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                {totalMarketVolumeSold.toLocaleString('fr-FR')} unités
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-bold block">Chiffre d’Affaires Global</span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 mt-1 block">
                {totalMarketRevenue.toLocaleString('fr-FR')} MAD
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Trophées de la Période {period}
            </h3>

            {bestProfit && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-800 font-semibold block">Champion de la Rentabilité</span>
                    <span className="text-sm font-extrabold text-emerald-950">{bestProfit.company.name}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700">
                  +{bestProfit.perf!.netProfit.toLocaleString('fr-FR')} MAD
                </span>
              </div>
            )}

            {bestMarketShare && (
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-purple-800 font-semibold block">Leader Parts de Marché</span>
                    <span className="text-sm font-extrabold text-purple-950">{bestMarketShare.company.name}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-purple-700">
                  {bestMarketShare.perf!.marketShare}% du marché
                </span>
              </div>
            )}

            {bestHR && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-800 font-semibold block">Meilleur Climat Social RH</span>
                    <span className="text-sm font-extrabold text-amber-950">{bestHR.company.name}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-700">
                  {bestHR.perf!.hrClimate}% satisfaction
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Fermer
            </button>

            <button
              onClick={() => {
                onClose();
                onGoToLeaderboard();
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-white" />
              <span>Consulter le Classement Complet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
