import React from 'react';
import { 
  Megaphone, 
  Share2, 
  Tv, 
  HeartHandshake, 
  Sparkles, 
  TrendingUp, 
  Info,
  DollarSign
} from 'lucide-react';
import { CompanyDecisions } from '../../types/simulation';

interface MarketingDepartmentProps {
  decisions: CompanyDecisions;
  onChange: (decisions: CompanyDecisions) => void;
  brandAwareness?: number;
}

export const MarketingDepartment: React.FC<MarketingDepartmentProps> = ({
  decisions,
  onChange,
  brandAwareness = 35,
}) => {
  const updateBudget = <K extends keyof CompanyDecisions>(
    key: K,
    value: number
  ) => {
    onChange({
      ...decisions,
      [key]: value,
    });
  };

  const totalMarketingBudget = 
    decisions.digitalAdsBudget + 
    decisions.mediaBrandingBudget + 
    decisions.customerCareBudget;

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Département Marketing & Communication
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Développez votre notoriété, attirez de nouveaux clients et fidélisez votre base acquise.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-200 px-4 py-2.5 rounded-xl">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-purple-900">Budget Marketing Période : </span>
            <span className="font-extrabold text-purple-700">
              {totalMarketingBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>
        </div>
      </div>

      {/* 3 Budget Levers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Digital Advertising */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Share2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Publicité Digitale</h4>
            </div>
            <span className="text-xs font-bold text-blue-600">
              {decisions.digitalAdsBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Campagnes Google Ads, Meta Ads et influenceurs. Génère du trafic et des conversions directes.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0"
              max="40000"
              step="500"
              value={decisions.digitalAdsBudget}
              onChange={(e) => updateBudget('digitalAdsBudget', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>20 000 MAD</span>
              <span>40 000 MAD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
            Impact : Acquisition immédiate de commandes en ligne et B2B.
          </div>
        </div>

        {/* Media & Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Tv className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Image & Salons Pro</h4>
            </div>
            <span className="text-xs font-bold text-purple-600">
              {decisions.mediaBrandingBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Participation aux salons industriels, relations presse et campagnes d’affichage nationales.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0"
              max="30000"
              step="500"
              value={decisions.mediaBrandingBudget}
              onChange={(e) => updateBudget('mediaBrandingBudget', Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>15 000 MAD</span>
              <span>30 000 MAD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
            Impact : Hausse durable de la notoriété et justification d’un prix plus élevé.
          </div>
        </div>

        {/* Customer Care & Loyalty */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Fidélisation & SAV</h4>
            </div>
            <span className="text-xs font-bold text-rose-600">
              {decisions.customerCareBudget.toLocaleString('fr-FR')} MAD
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Programme de parrainage, service client réactif, extensions de garantie et communauté.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0"
              max="20000"
              step="250"
              value={decisions.customerCareBudget}
              onChange={(e) => updateBudget('customerCareBudget', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 MAD</span>
              <span>10 000 MAD</span>
              <span>20 000 MAD</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
            Impact : Améliore la note de satisfaction et le bouche-à-oreille positif.
          </div>
        </div>

      </div>

      {/* Strategic Marketing Insights - Orange & Blanc */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black text-orange-100 uppercase tracking-wider block mb-1">
            Indicateur de Notoriété de Marque
          </span>
          <h4 className="text-xl sm:text-2xl font-black">
            Notoriété estimée : ~{brandAwareness}%
          </h4>
          <p className="text-xs text-orange-100 mt-1 max-w-xl font-medium">
            Une notoriété supérieure à 50% permet de capter les segments de clientèle les plus rentables face aux concurrents moins visibles.
          </p>
        </div>

        <div className="w-full md:w-64 bg-white/20 backdrop-blur-xs p-4 rounded-2xl border border-white/30 text-center">
          <span className="text-[11px] text-orange-100 block font-bold uppercase">Effort Marketing Global</span>
          <span className="text-2xl font-black text-white">
            {totalMarketingBudget.toLocaleString('fr-FR')} MAD
          </span>
          <span className="text-[10px] text-orange-100 block mt-1 font-medium">
            Investissement total sur la période
          </span>
        </div>
      </div>

    </div>
  );
};
