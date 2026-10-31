export interface PricePoint {
  date: string;
  price: number;
  volume: number;
  event?: string;
}

export interface SoldListing {
  id: string;
  source: string;
  date: string;
  soldPrice: number;
  askingPrice?: number;
  condition: string;
  boxAndPapers: boolean;
  year: number;
  verified: boolean;
  link?: string;
}

export interface AIAnalysis {
  opportunityScore: number; // 0.0 - 10.0
  recommendation: string;
  confidence: number; // percentage e.g. 94%
  liquidityScore: number; // 0 - 100
  stabilityRating: string;
  retailMSRP: number;
  fairMarketValue: number;
  currentSpread: number; // percentage difference
  spreadDollars: number;
  summary: string;
  catalysts: string[];
  riskFactors: string[];
}

export interface ArbitrageListing {
  id: string;
  reference: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  seller_type: string;
  is_dealer: boolean;
  is_private: boolean;
  condition: string;
  year?: number | null;
  has_box: boolean;
  has_papers: boolean;
  is_full_set: boolean;
  location: string;
  url: string;
  snippet: string;
  discount_from_cmv_pct?: number;
  estimated_profit_dollars?: number;
}

export interface VenuePricingData {
  venue: 'Chrono24' | 'eBay' | 'WatchCharts';
  venueType: 'Dealer Asking Consensus' | 'Realized Sold Transactions' | 'Aggregated Secondary Index';
  price: number;
  weightPct: number;
  sampleCount: number;
  status: 'LIVE ASKING' | 'REALIZED TRANSACTIONS' | 'INDEX COMPOSITE';
  lastUpdated: string;
  notes: string;
}

export interface MultiVenueConsensus {
  consolidatedPrice: number;
  chrono24: VenuePricingData;
  ebay: VenuePricingData;
  watchcharts: VenuePricingData;
  methodology: string;
  confidenceScore: number;
  venueSpreadPct: number;
  askingVsRealizedGapPct: number;
}

export interface DealerMarketMetrics {
  consensusMarketValue: number;
  dealerBuyInPrice: number; // 20% discount from consensus market value
  retailMSRP: number;
  marketPremiumPct: number;
  totalActiveListings: number;
  dealerListingsCount: number;
  privateListingsCount: number;
  arbitrageCount: number;
  methodology: string;
  spreadRule: string;
  arbitrageDeals?: ArbitrageListing[];
  multiVenue?: MultiVenueConsensus;
  scrapedAt?: string;
}

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  dealership: string;
  role: 'dealer' | 'collector' | 'pro' | 'partner' | 'admin';
  tier: 'free' | 'pro';
}

export interface WatchModel {
  id: string;
  brand: string;
  model: string;
  reference: string;
  category: string;
  caseSize: string;
  dialColor: string;
  material: string;
  currentAskingAvg: number;
  recentSoldAvg: number;
  thirtyDayChangePct: number;
  oneYearChangePct: number;
  priceHistory: PricePoint[];
  recentSales: SoldListing[];
  aiAnalysis: AIAnalysis;
  dealerMetrics?: DealerMarketMetrics;
  multiVenue?: MultiVenueConsensus;
  imageUrl?: string;
}
