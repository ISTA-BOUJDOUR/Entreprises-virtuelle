import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Info,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Company, SessionConfig, CompanyDecisions, CompanyStatus } from './types/simulation';
import { DEFAULT_SESSION, INITIAL_COMPANIES } from './utils/defaultData';
import { runPeriodSimulation } from './utils/simulationEngine';
import { Header } from './components/Header';
import { PortalWelcome } from './components/PortalWelcome';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { CreateCompanyModal } from './components/company/CreateCompanyModal';
import { PeriodSimulationModal } from './components/trainer/PeriodSimulationModal';
import { TrainerPasswordModal } from './components/trainer/TrainerPasswordModal';

const STORAGE_SESSION_KEY = 'simubiz_session_data_v3';
const STORAGE_COMPANIES_KEY = 'simubiz_companies_data_v3';

export default function App() {
  // Load session from localStorage or use initial default
  const [session, setSession] = useState<SessionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load session from localStorage', e);
    }
    return DEFAULT_SESSION;
  });

  // Load companies from localStorage or use initial default
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPANIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load companies from localStorage', e);
    }
    return INITIAL_COMPANIES;
  });

  // Current view: 'portal' by default (showing solely the two spaces)
  const [currentView, setCurrentView] = useState<'portal' | 'trainer' | 'company'>('portal');

  // Currently selected company in Company View
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    return companies[0]?.id || '';
  });

  // Trainer authentication state
  const [isTrainerAuthenticated, setIsTrainerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('simubiz_trainer_auth') === 'true';
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<'login' | 'change'>('login');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [justSimulatedPeriod, setJustSimulatedPeriod] = useState<number>(1);

  // Synchronize state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(companies));
    } catch (e) {
      console.error('Failed to save companies to localStorage', e);
    }
  }, [companies]);

  // Ensure valid selected company
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
  const trainerPassword = session.trainerPassword || 'FORMATEUR2026';

  // Request view change with security check for Trainer
  const handleRequestViewChange = (view: 'portal' | 'trainer' | 'company') => {
    if (view === 'trainer') {
      if (isTrainerAuthenticated) {
        setCurrentView('trainer');
      } else {
        setPasswordModalMode('login');
        setIsPasswordModalOpen(true);
      }
    } else {
      setCurrentView(view);
    }
  };

  // Successful login as Trainer
  const handleSuccessLogin = () => {
    setIsTrainerAuthenticated(true);
    sessionStorage.setItem('simubiz_trainer_auth', 'true');
    setCurrentView('trainer');
  };

  // Change Trainer password
  const handleChangeTrainerPassword = (newPassword: string) => {
    setSession(prev => ({
      ...prev,
      trainerPassword: newPassword,
      simulationLogs: [
        ...prev.simulationLogs,
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          period: session.currentPeriod,
          message: 'Le mot de passe de l’Espace Formateur a été modifié avec succès.',
          type: 'info',
        }
      ]
    }));
  };

  // Lock trainer space
  const handleLockTrainer = () => {
    setIsTrainerAuthenticated(false);
    sessionStorage.removeItem('simubiz_trainer_auth');
    setCurrentView('portal');
  };

  // 1. Delete company by Trainer
  const handleDeleteCompany = (companyId: string) => {
    const targetComp = companies.find(c => c.id === companyId);
    const remaining = companies.filter(c => c.id !== companyId);
    setCompanies(remaining);

    if (selectedCompanyId === companyId) {
      setSelectedCompanyId(remaining[0]?.id || '');
    }

    setSession(prev => ({
      ...prev,
      simulationLogs: [
        ...prev.simulationLogs,
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          period: session.currentPeriod,
          message: `L'entreprise "${targetComp?.name || companyId}" a été SUPPRIMÉE de la session par le Formateur.`,
          type: 'warning',
        }
      ]
    }));
  };

  // 1b. Delete ALL companies by Trainer
  const handleDeleteAllCompanies = () => {
    if (window.confirm('Action Formateur : Êtes-vous certain de vouloir SUPPRIMER TOUTES LES ENTREPRISES de la session (même celles déjà existantes) ? Cette action est irréversible et réinitialise tous les concurrents.')) {
      setCompanies([]);
      setSelectedCompanyId('');
      localStorage.removeItem(STORAGE_COMPANIES_KEY);
      setSession(prev => ({
        ...prev,
        simulationLogs: [
          ...prev.simulationLogs,
          {
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            period: prev.currentPeriod,
            message: 'Le Formateur a SUPPRIMÉ TOUTES les entreprises de la session.',
            type: 'alert',
          }
        ]
      }));
    }
  };

  // 2. Run simulation of current period
  const handleRunSimulation = () => {
    const periodToSimulate = session.currentPeriod;
    const { updatedCompanies, updatedSession } = runPeriodSimulation(companies, session);

    setCompanies(updatedCompanies);
    setSession(updatedSession);
    setJustSimulatedPeriod(periodToSimulate);
    setIsPeriodModalOpen(true);
  };

  // 3. Validate/Approve/Reject company creation
  const handleValidateCompany = (companyId: string, status: CompanyStatus, notes?: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        status,
        trainerNotes: notes || c.trainerNotes,
      };
    }));

    setSession(prev => ({
      ...prev,
      simulationLogs: [
        ...prev.simulationLogs,
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          period: session.currentPeriod,
          message: `L'entreprise "${companies.find(c => c.id === companyId)?.name || 'Société'}" a été ${status === 'approved' ? 'VALIDÉE' : 'REFUSÉE'} par le Formateur.`,
          type: status === 'approved' ? 'success' : 'warning',
        }
      ]
    }));
  };

  // 4. Trainer bonus or malus
  const handleApplyBonusMalus = (companyId: string, amount: number, reason: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        cash: c.cash + amount,
        equity: c.equity + amount,
        cumulativeProfit: c.cumulativeProfit + amount,
      };
    }));

    const targetComp = companies.find(c => c.id === companyId);

    setSession(prev => ({
      ...prev,
      simulationLogs: [
        ...prev.simulationLogs,
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          period: session.currentPeriod,
          message: `Arbitrage Formateur pour ${targetComp?.name} : ${amount >= 0 ? '+' : ''}${amount.toLocaleString('fr-FR')} MAD (${reason}).`,
          type: amount >= 0 ? 'success' : 'alert',
        }
      ]
    }));
  };

  // 5. Update decisions for a company
  const handleUpdateDecisions = (companyId: string, decisions: CompanyDecisions) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        decisions,
      };
    }));
  };

  // 6. Create new company
  const handleCreateCompany = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
    setSelectedCompanyId(newCompany.id);
    setCurrentView('company');

    setSession(prev => ({
      ...prev,
      simulationLogs: [
        ...prev.simulationLogs,
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          period: session.currentPeriod,
          message: `Nouvelle entreprise enregistrée : "${newCompany.name}" (${newCompany.creatorName}). ${newCompany.status === 'approved' ? 'Validée directement.' : 'En attente de validation par le Formateur.'}`,
          type: 'info',
        }
      ]
    }));
  };

  // 7. Reset session
  const handleResetSession = () => {
    if (window.confirm('Voulez-vous réinitialiser la simulation aux valeurs par défaut ? Toutes les modifications seront remises à zéro.')) {
      setSession(DEFAULT_SESSION);
      setCompanies(INITIAL_COMPANIES);
      setSelectedCompanyId(INITIAL_COMPANIES[0].id);
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_COMPANIES_KEY);
      setCurrentView('portal');
    }
  };

  // 8. Update session settings
  const handleUpdateSession = (updated: Partial<SessionConfig>) => {
    setSession(prev => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="min-h-screen bg-orange-50/25 text-slate-900 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Top Header & Navigation - Orange & Blanc */}
      <Header
        currentView={currentView}
        onViewChange={handleRequestViewChange}
        session={session}
        companies={companies}
        selectedCompanyId={activeCompany ? activeCompany.id : ''}
        onSelectCompany={setSelectedCompanyId}
        onOpenCreateCompany={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Initiale : Portail avec seulement les 2 espaces */}
        {currentView === 'portal' && (
          <PortalWelcome
            session={session}
            companies={companies}
            onSelectView={handleRequestViewChange}
            onOpenCreateCompany={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* Espace Formateur */}
        {currentView === 'trainer' && (
          <TrainerDashboard
            session={session}
            companies={companies}
            onRunSimulation={handleRunSimulation}
            onValidateCompany={handleValidateCompany}
            onDeleteCompany={handleDeleteCompany}
            onDeleteAllCompanies={handleDeleteAllCompanies}
            onApplyBonusMalus={handleApplyBonusMalus}
            onUpdateSession={handleUpdateSession}
            onResetSession={handleResetSession}
            onOpenCreateCompany={() => setIsCreateModalOpen(true)}
            onSelectCompany={(id) => {
              setSelectedCompanyId(id);
              setCurrentView('company');
            }}
            onOpenPasswordChange={() => {
              setPasswordModalMode('change');
              setIsPasswordModalOpen(true);
            }}
            onLockTrainer={handleLockTrainer}
          />
        )}

        {/* Espace Création & Gestion d'Entreprise */}
        {currentView === 'company' && (
          activeCompany ? (
            <CompanyDashboard
              company={activeCompany}
              session={session}
              allCompanies={companies}
              onUpdateDecisions={handleUpdateDecisions}
              onSwitchToTrainer={() => handleRequestViewChange('trainer')}
            />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-orange-200 p-8 shadow-sm">
              <Building2 className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <h2 className="text-xl font-black text-slate-800">Aucune entreprise trouvée</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Créez une entreprise virtuelle pour commencer à jouer.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-500/20"
              >
                Créer une Entreprise
              </button>
            </div>
          )
        )}

      </main>

      {/* Modals */}
      <TrainerPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentPassword={trainerPassword}
        mode={passwordModalMode}
        onSuccessLogin={handleSuccessLogin}
        onPasswordChanged={handleChangeTrainerPassword}
      />

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        session={session}
        onCreate={handleCreateCompany}
        isTrainer={currentView === 'trainer'}
      />

      <PeriodSimulationModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        period={justSimulatedPeriod}
        session={session}
        companies={companies}
        onGoToLeaderboard={() => {
          if (currentView !== 'trainer') {
            handleRequestViewChange('trainer');
          }
        }}
      />

      {/* Footer - Orange & Blanc */}
      <footer className="border-t border-orange-200/80 bg-white py-6 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-orange-600">SimuBiz</span>
            <span>• Simulateur Pédagogique d'Entreprise Virtuelle</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span>Espace actif : <strong className="text-orange-700">{currentView === 'portal' ? 'Portail d\'Accueil' : currentView === 'trainer' ? 'Espace Formateur' : 'Espace Entreprises'}</strong></span>
            <span>Période : <strong className="text-orange-700">{session.periodLabel} {session.currentPeriod} / {session.maxPeriods}</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
