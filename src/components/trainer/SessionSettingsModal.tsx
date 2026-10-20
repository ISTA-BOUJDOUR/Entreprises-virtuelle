import React, { useState } from 'react';
import { X, Settings, Coins, Calendar, Tag, Users, CheckCircle2 } from 'lucide-react';
import { SessionConfig } from '../../types/simulation';

interface SessionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionConfig;
  onSave: (updated: Partial<SessionConfig>) => void;
}

export const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
  isOpen,
  onClose,
  session,
  onSave,
}) => {
  const [title, setTitle] = useState(session.title);
  const [codePromo, setCodePromo] = useState(session.codePromo);
  const [startingBudget, setStartingBudget] = useState(session.startingBudget);
  const [maxPeriods, setMaxPeriods] = useState(session.maxPeriods);
  const [baseMarketDemand, setBaseMarketDemand] = useState(session.baseMarketDemand);
  const [baseReferencePrice, setBaseReferencePrice] = useState(session.baseReferencePrice);
  const [baseReferenceSalary, setBaseReferenceSalary] = useState(session.baseReferenceSalary);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      codePromo,
      startingBudget,
      maxPeriods,
      baseMarketDemand,
      baseReferencePrice,
      baseReferenceSalary,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header - Orange & Blanc */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Paramètres Pédagogiques de la Session</h2>
              <p className="text-xs text-orange-100 font-medium">Configuration du marché et des règles du jeu</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom de la Session / Promotion
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Code Session / Identifiant
              </label>
              <input
                type="text"
                value={codePromo}
                onChange={(e) => setCodePromo(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre de Périodes (Tours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={maxPeriods}
                onChange={(e) => setMaxPeriods(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Budget de départ */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" />
                Budget de départ alloué par entreprise
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                {startingBudget.toLocaleString('fr-FR')} MAD
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="250000"
              step="10000"
              value={startingBudget}
              onChange={(e) => setStartingBudget(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>20 000 MAD (Amorçage)</span>
              <span>100 000 MAD (Standard)</span>
              <span>250 000 MAD (Confort)</span>
            </div>
          </div>

          {/* Market reference figures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Demande Marché (Unités)
              </label>
              <input
                type="number"
                min="5000"
                max="100000"
                step="1000"
                value={baseMarketDemand}
                onChange={(e) => setBaseMarketDemand(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prix Référence Marché (MAD)
              </label>
              <input
                type="number"
                min="50"
                max="2000"
                step="10"
                value={baseReferencePrice}
                onChange={(e) => setBaseReferencePrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Salaire Moyen Référence (MAD)
              </label>
              <input
                type="number"
                min="1500"
                max="5000"
                step="50"
                value={baseReferenceSalary}
                onChange={(e) => setBaseReferenceSalary(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/30"
            >
              Enregistrer les Paramètres
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
