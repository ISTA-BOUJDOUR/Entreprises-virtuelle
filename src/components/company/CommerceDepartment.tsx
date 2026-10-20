import React from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Factory, 
  Truck, 
  Globe, 
  Store, 
  HelpCircle, 
  Info,
  TrendingUp,
  Percent
} from 'lucide-react';
import { CompanyDecisions, SessionConfig } from '../../types/simulation';

interface CommerceDepartmentProps {
  decisions: CompanyDecisions;
  onChange: (decisions: CompanyDecisions) => void;
  session: SessionConfig;
  stockInventory: number;
}

export const CommerceDepartment: React.FC<CommerceDepartmentProps> = ({
  decisions,
  onChange,
  session,
  stockInventory,
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

  const updateChannel = (channel: keyof CompanyDecisions['distributionChannels']) => {
    onChange({
      ...decisions,
      distributionChannels: {
        ...decisions.distributionChannels,
        [channel]: !decisions.distributionChannels[channel],
      },
    });
  };

  const netPrice = Math.round(decisions.unitPrice * (1 - decisions.discountRate / 100));
  const estimatedCapacity = decisions.headcountProduction * 420;

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Département Commercial & Ventes
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Définissez votre stratégie de tarification, vos volumes de production et activez vos canaux de distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-blue-50/70 border border-blue-200 px-4 py-2.5 rounded-xl">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-blue-900">Prix de référence du marché : </span>
            <span className="font-extrabold text-blue-700">{session.baseReferencePrice} MAD HT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pricing Policy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Politique Tarifaire
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Unité vendue
            </span>
          </div>

          {/* Unit Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Prix de vente unitaire HT</span>
              <span className="text-base font-extrabold text-blue-600">
                {decisions.unitPrice} MAD
              </span>
            </div>
            <input
              type="range"
              min="160"
              max="450"
              step="5"
              value={decisions.unitPrice}
              onChange={(e) => updateDecision('unitPrice', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Bas de gamme (160 MAD)</span>
              <span className="text-blue-600 font-semibold">Marché ({session.baseReferencePrice} MAD)</span>
              <span>Haut de gamme (450 MAD)</span>
            </div>
          </div>

          {/* Discount Rate */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Remise commerciale accordée</span>
              <span className="text-sm font-extrabold text-slate-800">
                {decisions.discountRate} %
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={decisions.discountRate}
              onChange={(e) => updateDecision('discountRate', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0% (Plein tarif)</span>
              <span>10% (Promotion)</span>
              <span>20% (Agressif)</span>
            </div>
          </div>

          {/* Resulting Price Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Prix effectif après remise</span>
              <span className="text-xs text-slate-400">Facturé au client final</span>
            </div>
            <span className="text-lg font-black text-slate-900">
              {netPrice} MAD HT
            </span>
          </div>

        </div>

        {/* Production & Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Factory className="w-4 h-4 text-blue-600" />
              Volume de Production & Stocks
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Capacité : ~{estimatedCapacity} unités
            </span>
          </div>

          {/* Production Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Quantité à produire pour ce trimestre</span>
              <span className="text-base font-extrabold text-blue-600">
                {decisions.targetProduction.toLocaleString('fr-FR')} unités
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="100"
              value={decisions.targetProduction}
              onChange={(e) => updateDecision('targetProduction', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 000 u.</span>
              <span>5 000 u.</span>
              <span>10 000 u.</span>
            </div>
          </div>

          {/* Stock inventory display */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Stock actuel en entrepôt</span>
              <span className="text-sm font-bold text-slate-800">{stockInventory} unités</span>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <span className="text-[11px] text-blue-700 block">Offre totale disponible</span>
              <span className="text-sm font-extrabold text-blue-900">
                {(decisions.targetProduction + stockInventory).toLocaleString('fr-FR')} unités
              </span>
            </div>
          </div>

          {/* Warning if production exceeds capacity */}
          {decisions.targetProduction > estimatedCapacity && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Attention : Votre objectif de production ({decisions.targetProduction}) dépasse la capacité théorique ({estimatedCapacity}) basée sur votre équipe de {decisions.headcountProduction} ouvriers. Recrutez au département RH pour éviter les goulots d’étranglement !
              </span>
            </div>
          )}

        </div>

      </div>

      {/* Distribution Channels */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Canaux de Distribution & Réseaux de Vente
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Activez les canaux adaptés à votre cible pour maximiser votre part de marché.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Direct Web */}
          <div 
            onClick={() => updateChannel('directWeb')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              decisions.distributionChannels.directWeb
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Store className="w-5 h-5 text-blue-600" />
              <input
                type="checkbox"
                checked={decisions.distributionChannels.directWeb}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
            <h5 className="font-bold text-xs text-slate-900">E-Commerce & Vente Directe</h5>
            <p className="text-[11px] text-slate-500 mt-1">Marge 100%, contact direct.</p>
            <span className="text-[11px] font-semibold text-slate-600 mt-2 block">
              Frais fixes : 2 500 MAD / trim.
            </span>
          </div>

          {/* Retail Stores */}
          <div 
            onClick={() => updateChannel('retailStores')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              decisions.distributionChannels.retailStores
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Store className="w-5 h-5 text-indigo-600" />
              <input
                type="checkbox"
                checked={decisions.distributionChannels.retailStores}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
            <h5 className="font-bold text-xs text-slate-900">Réseau Magasins & GMS</h5>
            <p className="text-[11px] text-slate-500 mt-1">Visibilité grand public & volume.</p>
            <span className="text-[11px] font-semibold text-slate-600 mt-2 block">
              Frais fixes : 6 000 MAD / trim.
            </span>
          </div>

          {/* B2B Network */}
          <div 
            onClick={() => updateChannel('b2bNetwork')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              decisions.distributionChannels.b2bNetwork
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Factory className="w-5 h-5 text-purple-600" />
              <input
                type="checkbox"
                checked={decisions.distributionChannels.b2bNetwork}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
            <h5 className="font-bold text-xs text-slate-900">Distribution B2B Pro</h5>
            <p className="text-[11px] text-slate-500 mt-1">Gros volumes réguliers sous contrat.</p>
            <span className="text-[11px] font-semibold text-slate-600 mt-2 block">
              Frais fixes : 9 000 MAD / trim.
            </span>
          </div>

          {/* Export */}
          <div 
            onClick={() => updateChannel('export')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              decisions.distributionChannels.export
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-teal-600" />
              <input
                type="checkbox"
                checked={decisions.distributionChannels.export}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
            <h5 className="font-bold text-xs text-slate-900">Vente à l'Export International</h5>
            <p className="text-[11px] text-slate-500 mt-1">Conquête de marchés étrangers.</p>
            <span className="text-[11px] font-semibold text-slate-600 mt-2 block">
              Frais fixes : 14 000 MAD / trim.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
