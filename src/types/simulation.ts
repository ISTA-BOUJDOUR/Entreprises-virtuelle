export type CompanySector = 'tech' | 'mobility' | 'agro' | 'retail' | 'health' | 'energy';

export type CompanyStatus = 'pending' | 'approved' | 'rejected';

export type StrategicGoal = 'profit' | 'market_share' | 'hr_excellence' | 'quality_innovation';

export interface MarketCondition {
  id: string;
  name: string;
  description: string;
  demandMultiplier: number;
  costMultiplier: number;
  trend: 'boom' | 'stable' | 'crisis' | 'inflation' | 'tech_surge';
  badgeColor: string;
}

export interface DistributionChannels {
  directWeb: boolean;      // Coût fixe: 2 500 MAD/période, marge max
  retailStores: boolean;   // Coût fixe: 6 000 MAD/période, fort volume grand public
  b2bNetwork: boolean;     // Coût fixe: 9 000 MAD/période, contrats professionnels
  export: boolean;         // Coût fixe: 14 000 MAD/période, ouverture internationale
}

export interface CompanyDecisions {
  // Commerce & Tarification
  unitPrice: number;
  targetProduction: number;
  distributionChannels: DistributionChannels;
  discountRate: number; // Remise commerciale 0-20%

  // Marketing & Communication
  digitalAdsBudget: number;      // SEA, Meta, TikTok (0 - 40 000 MAD)
  mediaBrandingBudget: number;   // Salons, presse, affichage (0 - 30 000 MAD)
  customerCareBudget: number;    // Fidélisation & SAV (0 - 20 000 MAD)

  // Ressources Humaines
  headcountSales: number;        // Commerciaux
  headcountProduction: number;   // Opérateurs / Techniciens de fabrication
  headcountMarketing: number;    // Chargés marketing
  headcountSupport: number;      // Support client & logistique
  averageSalary: number;         // Salaire brut mensuel par employé (réf: 2 700 MAD)
  trainingBudget: number;        // Budget formation continue
  wellbeingBudget: number;       // Budget qualité de vie au travail (QVT)

  // Finance & R&D
  loanRequested: number;         // Emprunt bancaire demandé
  loanRepayment: number;         // Remboursement du capital
  rdBudget: number;              // R&D pour augmenter la qualité perçue
  automationInvestment: number;  // Investissement machines pour baisser coût unitaire
}

export interface PeriodPerformance {
  period: number;
  unitsProduced: number;
  unitsSold: number;
  stockRemaining: number;
  revenue: number;
  costOfGoodsSold: number;
  grossMargin: number;
  marketingCost: number;
  hrCost: number;
  fixedCosts: number;
  financialInterest: number;
  ebit: number;
  taxes: number;
  netProfit: number;
  cashFlowEnd: number;
  marketShare: number;          // % de part de marché
  clientSatisfaction: number;   // Note de 0 à 100%
  hrClimate: number;            // Note de 0 à 100%
  brandAwareness: number;       // Note de 0 à 100%
  productQualityScore: number;  // Note de 0 à 100%
  rank: number;
  periodSummary: string;
}

export interface Company {
  id: string;
  name: string;
  creatorName: string;
  teamMembers: string[];
  sector: CompanySector;
  logoColor: string;
  slogan: string;
  status: CompanyStatus;
  trainerNotes?: string;
  createdAt: string;
  strategicGoal: StrategicGoal;
  cash: number;
  totalDebt: number;
  equity: number;
  fixedAssets: number;
  stockInventory: number; // Unités invendues en stock
  decisions: CompanyDecisions;
  history: PeriodPerformance[];
  cumulativeProfit: number;
  cumulativeRevenue: number;
  globalScore: number; // Note globale composite / 100
}

export interface SessionConfig {
  id: string;
  title: string;
  codePromo: string;
  startingBudget: number;
  currentPeriod: number;
  maxPeriods: number;
  periodLabel: string; // ex: "Trimestre" ou "Exercice"
  status: 'active' | 'completed' | 'paused';
  marketCondition: MarketCondition;
  baseMarketDemand: number; // Volume global disponible (ex: 24 000 unités)
  baseReferencePrice: number; // Prix moyen de référence du marché (ex: 280 MAD)
  baseReferenceSalary: number; // Salaire moyen du marché (ex: 2 700 MAD)
  trainerPassword?: string; // Mot de passe d'accès formateur
  simulationLogs: {
    timestamp: string;
    period: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'alert';
  }[];
}

export type ActiveTab = 
  | 'overview' 
  | 'finance' 
  | 'accounting' 
  | 'commerce' 
  | 'marketing' 
  | 'hr' 
  | 'leaderboard'
  | 'simulation_summary';
