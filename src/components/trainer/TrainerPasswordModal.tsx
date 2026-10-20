import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface TrainerPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  mode: 'login' | 'change';
  onSuccessLogin: () => void;
  onPasswordChanged: (newPassword: string) => void;
}

export const TrainerPasswordModal: React.FC<TrainerPasswordModalProps> = ({
  isOpen,
  onClose,
  currentPassword,
  mode,
  onSuccessLogin,
  onPasswordChanged,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (inputPassword.trim() === currentPassword.trim()) {
      setInputPassword('');
      onSuccessLogin();
      onClose();
    } else {
      setErrorMsg('Mot de passe incorrect. Veuillez réessayer.');
    }
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (oldPassword.trim() !== currentPassword.trim()) {
      setErrorMsg("L'ancien mot de passe saisi est incorrect.");
      return;
    }

    if (newPassword.trim().length < 4) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    onPasswordChanged(newPassword.trim());
    setSuccessMsg('Mot de passe mis à jour avec succès !');
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border border-orange-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Orange & Blanc */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {mode === 'login' ? 'Accès Espace Formateur' : 'Sécurité Formateur'}
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                {mode === 'login' ? 'Authentification requise' : 'Changer votre mot de passe'}
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

        {/* Mode Login */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mot de Passe Formateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Default First Entry Hint */}
            <div className="p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200/90 text-xs text-orange-950 font-medium flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-orange-900">Mot de passe de première entrée :</span>
                Code par défaut : <code className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700">{currentPassword}</code>
                <span className="block text-[11px] text-slate-500 mt-1">
                  Vous pourrez le changer directement dans l'Espace Formateur à tout moment.
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>Déverrouiller l'Espace</span>
              </button>
            </div>
          </form>
        ) : (
          /* Mode Change Password */
          <form onSubmit={handleChangeSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mot de Passe Actuel
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Entrez le mot de passe actuel..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nouveau Mot de Passe
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 4 caractères..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmer le Nouveau Mot de Passe
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le nouveau mot de passe..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enregistrer le Nouveau Mot de Passe</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
