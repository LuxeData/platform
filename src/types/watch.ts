export interface PricePoint {
  date: string;
  price: number;
  volume: number;
  event?: string;
}

export interface SoldListing {
  id: string;
  source: 'eBay' | 'Sotheby\'s' | 'Christie\'s' | 'Antiquorum' | 'Chrono24 Direct' | 'WatchExchange';
  date: string;
  soldPrice: number;
  askingPrice?: number;
  condition: 'Unworn / Mint' | 'Very Good' | 'Good';
  boxAndPapers: boolean;
  year: number;
  verified: boolean;
  link?: string;
}

export interface AIAnalysis {
  opportunityScore: number; // 0.0 - 10.0
  recommendation: 'STRONG BUY / ARBITRAGE' | 'FAIR VALUE' | 'PREMIUM / HOLD' | 'OVERVALUED';
  confidence: number; // percentage e.g. 94%
  liquidityScore: number; // 0 - 100
  stabilityRating: 'Ultra High' | 'High' | 'Moderate' | 'Volatile';
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
  scrapedAt?: string;
}

export interface WatchModel {
  id: string;
  brand: string;
  model: string;
  reference: string;
  category: 'Sports / Steel' | 'Chronograph' | 'Dress / Haute' | 'Complication';
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
  imageUrl?: string;
}

