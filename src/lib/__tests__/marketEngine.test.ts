import { describe, it, expect } from 'vitest';
import {
  calculateTrimmedMean,
  calculateDealerBuyIn,
  calculateArbitrageSpread,
  rankArbitrageDeals,
  getLiveMarketEngine,
  WATCH_MODELS,
  MACRO_METRICS
} from '../marketEngine';
import { ArbitrageListing } from '../../types/watch';

describe('Market Engine — 10% Trimmed Mean Algorithm', () => {
  it('correctly eliminates high and low outliers in a 10-item price distribution', () => {
    // 10 items: 1 low outlier ($5,000), 8 typical asks ($15,000), 1 extreme ask ($95,000)
    const prices = [5000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 95000];
    const cmv = calculateTrimmedMean(prices, 0.10);
    // Trimming 10% drops index 0 (5000) and index 9 (95000), leaving the 8 items of 15000
    expect(cmv).toBe(15000);
  });

  it('preserves small sample sizes (< 5 items) without dropping valid data points', () => {
    const prices = [14000, 15000, 16000];
    const cmv = calculateTrimmedMean(prices, 0.10);
    expect(cmv).toBe(15000);
  });

  it('handles empty arrays gracefully without crashing', () => {
    expect(calculateTrimmedMean([])).toBe(0);
  });

  it('handles single-item samples', () => {
    expect(calculateTrimmedMean([14850])).toBe(14850);
  });

  it('correctly calculates trimmed mean for realistic Chrono24 dealer prices', () => {
    const prices = [
      13800, 14200, 14500, 14800, 14900, 15000, 15100, 15200, 15400, 15600,
      15800, 16000, 16200, 16500, 16800, 17000, 17200, 17500, 18500, 24000
    ]; // 20 items. 10% trim = 2 from start, 2 from end
    const cmv = calculateTrimmedMean(prices, 0.10);
    // 20 items: slice(2, 18) -> indices 2 through 17 inclusive (16 items)
    const slice = prices.slice(2, 18);
    const expected = Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 100) / 100;
    expect(cmv).toBe(expected);
  });

  it('symmetrically trims odd-sized distributions (e.g. 11 items drops exactly 1 from top and bottom)', () => {
    // 11 items: 1 low outlier ($2,000), 9 median asks ($10,000), 1 high outlier ($80,000)
    const prices = [2000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 80000];
    const cmv = calculateTrimmedMean(prices, 0.10);
    // Symmetrically trims 1 from start (2000) and 1 from end (80000), leaving the 9 items of 10000
    expect(cmv).toBe(10000);
  });

  it('symmetrically trims 15-item distributions', () => {
    // 15 items: 10% trim = 1 item from start, 1 item from end
    const prices = [1000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 99000];
    const cmv = calculateTrimmedMean(prices, 0.10);
    expect(cmv).toBe(5000);
  });
});

describe('Market Engine — Dealer Buy-In & Margin Calculations', () => {
  it('applies the standard 20% margin rule to consensus market values', () => {
    const cmv = 15000;
    const { buyIn, spread, marginPct, roiPct } = calculateDealerBuyIn(cmv, 20);

    expect(buyIn).toBe(12000); // 15000 * 0.80
    expect(spread).toBe(3000);  // 15000 - 12000
    expect(marginPct).toBe(20);
    expect(roiPct).toBe(25);    // 3000 / 12000 = 25%
  });

  it('calculates custom dealer target margins accurately (12%, 15%, 25%)', () => {
    const cmv = 30000;

    const at12 = calculateDealerBuyIn(cmv, 12);
    expect(at12.buyIn).toBe(26400);
    expect(at12.spread).toBe(3600);

    const at15 = calculateDealerBuyIn(cmv, 15);
    expect(at15.buyIn).toBe(25500);
    expect(at15.spread).toBe(4500);

    const at25 = calculateDealerBuyIn(cmv, 25);
    expect(at25.buyIn).toBe(22500);
    expect(at25.spread).toBe(7500);
  });

  it('handles zero CMV safely', () => {
    const res = calculateDealerBuyIn(0, 20);
    expect(res.buyIn).toBe(0);
    expect(res.spread).toBe(0);
    expect(res.roiPct).toBe(0);
  });
});

describe('Market Engine — Arbitrage Calculation & Ranking', () => {
  it('correctly tags listings below 80% of CMV as arbitrage', () => {
    const cmv = 15000;
    // Buy-in threshold is $12,000
    const deal1 = calculateArbitrageSpread(11500, cmv);
    expect(deal1.isArbitrage).toBe(true);
    expect(deal1.discountDollars).toBe(3500);
    expect(deal1.discountPct).toBe(23.3);

    const deal2 = calculateArbitrageSpread(12500, cmv);
    expect(deal2.isArbitrage).toBe(false);
    expect(deal2.discountDollars).toBe(2500);
    expect(deal2.discountPct).toBe(16.7);
  });

  it('safely handles equal or overpriced asks without negative discounts', () => {
    const cmv = 15000;
    const equalDeal = calculateArbitrageSpread(15000, cmv);
    expect(equalDeal.isArbitrage).toBe(false);
    expect(equalDeal.discountDollars).toBe(0);
    expect(equalDeal.discountPct).toBe(0);

    const overpricedDeal = calculateArbitrageSpread(18000, cmv);
    expect(overpricedDeal.isArbitrage).toBe(false);
    expect(overpricedDeal.discountDollars).toBe(0);
    expect(overpricedDeal.discountPct).toBe(0);
  });

  it('ranks arbitrage deals in descending order of dollar profit', () => {
    const deals: ArbitrageListing[] = [
      {
        id: 'deal-1',
        reference: '126610LN',
        brand: 'Rolex',
        model: 'Submariner Date 41',
        price: 11000,
        currency: 'USD',
        seller_type: 'Private Seller',
        is_dealer: false,
        is_private: true,
        condition: 'Very Good',
        has_box: true,
        has_papers: true,
        is_full_set: true,
        location: 'New York, USA',
        url: 'https://example.com/1',
        snippet: 'Rolex Submariner 126610LN',
        estimated_profit_dollars: 4000,
        discount_from_cmv_pct: 26.7
      },
      {
        id: 'deal-2',
        reference: '5711/1A',
        brand: 'Patek Philippe',
        model: 'Nautilus',
        price: 115000,
        currency: 'USD',
        seller_type: 'Private Seller',
        is_dealer: false,
        is_private: true,
        condition: 'Mint',
        has_box: true,
        has_papers: true,
        is_full_set: true,
        location: 'Geneva, Switzerland',
        url: 'https://example.com/2',
        snippet: 'Patek Philippe Nautilus 5711/1A',
        estimated_profit_dollars: 30000,
        discount_from_cmv_pct: 20.7
      },
      {
        id: 'deal-3',
        reference: '116500LN',
        brand: 'Rolex',
        model: 'Daytona Panda',
        price: 24000,
        currency: 'USD',
        seller_type: 'Private Seller',
        is_dealer: false,
        is_private: true,
        condition: 'Pre-owned',
        has_box: true,
        has_papers: true,
        is_full_set: true,
        location: 'London, UK',
        url: 'https://example.com/3',
        snippet: 'Rolex Daytona 116500LN Panda',
        estimated_profit_dollars: 7000,
        discount_from_cmv_pct: 22.6
      }
    ];

    const ranked = rankArbitrageDeals(deals);
    expect(ranked[0].id).toBe('deal-2'); // $30,000 profit
    expect(ranked[1].id).toBe('deal-3'); // $7,000 profit
    expect(ranked[2].id).toBe('deal-1'); // $4,000 profit
  });
});

describe('Market Engine — Full Live Engine Hydration', () => {
  const engine = getLiveMarketEngine();

  it('loads all 5 benchmark luxury watch references', () => {
    expect(engine.watches).toHaveLength(5);
    const refs = engine.watches.map(w => w.reference);
    expect(refs).toContain('126610LN');   // Rolex Submariner
    expect(refs).toContain('116500LN');   // Rolex Daytona Panda
    expect(refs).toContain('126710BLRO'); // Rolex GMT-Master II Pepsi
    expect(refs).toContain('15500ST');    // AP Royal Oak
    expect(refs).toContain('5711/1A');    // Patek Philippe Nautilus
  });

  it('hydrates consistent macro metrics and arbitrage counts', () => {
    expect(engine.macro.arbitrageCount).toBe(engine.allArbitrageListings.length);
    expect(engine.macro.totalTrackedListings).toBeGreaterThan(0);
    expect(engine.macro.luxeIndexValue).toBeGreaterThan(0);
    expect(engine.macro.topArbitrageDeal).toBeDefined();
    expect(engine.macro.topArbitrageDeal.profitDollars).toBeGreaterThan(0);
  });

  it('calibrates tri-venue consensus pricing (50% Chrono24 + 30% eBay + 20% WatchCharts)', () => {
    for (const watch of engine.watches) {
      const mv = watch.multiVenue;
      expect(mv).toBeDefined();
      if (!mv) continue;

      expect(mv.chrono24.weightPct).toBe(50);
      expect(mv.ebay.weightPct).toBe(30);
      expect(mv.watchcharts.weightPct).toBe(20);

      const computedConsolidated = Math.round(
        (mv.chrono24.price * 0.50) +
        (mv.ebay.price * 0.30) +
        (mv.watchcharts.price * 0.20)
      );

      expect(mv.consolidatedPrice).toBe(computedConsolidated);
    }
  });

  it('provides 12 monthly historical data points for each reference', () => {
    for (const watch of engine.watches) {
      expect(watch.priceHistory.length).toBe(12);
      expect(watch.priceHistory[0].date).toMatch(/^2023-/);
      expect(watch.priceHistory[11].date).toMatch(/^2024-/);
    }
  });

  it('exports valid LIVE_DATA, WATCH_MODELS, and MACRO_METRICS singletons', () => {
    expect(WATCH_MODELS).toHaveLength(5);
    expect(MACRO_METRICS.arbitrageCount).toBeGreaterThan(0);
  });
});

describe('Market Engine — Dynamic Runtime Calculation Wiring', () => {
  const engine = getLiveMarketEngine();

  it('computes consensus market value dynamically via calculateTrimmedMean', () => {
    for (const watch of engine.watches) {
      expect(watch.dealerMetrics).toBeDefined();
      expect(watch.dealerMetrics!.consensusMarketValue).toBeGreaterThan(0);
      expect(watch.currentAskingAvg).toBe(watch.dealerMetrics!.consensusMarketValue);
    }
  });

  it('dynamically computes dealer buy-in and spread with 20% margin rule', () => {
    for (const watch of engine.watches) {
      expect(watch.dealerMetrics).toBeDefined();
      const expected = calculateDealerBuyIn(watch.dealerMetrics!.consensusMarketValue, 20);
      expect(watch.dealerMetrics!.dealerBuyInPrice).toBe(expected.buyIn);
      expect(watch.aiAnalysis.spreadDollars).toBe(expected.spread);
      expect(watch.aiAnalysis.currentSpread).toBe(20);
    }
  });

  it('computes arbitrage deal spreads dynamically at runtime', () => {
    for (const deal of engine.allArbitrageListings) {
      const watch = engine.watches.find(w => w.reference === deal.reference);
      expect(watch).toBeDefined();
      if (!watch || !watch.dealerMetrics) continue;

      const expectedSpread = calculateArbitrageSpread(deal.price, watch.dealerMetrics.consensusMarketValue);
      expect(deal.estimated_profit_dollars).toBe(expectedSpread.discountDollars);
      expect(deal.discount_from_cmv_pct).toBe(expectedSpread.discountPct);
    }
  });

  it('maintains strict descending profit rank in allArbitrageListings', () => {
    const deals = engine.allArbitrageListings;
    expect(deals.length).toBeGreaterThan(0);
    for (let i = 0; i < deals.length - 1; i++) {
      expect(deals[i].estimated_profit_dollars!).toBeGreaterThanOrEqual(deals[i + 1].estimated_profit_dollars!);
    }
  });

  it('dynamically computes market premium percentage over MSRP from dynamic CMV', () => {
    for (const watch of engine.watches) {
      expect(watch.dealerMetrics).toBeDefined();
      const cmv = watch.dealerMetrics!.consensusMarketValue;
      const msrp = watch.dealerMetrics!.retailMSRP;
      const expectedPremium = msrp > 0 ? Math.round(((cmv - msrp) / msrp) * 1000) / 10 : 0;
      expect(watch.dealerMetrics!.marketPremiumPct).toBe(expectedPremium);
    }
  });

  it('verifies multiVenue.chrono24 transparent ingestion status', () => {
    for (const watch of engine.watches) {
      expect(watch.multiVenue).toBeDefined();
      expect(watch.multiVenue!.chrono24.lastUpdated).toBe('Chrono24 Verified Ingestion');
      expect(watch.multiVenue!.chrono24.price).toBe(watch.dealerMetrics!.consensusMarketValue);
    }
  });
});


