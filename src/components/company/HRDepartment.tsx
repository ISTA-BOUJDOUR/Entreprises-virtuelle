import React from 'react';
import { 
  Users, 
  Smile, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  UserCheck,
  Zap
} from 'lucide-react';
import { CompanyDecisions, SessionConfig } from '../../types/simulation';

interface HRDepartmentProps {
  decisions: CompanyDecisions;
  onChange: (decisions: CompanyDecisions) => void;
  session: SessionConfig;
  currentClimate?: number;
}

export const HRDepartment: React.FC<HRDepartmentProps> = ({
  decisions,
  onChange,
  session,
  currentClimate = 70,
}) => {
  const updateDecision = <K extends keyof CompanyDecisions>(
    key: K,
    value: CompanyDecisions[K]
  ) => {
    onChange({
      ...decisions,
      [key]: value,
    });
  };

  const totalHeadcount = 
    decisions.headcountSales + 
    decisions.headcountProduction + 
    decisions.headcountMarketing + 
    decisions.headcountSupport;

  // Quarterly payroll calculation: headcount * salary * 1.42 (charges patronales) * 3 months
  const quarterlySalaries = Math.round(totalHeadcount * decisions.averageSalary * 1.42 * 3);
  const totalHRCost = quarterlySalaries + decisions.trainingBudget + decisions.wellbeingBudget;

  // Real-time estimated climate
  const salaryRatio = decisions.averageSalary / session.baseReferenceSalary;
  const estimatedClimate = Math.min(100, Math.max(15, Math.round(
    55 + 
    (salaryRatio - 1) * 80 + 
    Math.min(15, (decisions.wellbeingBudget / 1500) * 5) + 
    Math.min(10, (decisions.trainingBudget / 2000) * 4)
  )));

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Département Ressources Humaines (RH)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos effectifs, vos rémunérations et le climat social pour maximiser la productivité et la fidélisation.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 px-4 py-2.5 rounded-xl">
          <Smile className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-900">Climat Social Estimé : </span>
            <span className={`font-extrabold ${
              estimatedClimate >= 75 ? 'text-emerald-700' : estimatedClimate >= 50 ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {estimatedClimate} %
            </span>
          </div>
        </div>
      </div>

      {/* Headcount Sliders */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              Répartition des Effectifs par Métier
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Effectif total actuel : <span className="font-bold text-slate-800">{totalHeadcount} collaborateurs</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Commerciaux */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Force Commerciale</span>
              <span className="text-sm font-extrabold text-blue-600">
                {decisions.headcountSales}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={decisions.headcountSales}
              onChange={(e) => updateDecision('headcountSales', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Signent les contrats et augmentent le volume des ventes.
            </p>
          </div>

          {/* Production */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Opérateurs Production</span>
              <span className="text-sm font-extrabold text-amber-600">
                {decisions.headcountProduction}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={decisions.headcountProduction}
              onChange={(e) => updateDecision('headcountProduction', Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Capacité : ~{decisions.headcountProduction * 420} unités fabriquées.
            </p>
          </div>

          {/* Marketing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Équipe Marketing</span>
              <span className="text-sm font-extrabold text-purple-600">
                {decisions.headcountMarketing}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={decisions.headcountMarketing}
              onChange={(e) => updateDecision('headcountMarketing', Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Pilote l’impact des campagnes publicitaires.
            </p>
          </div>

          {/* Support */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Support Client / SAV</span>
              <span className="text-sm font-extrabold text-rose-600">
                {decisions.headcountSupport}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={decisions.headcountSupport}
              onChange={(e) => updateDecision('headcountSupport', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Gère les réclamations et fidélise les clients.
            </p>
          </div>

        </div>
      </div>

      {/* Salary & Employee Investments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Average Salary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Politique Salariale
            </h4>
            <span className="text-xs font-bold text-emerald-600">
              {decisions.averageSalary.toLocaleString('fr-FR')} MAD / mois
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Salaire brut mensuel moyen par collaborateur.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="2000"
              max="4000"
              step="50"
              value={decisions.averageSalary}
              onChange={(e) => updateDecision('averageSalary', Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>2 000 MAD (Faible)</span>
              <span className="text-slate-700 font-semibold">Marché : {session.baseReferenceSalary} MAD</span>
              <span>4 000 MAD (Élite)</span>
            </div>
          </div>

          {decisions.averageSalary < session.baseReferenceSalary && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                Attention : Le salaire proposé est inférieur à la moyenne du marché ({session.baseReferenceSalary} MAD). Risque de démotivation et de turnover.
              </span>
            </div>
          )}
        </div>

        {/* Formation Continue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Formation Continue
            </h4>
            <span className="text-xs font-bold text-blue-600">
              {decisions.trainingBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Stages professionnels, certifications et perfectionnement technique.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={decisions.trainingBudget}
              onChange={(e) => updateDecision('trainingBudget', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>10 000 MAD</span>
              <span>20 000 MAD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
            Augmente directement la compétence des équipes et la qualité finale des produits.
          </div>
        </div>

        {/* Qualité de Vie au Travail (QVT) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Qualité de Vie au Travail (QVT)
            </h4>
            <span className="text-xs font-bold text-rose-600">
              {decisions.wellbeingBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Aménagement des bureaux, mutuelle avantageuse, team building et ergonomie.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0"
              max="15000"
              step="250"
              value={decisions.wellbeingBudget}
              onChange={(e) => updateDecision('wellbeingBudget', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>7 500 MAD</span>
              <span>15 000 MAD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
            Renforce l'engagement, réduit l'absentéisme et bonifie le score RSE.
          </div>
        </div>

      </div>

      {/* Payroll Cost Recap - Orange & Blanc */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black text-orange-100 uppercase tracking-wider block mb-1">
            Masse Salariale & Charges Trimestrielles
          </span>
          <h4 className="text-xl sm:text-2xl font-black">
            Charges RH Totales : {totalHRCost.toLocaleString('fr-FR')} MAD / trimestre
          </h4>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            Dont {quarterlySalaries.toLocaleString('fr-FR')} MAD de salaires bruts + cotisations sociales patronales (taux légal 42%).
          </p>
        </div>

        <div className="w-full md:w-64 bg-white/20 backdrop-blur-xs p-4 rounded-2xl border border-white/30 text-center">
          <span className="text-[11px] text-orange-100 block font-bold uppercase">Indice de Productivité Estimé</span>
          <span className="text-2xl font-black text-white">
            +{Math.round(((estimatedClimate - 50) / 100) * 40)} %
          </span>
          <span className="text-[10px] text-orange-100 block mt-1 font-medium">
            Impact direct sur le rendement d'usine
          </span>
        </div>
      </div>

    </div>
  );
};
