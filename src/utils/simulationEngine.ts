import { 
  Company, 
  SessionConfig, 
  PeriodPerformance, 
  MarketCondition 
} from '../types/simulation';

export const MARKET_SCENARIOS: MarketCondition[] = [
  {
    id: 'stable_growth',
    name: 'Croissance Modérée & Équilibre',
    description: 'Le marché est sain, la demande progresse de manière prévisible (+5%). Conditions de financement stables.',
    demandMultiplier: 1.05,
    costMultiplier: 1.0,
    trend: 'stable',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'tech_boom',
    name: 'Boom Technologique & Digitalisation',
    description: 'Forte accélération de la demande (+25%) pour les innovations et les services à haute valeur ajoutée.',
    demandMultiplier: 1.25,
    costMultiplier: 1.02,
    trend: 'boom',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'inflation_pressures',
    name: 'Tensions Inflationnistes & Hausse des Coûts',
    description: 'Les coûts des matières premières et de l’énergie augmentent (+12%). Consommateurs plus attentifs aux prix.',
    demandMultiplier: 0.92,
    costMultiplier: 1.12,
    trend: 'inflation',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'economic_crisis',
    name: 'Ralentissement Économique Sévère',
    description: 'Baisse de confiance des ménages et des entreprises (-20% de demande). Guerre des prix intense.',
    demandMultiplier: 0.80,
    costMultiplier: 1.05,
    trend: 'crisis',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'eco_transition',
    name: 'Transition Écologique & RSE Prioritaire',
    description: 'La demande privilégie les entreprises engagées, éthiques et offrant un excellent bien-être aux salariés (+15%).',
    demandMultiplier: 1.15,
    costMultiplier: 1.04,
    trend: 'tech_surge',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  }
];

export function runPeriodSimulation(
  companies: Company[],
  session: SessionConfig
): { updatedCompanies: Company[]; updatedSession: SessionConfig } {
  const approvedCompanies = companies.filter(c => c.status === 'approved');

  if (approvedCompanies.length === 0) {
    return {
      updatedCompanies: companies,
      updatedSession: {
        ...session,
        simulationLogs: [
          ...session.simulationLogs,
          {
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            period: session.currentPeriod,
            message: 'Aucune entreprise validée à simuler pour cette période.',
            type: 'warning',
          }
        ]
      }
    };
  }

  const marketDemand = Math.round(session.baseMarketDemand * session.marketCondition.demandMultiplier);

  // 1. Compute attractiveness & production metrics for each approved company
  const companyCalculations = approvedCompanies.map(company => {
    const { decisions } = company;
    const prevPerf = company.history[company.history.length - 1];
    const prevAwareness = prevPerf ? prevPerf.brandAwareness : 30;

    // A. Product Quality Score (0 - 100)
    const rdEffect = Math.min(30, Math.sqrt(decisions.rdBudget / 1000) * 8);
    const trainingQualityEffect = Math.min(15, (decisions.trainingBudget / 2500) * 6);
    const productQuality = Math.min(100, Math.max(35, 45 + rdEffect + trainingQualityEffect));

    // B. Brand Awareness / Notoriety (0 - 100)
    const adsEffect = Math.min(35, Math.sqrt(decisions.digitalAdsBudget / 600) * 7);
    const mediaEffect = Math.min(25, Math.sqrt(decisions.mediaBrandingBudget / 500) * 6);
    const brandAwareness = Math.min(100, Math.max(20, (prevAwareness * 0.75) + adsEffect + mediaEffect));

    // C. HR Climate & Worker Productivity
    const salaryRatio = decisions.averageSalary / session.baseReferenceSalary;
    const salaryScore = (salaryRatio - 1) * 80;
    const wellbeingScore = Math.min(15, (decisions.wellbeingBudget / 1500) * 5);
    const trainingScore = Math.min(10, (decisions.trainingBudget / 2000) * 4);
    const hrClimate = Math.min(100, Math.max(15, Math.round(55 + salaryScore + wellbeingScore + trainingScore)));

    // Productivity modifier per production worker
    const automationBonus = Math.min(0.35, Math.sqrt(decisions.automationInvestment / 12000) * 0.18);
    const climateBonus = ((hrClimate - 50) / 100) * 0.40;
    const productivityIndex = Math.max(0.4, 1.0 + climateBonus + automationBonus);

    // Production capacity
    const baseOutputPerWorker = 420; // Units per quarter
    const maxCapacity = Math.round(decisions.headcountProduction * baseOutputPerWorker * productivityIndex);
    const unitsProduced = Math.min(decisions.targetProduction, maxCapacity);
    const totalAvailableToSell = unitsProduced + company.stockInventory;

    // D. Commercial Reach & Distribution Channels
    let channelBonus = 1.0;
    let distributionFixedCost = 0;
    if (decisions.distributionChannels.directWeb) {
      channelBonus += 0.15;
      distributionFixedCost += 2500;
    }
    if (decisions.distributionChannels.retailStores) {
      channelBonus += 0.40;
      distributionFixedCost += 6000;
    }
    if (decisions.distributionChannels.b2bNetwork) {
      channelBonus += 0.55;
      distributionFixedCost += 9000;
    }
    if (decisions.distributionChannels.export) {
      channelBonus += 0.35;
      distributionFixedCost += 14000;
    }

    const salesForceMultiplier = 1.0 + (decisions.headcountSales * 0.08);
    const discountMultiplier = 1.0 + (decisions.discountRate / 100) * 0.85;

    // E. Price Attractiveness
    // If unitPrice is lower than reference, score > 1; if higher, score < 1
    const priceRatio = Math.max(0.4, decisions.unitPrice / session.baseReferencePrice);
    const priceScore = Math.pow(1 / priceRatio, 1.35);

    // F. Combined Attractiveness Score
    const rawAttractiveness = 
      priceScore * 
      Math.pow(brandAwareness / 40, 0.9) * 
      Math.pow(productQuality / 45, 0.75) * 
      channelBonus * 
      salesForceMultiplier * 
      discountMultiplier;

    const attractiveness = Math.max(0.1, rawAttractiveness);

    return {
      company,
      productQuality: Math.round(productQuality),
      brandAwareness: Math.round(brandAwareness),
      hrClimate,
      productivityIndex,
      unitsProduced,
      totalAvailableToSell,
      distributionFixedCost,
      attractiveness,
    };
  });

  // 2. Compute Market Share and Sales Demand
  const sumAttractiveness = companyCalculations.reduce((sum, item) => sum + item.attractiveness, 0);

  const calculatedPerformances = companyCalculations.map(calc => {
    const { company, productQuality, brandAwareness, hrClimate, unitsProduced, totalAvailableToSell, distributionFixedCost, attractiveness } = calc;
    const { decisions } = company;

    // Demand share
    const marketShareFraction = attractiveness / sumAttractiveness;
    const marketSharePct = Math.round(marketShareFraction * 1000) / 10;
    const unitsDemanded = Math.round(marketDemand * marketShareFraction);

    // Sales are constrained by inventory availability
    const unitsSold = Math.min(unitsDemanded, totalAvailableToSell);
    const stockRemaining = totalAvailableToSell - unitsSold;
    const stockoutOccurred = unitsDemanded > totalAvailableToSell;

    // Financial calculations
    const netUnitPrice = decisions.unitPrice * (1 - decisions.discountRate / 100);
    const revenue = Math.round(unitsSold * netUnitPrice);

    // Cost of Goods Sold (Unit cost discounted by automation up to -25%)
    const automationCostReduction = Math.min(0.25, Math.sqrt(decisions.automationInvestment / 15000) * 0.12);
    const baseUnitProdCost = session.baseReferencePrice * 0.44 * (1 - automationCostReduction);
    const effectiveUnitCost = baseUnitProdCost * session.marketCondition.costMultiplier;
    const stockHoldingCost = stockRemaining * 8; // 8 MAD / unité / trimestre
    const costOfGoodsSold = Math.round(unitsSold * effectiveUnitCost + stockHoldingCost);

    const grossMargin = revenue - costOfGoodsSold;

    // HR Costs (Total staff with 42% employer charges for 3 months)
    const totalStaff = decisions.headcountSales + decisions.headcountProduction + decisions.headcountMarketing + decisions.headcountSupport;
    const baseSalariesTotal = Math.round(totalStaff * decisions.averageSalary * 1.42 * 3);
    const hrCost = baseSalariesTotal + decisions.trainingBudget + decisions.wellbeingBudget;

    // Marketing Costs
    const marketingCost = decisions.digitalAdsBudget + decisions.mediaBrandingBudget + decisions.customerCareBudget;

    // Fixed Structure Costs
    const baseFixedCost = 14000;
    const fixedCosts = baseFixedCost + distributionFixedCost;

    // Financial Interests on Debt
    const currentDebt = company.totalDebt + decisions.loanRequested;
    const financialInterest = Math.round(currentDebt * (0.045 / 4)); // 4.5% annual interest / 4

    // EBIT (Résultat d'Exploitation)
    const ebit = grossMargin - hrCost - marketingCost - fixedCosts - financialInterest;

    // Taxes (IS à 25% si bénéfice)
    const taxes = ebit > 0 ? Math.round(ebit * 0.25) : 0;
    const netProfit = ebit - taxes;

    // Cashflow & Balance changes
    const cashFlowEnd = company.cash + netProfit + decisions.loanRequested - decisions.loanRepayment - decisions.rdBudget - decisions.automationInvestment;
    const newTotalDebt = Math.max(0, currentDebt - decisions.loanRepayment);
    const newFixedAssets = company.fixedAssets + decisions.automationInvestment * 0.85; // Dépréciation 15%
    const newEquity = company.equity + netProfit;

    // Client Satisfaction
    let satisfaction = (productQuality * 0.5) + (Math.min(100, decisions.customerCareBudget / 100) * 0.3) + 20;
    if (stockoutOccurred) satisfaction -= 15;
    if (decisions.unitPrice > session.baseReferencePrice * 1.25) satisfaction -= 8;
    const clientSatisfaction = Math.min(100, Math.max(20, Math.round(satisfaction)));

    // Generate pedagogical summary
    let summary = `Ventes de ${unitsSold.toLocaleString('fr-FR')} unités (Part de marché : ${marketSharePct}%). `;
    if (netProfit > 0) {
      summary += `Bénéfice net réalisé de ${netProfit.toLocaleString('fr-FR')} MAD avec une bonne maîtrise des marges. `;
    } else {
      summary += `Déficit de ${Math.abs(netProfit).toLocaleString('fr-FR')} MAD : veillez à réajuster le mix prix/charges RH. `;
    }
    if (stockoutOccurred) {
      summary += `Rupture de stock constatée (${unitsDemanded - totalAvailableToSell} ventes perdues). `;
    } else if (stockRemaining > 500) {
      summary += `Sur-stockage de ${stockRemaining} unités entraînant des frais de stockage. `;
    }

    const performance: PeriodPerformance = {
      period: session.currentPeriod,
      unitsProduced,
      unitsSold,
      stockRemaining,
      revenue,
      costOfGoodsSold,
      grossMargin,
      marketingCost,
      hrCost,
      fixedCosts,
      financialInterest,
      ebit,
      taxes,
      netProfit,
      cashFlowEnd,
      marketShare: marketSharePct,
      clientSatisfaction,
      hrClimate,
      brandAwareness,
      productQualityScore: productQuality,
      rank: 1, // Will be sorted below
      periodSummary: summary,
    };

    return {
      companyId: company.id,
      performance,
      cashFlowEnd,
      newTotalDebt,
      newFixedAssets,
      newEquity,
      stockRemaining,
      netProfit,
      revenue,
    };
  });

  // Rank by cumulative profit + current period profit
  const sortedByProfit = [...calculatedPerformances].sort((a, b) => {
    const compA = companies.find(c => c.id === a.companyId)!;
    const compB = companies.find(c => c.id === b.companyId)!;
    const totalA = compA.cumulativeProfit + a.netProfit;
    const totalB = compB.cumulativeProfit + b.netProfit;
    return totalB - totalA;
  });

  const rankMap = new Map<string, number>();
  sortedByProfit.forEach((item, index) => {
    rankMap.set(item.companyId, index + 1);
  });

  // 3. Assemble updated companies
  const updatedCompanies = companies.map(company => {
    const calc = calculatedPerformances.find(p => p.companyId === company.id);
    if (!calc) return company;

    const perfWithRank: PeriodPerformance = {
      ...calc.performance,
      rank: rankMap.get(company.id) || 1,
    };

    const newCumulativeProfit = company.cumulativeProfit + calc.netProfit;
    const newCumulativeRevenue = company.cumulativeRevenue + calc.revenue;

    // Calculate Pedagogical Global Score / 100
    // 40% Rentabilité, 20% Parts de marché, 20% Climat RH, 20% Satisfaction client & Trésorerie saine
    const profitScore = Math.max(0, Math.min(40, (newCumulativeProfit / 80000) * 40));
    const marketScore = Math.min(20, (perfWithRank.marketShare / 35) * 20);
    const hrScore = Math.min(20, (perfWithRank.hrClimate / 100) * 20);
    const solvaScore = calc.cashFlowEnd > 0 ? 20 : Math.max(0, 20 + (calc.cashFlowEnd / 10000));
    const globalScore = Math.min(100, Math.max(10, Math.round(profitScore + marketScore + hrScore + solvaScore)));

    // Reset periodic decisions that shouldn't roll over blindly (like one-off loans)
    return {
      ...company,
      cash: calc.cashFlowEnd,
      totalDebt: calc.newTotalDebt,
      fixedAssets: calc.newFixedAssets,
      equity: calc.newEquity,
      stockInventory: calc.stockRemaining,
      cumulativeProfit: newCumulativeProfit,
      cumulativeRevenue: newCumulativeRevenue,
      globalScore,
      decisions: {
        ...company.decisions,
        loanRequested: 0,
        loanRepayment: 0,
      },
      history: [...company.history, perfWithRank],
    };
  });

  // Pick next market condition for dynamic simulation
  const nextScenario = MARKET_SCENARIOS[(session.currentPeriod) % MARKET_SCENARIOS.length];
  const nextPeriod = session.currentPeriod + 1;
  const isFinalPeriod = nextPeriod > session.maxPeriods;

  const updatedSession: SessionConfig = {
    ...session,
    currentPeriod: isFinalPeriod ? session.currentPeriod : nextPeriod,
    status: isFinalPeriod ? 'completed' : 'active',
    marketCondition: isFinalPeriod ? session.marketCondition : nextScenario,
    simulationLogs: [
      ...session.simulationLogs,
      {
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        period: session.currentPeriod,
        message: `Simulation de la période ${session.currentPeriod} clôturée. ${approvedCompanies.length} entreprises en compétition. Leader actuel : ${sortedByProfit[0]?.companyId ? (companies.find(c => c.id === sortedByProfit[0].companyId)?.name || 'N/A') : 'N/A'}.`,
        type: 'success',
      }
    ]
  };

  return { updatedCompanies, updatedSession };
}
