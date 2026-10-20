import React, { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  Crown, 
  Medal, 
  Building2, 
  PieChart, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Company, SessionConfig } from '../../types/simulation';
import { SECTOR_INFO } from '../../utils/defaultData';

interface LeaderboardViewProps {
  companies: Company[];
  session: SessionConfig;
  onSelectCompany?: (id: string) => void;
  isTrainer?: boolean;
}

type SortCriteria = 'profit' | 'revenue' | 'market_share' | 'hr' | 'score';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  companies,
  session,
  onSelectCompany,
  isTrainer = false,
}) => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('profit');

  const approvedCompanies = companies.filter(c => c.status === 'approved');

  // Trigger celebratory confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Sort approved companies according to chosen criteria
  const sortedCompanies = [...approvedCompanies].sort((a, b) => {
    const lastPerfA = a.history[a.history.length - 1];
    const lastPerfB = b.history[b.history.length - 1];

    if (sortCriteria === 'profit') {
      return b.cumulativeProfit - a.cumulativeProfit;
    }
    if (sortCriteria === 'revenue') {
      return b.cumulativeRevenue - a.cumulativeRevenue;
    }
    if (sortCriteria === 'market_share') {
      const msA = lastPerfA ? lastPerfA.marketShare : 0;
      const msB = lastPerfB ? lastPerfB.marketShare : 0;
      return msB - msA;
    }
    if (sortCriteria === 'hr') {
      const hrA = lastPerfA ? lastPerfA.hrClimate : 50;
      const hrB = lastPerfB ? lastPerfB.hrClimate : 50;
      return hrB - hrA;
    }
    // 'score'
    return b.globalScore - a.globalScore;
  });

  const top3 = sortedCompanies.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="space-y-8">
      {/* Header Banner - Orange & Blanc */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              Classement Officiel de la Session
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Palmarès & Podium des Entreprises
            </h2>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Chaque fin de période, les sociétés sont évaluées selon leur capacité à générer du profit, conquérir des parts de marché et maintenir un climat social d’excellence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="flex items-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-950/10 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Célébrer le Podium</span>
            </button>
          </div>
        </div>

        {/* Podium Area (Orange & White Cards) */}
        {sortedCompanies.length >= 2 && (
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
              
              {/* 2nd Place (Silver) */}
              {second && (
                <div className="order-2 md:order-1 flex flex-col items-center">
                  <div className="relative mb-3 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white p-0.5 shadow-lg flex items-center justify-center mx-auto border border-orange-200">
                      <Medal className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow">
                      2ème
                    </span>
                  </div>
                  <div className="w-full bg-white/95 rounded-2xl p-4 text-center shadow-lg border border-orange-200 text-slate-900">
                    <h3 className="font-black text-slate-900 text-base truncate">{second.name}</h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{second.creatorName}</p>
                    <div className="mt-3 py-2 px-3 bg-orange-50/70 rounded-xl border border-orange-100">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Profit Réalisé</span>
                      <span className={`text-sm font-black ${second.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {second.cumulativeProfit >= 0 ? '+' : ''}{second.cumulativeProfit.toLocaleString('fr-FR')} MAD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place (Gold Champion) */}
              {first && (
                <div className="order-1 md:order-2 flex flex-col items-center">
                  <div className="relative mb-3 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-amber-300 p-1 shadow-xl shadow-amber-900/20 flex items-center justify-center mx-auto animate-bounce" style={{ animationDuration: '3s' }}>
                      <Crown className="w-10 h-10 text-amber-950" />
                    </div>
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-xs font-black px-3.5 py-0.5 rounded-full shadow-lg border border-amber-300">
                      1er CHAMPION
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-3xl p-5 text-center shadow-xl border-2 border-amber-400 text-slate-900 relative">
                    <h3 className="font-black text-slate-900 text-lg truncate">{first.name}</h3>
                    <p className="text-xs text-orange-700 font-semibold truncate mt-0.5">{first.creatorName}</p>
                    <div className="mt-3 py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-800 block uppercase font-black">Profit Cumulé</span>
                      <span className={`text-lg font-black ${first.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {first.cumulativeProfit >= 0 ? '+' : ''}{first.cumulativeProfit.toLocaleString('fr-FR')} MAD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {third && (
                <div className="order-3 flex flex-col items-center">
                  <div className="relative mb-3 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white p-0.5 shadow-lg flex items-center justify-center mx-auto border border-orange-200">
                      <Medal className="w-8 h-8 text-amber-700" />
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow border border-amber-200">
                      3ème
                    </span>
                  </div>
                  <div className="w-full bg-white/95 rounded-2xl p-4 text-center shadow-lg border border-orange-200 text-slate-900">
                    <h3 className="font-black text-slate-900 text-base truncate">{third.name}</h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{third.creatorName}</p>
                    <div className="mt-3 py-2 px-3 bg-orange-50/70 rounded-xl border border-orange-100">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Profit Réalisé</span>
                      <span className={`text-sm font-black ${third.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {third.cumulativeProfit >= 0 ? '+' : ''}{third.cumulativeProfit.toLocaleString('fr-FR')} MAD
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Sorting Criteria Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Classer par :
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortCriteria('profit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortCriteria === 'profit'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Profit Net Cumulé</span>
          </button>

          <button
            onClick={() => setSortCriteria('revenue')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortCriteria === 'revenue'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Chiffre d’Affaires</span>
          </button>

          <button
            onClick={() => setSortCriteria('market_share')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortCriteria === 'market_share'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Part de Marché</span>
          </button>

          <button
            onClick={() => setSortCriteria('hr')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortCriteria === 'hr'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Climat Social RH</span>
          </button>

          <button
            onClick={() => setSortCriteria('score')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortCriteria === 'score'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Score Global SimuBiz</span>
          </button>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base">
            Tableau Comparatif des {approvedCompanies.length} Entreprises Actives
          </h3>
          <span className="text-xs font-bold text-orange-700">
            Période : {session.periodLabel} {session.currentPeriod}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-orange-50/70 text-xs text-slate-600 font-black uppercase tracking-wider border-b border-orange-100">
              <tr>
                <th className="px-4 py-3 text-center w-16">Rang</th>
                <th className="px-6 py-3">Entreprise & Équipe</th>
                <th className="px-4 py-3">Secteur</th>
                <th className="px-4 py-3 text-right">Profit Cumulé</th>
                <th className="px-4 py-3 text-right">C.A. Cumulé</th>
                <th className="px-4 py-3 text-right">Part Marché</th>
                <th className="px-4 py-3 text-right">Trésorerie</th>
                <th className="px-4 py-3 text-center">Climat RH</th>
                <th className="px-4 py-3 text-center">Score Global</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50 font-medium">
              {sortedCompanies.map((company, index) => {
                const rank = index + 1;
                const lastPerf = company.history[company.history.length - 1];
                const sector = SECTOR_INFO[company.sector];

                return (
                  <tr 
                    key={company.id} 
                    className={`hover:bg-orange-50/40 transition-colors ${
                      rank === 1 ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="px-4 py-4 text-center">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-black text-xs">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-black text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold text-xs">
                          #{rank}
                        </span>
                      )}
                    </td>

                    {/* Company Identity */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 hover:text-orange-600 transition-colors">
                            {company.name}
                          </span>
                          {rank === 1 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              Leader
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {company.creatorName} • <span className="italic">{company.slogan}</span>
                        </p>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${sector.color}`}>
                        {sector.label}
                      </span>
                    </td>

                    {/* Cumulative Profit */}
                    <td className="px-4 py-4 text-right">
                      <span className={`font-black ${
                        company.cumulativeProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {company.cumulativeProfit >= 0 ? '+' : ''}
                        {company.cumulativeProfit.toLocaleString('fr-FR')} MAD
                      </span>
                    </td>

                    {/* Cumulative Revenue */}
                    <td className="px-4 py-4 text-right font-black text-slate-800">
                      {company.cumulativeRevenue.toLocaleString('fr-FR')} MAD
                    </td>

                    {/* Market share */}
                    <td className="px-4 py-4 text-right">
                      <span className="font-extrabold text-amber-600">
                        {lastPerf ? `${lastPerf.marketShare}%` : 'En attente'}
                      </span>
                    </td>

                    {/* Cash */}
                    <td className="px-4 py-4 text-right">
                      <span className={`font-extrabold ${
                        company.cash > 20000 ? 'text-slate-800' : company.cash > 0 ? 'text-amber-600' : 'text-rose-600 font-bold'
                      }`}>
                        {company.cash.toLocaleString('fr-FR')} MAD
                      </span>
                    </td>

                    {/* HR Climate */}
                    <td className="px-4 py-4 text-center">
                      {lastPerf ? (
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-12 bg-orange-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                lastPerf.hrClimate > 70 ? 'bg-emerald-500' : lastPerf.hrClimate > 45 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${lastPerf.hrClimate}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-slate-700">{lastPerf.hrClimate}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Global Score / 100 */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full font-black text-xs bg-orange-100 text-orange-800 border border-orange-200">
                        {company.globalScore} / 100
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center">
                      {onSelectCompany && (
                        <button
                          onClick={() => onSelectCompany(company.id)}
                          className="text-xs font-bold text-orange-700 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Gérer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
