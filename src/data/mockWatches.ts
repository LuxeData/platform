import { WatchModel } from '../types/watch';

export const WATCH_MODELS: WatchModel[] = [
  {
    id: 'rolex-submariner-126610ln',
    brand: 'Rolex',
    model: 'Submariner Date 41',
    reference: '126610LN',
    category: 'Sports / Steel',
    caseSize: '41mm',
    dialColor: 'Black Cerachrom',
    material: 'Oystersteel',
    currentAskingAvg: 14250,
    recentSoldAvg: 13400,
    thirtyDayChangePct: 2.1,
    oneYearChangePct: -4.8,
    aiAnalysis: {
      opportunityScore: 8.4,
      recommendation: 'STRONG BUY / ARBITRAGE',
      confidence: 94,
      liquidityScore: 98,
      stabilityRating: 'Ultra High',
      retailMSRP: 10250,
      fairMarketValue: 13500,
      currentSpread: 6.3,
      spreadDollars: 850,
      summary: 'The 126610LN has settled into an accumulation floor after a 2-year correction from peak 2022 levels. Dealer-to-auction spread sits at $850 (6.3%), creating immediate arbitrage opportunities on full-set lots trading below $13,200.',
      catalysts: [
        'High institutional demand with near-instant liquidity (average turnover 7.4 days)',
        'Secondary market prices stabilised above retail (+31% over MSRP premium floor)',
        'Consistent high bid volume across European and US auction houses'
      ],
      riskFactors: [
        'Higher production quotas from Rolex Geneva compared to Daytona lines',
        'Sensitive to macroeconomic sentiment in the sub-$15,000 retail segment'
      ]
    },
    priceHistory: [
      { date: '2023-11', price: 14100, volume: 142 },
      { date: '2023-12', price: 13950, volume: 165 },
      { date: '2024-01', price: 13800, volume: 110 },
      { date: '2024-02', price: 13650, volume: 125 },
      { date: '2024-03', price: 13400, volume: 180, event: 'Watches & Wonders 2024' },
      { date: '2024-04', price: 13200, volume: 155 },
      { date: '2024-05', price: 13150, volume: 130 },
      { date: '2024-06', price: 13300, volume: 145 },
      { date: '2024-07', price: 13350, volume: 160 },
      { date: '2024-08', price: 13250, volume: 140 },
      { date: '2024-09', price: 13350, volume: 175 },
      { date: '2024-10', price: 13400, volume: 195 }
    ],
    recentSales: [
      {
        id: 's-101',
        source: 'Sotheby\'s',
        date: '2024-10-24',
        soldPrice: 13200,
        askingPrice: 14500,
        condition: 'Unworn / Mint',
        boxAndPapers: true,
        year: 2023,
        verified: true
      },
      {
        id: 's-102',
        source: 'eBay',
        date: '2024-10-22',
        soldPrice: 13050,
        askingPrice: 13800,
        condition: 'Very Good',
        boxAndPapers: true,
        year: 2022,
        verified: true
      },
      {
        id: 's-103',
        source: 'Chrono24 Direct',
        date: '2024-10-18',
        soldPrice: 13650,
        askingPrice: 14200,
        condition: 'Unworn / Mint',
        boxAndPapers: true,
        year: 2024,
        verified: true
      },
      {
        id: 's-104',
        source: 'Antiquorum',
        date: '2024-10-10',
        soldPrice: 12800,
        askingPrice: 13500,
        condition: 'Good',
        boxAndPapers: false,
        year: 2021,
        verified: true
      }
    ]
  },
  {
    id: 'rolex-daytona-116500ln',
    brand: 'Rolex',
    model: 'Cosmograph Daytona',
    reference: '116500LN',
    category: 'Chronograph',
    caseSize: '40mm',
    dialColor: 'White "Panda"',
    material: 'Oystersteel',
    currentAskingAvg: 29800,
    recentSoldAvg: 28100,
    thirtyDayChangePct: 3.4,
    oneYearChangePct: 1.8,
    aiAnalysis: {
      opportunityScore: 8.9,
      recommendation: 'STRONG BUY / ARBITRAGE',
      confidence: 91,
      liquidityScore: 92,
      stabilityRating: 'Ultra High',
      retailMSRP: 15100,
      fairMarketValue: 28500,
      currentSpread: 6.0,
      spreadDollars: 1700,
      summary: 'Discontinued in 2023 in favor of Ref. 126500LN. White Panda dials are commanding a sharp collector premium with strong secondary resilience. Dealer spreads average $1,700.',
      catalysts: [
        'Discontinued reference status cements long-term collectibility',
        'Consistently outperforms black dial variant by 18-22% in realized auction results',
        'High international demand across Hong Kong, Zurich, and London dealers'
      ],
      riskFactors: [
        'High price tier sensitive to crypto and luxury index swings',
        'Proliferation of counterfeit dials requires strict serial & paper provenance verification'
      ]
    },
    priceHistory: [
      { date: '2023-11', price: 27900, volume: 65 },
      { date: '2023-12', price: 27500, volume: 72 },
      { date: '2024-01', price: 27200, volume: 55 },
      { date: '2024-02', price: 27400, volume: 60 },
      { date: '2024-03', price: 27800, volume: 80 },
      { date: '2024-04', price: 28000, volume: 75 },
      { date: '2024-05', price: 27900, volume: 68 },
      { date: '2024-06', price: 28200, volume: 82 },
      { date: '2024-07', price: 28050, volume: 70 },
      { date: '2024-08', price: 27950, volume: 64 },
      { date: '2024-09', price: 28100, volume: 78 },
      { date: '2024-10', price: 28100, volume: 92 }
    ],
    recentSales: [
      {
        id: 's-201',
        source: 'Christie\'s',
        date: '2024-10-25',
        soldPrice: 28400,
        askingPrice: 30500,
        condition: 'Unworn / Mint',
        boxAndPapers: true,
        year: 2023,
        verified: true
      },
      {
        id: 's-202',
        source: 'Chrono24 Direct',
        date: '2024-10-19',
        soldPrice: 27900,
        askingPrice: 29500,
        condition: 'Very Good',
        boxAndPapers: true,
        year: 2021,
        verified: true
      },
      {
        id: 's-203',
        source: 'Sotheby\'s',
        date: '2024-10-12',
        soldPrice: 28900,
        askingPrice: 31000,
        condition: 'Unworn / Mint',
        boxAndPapers: true,
        year: 2022,
        verified: true
      }
    ]
  },
  {
    id: 'patek-nautilus-5711',
    brand: 'Patek Philippe',
    model: 'Nautilus Blue Dial',
    reference: '5711/1A-010',
    category: 'Sports / Steel',
    caseSize: '40mm',
    dialColor: 'Sunburst Blue',
    material: 'Stainless Steel',
    currentAskingAvg: 104500,
    recentSoldAvg: 98000,
    thirtyDayChangePct: -1.2,
    oneYearChangePct: -8.5,
    aiAnalysis: {
      opportunityScore: 7.2,
      recommendation: 'FAIR VALUE',
      confidence: 88,
      liquidityScore: 74,
      stabilityRating: 'Moderate',
      retailMSRP: 34890,
      fairMarketValue: 97500,
      currentSpread: 6.6,
      spreadDollars: 6500,
      summary: 'The holy grail stainless sports watch. Following the 2021-2022 speculative bubble ($160k+), prices have consolidated around the $95k-$100k zone. Spread between private listing and auction hammer is substantial ($6,500).',
      catalysts: [
        'Iconic Gerald Genta design with permanent blue-chip status in horology',
        'Total retirement of the 5711 line guarantees no future supply dilution'
      ],
      riskFactors: [
        'Higher spread and lower velocity than sub-$30k Rolex lines',
        'Buyer pool is strictly ultra-high-net-worth (longer days to sell: ~38 days)'
      ]
    },
    priceHistory: [
      { date: '2023-11', price: 108000, volume: 22 },
      { date: '2023-12', price: 105000, volume: 18 },
      { date: '2024-01', price: 103000, volume: 15 },
      { date: '2024-02', price: 101000, volume: 20 },
      { date: '2024-03', price: 99500, volume: 25 },
      { date: '2024-04', price: 98000, volume: 28 },
      { date: '2024-05', price: 97500, volume: 19 },
      { date: '2024-06', price: 98500, volume: 24 },
      { date: '2024-07', price: 99000, volume: 21 },
      { date: '2024-08', price: 97800, volume: 16 },
      { date: '2024-09', price: 98200, volume: 22 },
      { date: '2024-10', price: 98000, volume: 26 }
    ],
    recentSales: [
      {
        id: 's-301',
        source: 'Sotheby\'s',
        date: '2024-10-21',
        soldPrice: 97500,
        askingPrice: 105000,
        condition: 'Very Good',
        boxAndPapers: true,
        year: 2019,
        verified: true
      },
      {
        id: 's-302',
        source: 'Antiquorum',
        date: '2024-09-28',
        soldPrice: 101000,
        askingPrice: 108000,
        condition: 'Unworn / Mint',
        boxAndPapers: true,
        year: 2021,
        verified: true
      }
    ]
  },
  {
    id: 'omega-speedmaster-moonwatch',
    brand: 'Omega',
    model: 'Speedmaster Professional Co-Axial Master Chronometer',
    reference: '310.30.42.50.01.002',
    category: 'Chronograph',
    caseSize: '42mm',
    dialColor: 'Matte Step Dial Black',
    material: 'Stainless Steel (Sapphire Sandwich)',
    currentAskingAvg: 6900,
    recentSoldAvg: 6250,
    thirtyDayChangePct: 1.5,
    oneYearChangePct: 0.8,
    aiAnalysis: {
      opportunityScore: 8.7,
      recommendation: 'STRONG BUY / ARBITRAGE',
      confidence: 96,
      liquidityScore: 94,
      stabilityRating: 'Ultra High',
      retailMSRP: 8000,
      fairMarketValue: 6350,
      currentSpread: 10.4,
      spreadDollars: 650,
      summary: 'High transaction velocity watch with an accessible price point ($6k range). Trades below retail MSRP, giving great entry pricing. Consistent 10%+ spread between dealer asking and open auction hammer prices.',
      catalysts: [
        'Massive global collector liquidity and consistent retail crossover demand',
        'Calibre 3861 upgrade provides superior co-axial chronometer timing'
      ],
      riskFactors: [
        'Abundant dealer inventory prevents runaway speculative appreciation'
      ]
    },
    priceHistory: [
      { date: '2023-11', price: 6150, volume: 210 },
      { date: '2023-12', price: 6200, volume: 245 },
      { date: '2024-01', price: 6180, volume: 180 },
      { date: '2024-02', price: 6220, volume: 195 },
      { date: '2024-03', price: 6250, volume: 230 },
      { date: '2024-04', price: 6200, volume: 215 },
      { date: '2024-05', price: 6190, volume: 200 },
      { date: '2024-06', price: 6240, volume: 220 },
      { date: '2024-07', price: 6260, volume: 210 },
      { date: '2024-08', price: 6230, volume: 195 },
      { date: '2024-09', price: 6240, volume: 235 },
      { date: '2024-10', price: 6250, volume: 260 }
    ],
    recentSales: [
      {
        id: 's-401',
        source: 'eBay',
        date: '2024-10-26',
        soldPrice: 6150,
        askingPrice: 6800,
        condition: 'Very Good',
        boxAndPapers: true,
        year: 2022,
        verified: true
      },
      {
        id: 's-402',
        source: 'WatchExchange',
        date: '2024-10-20',
        soldPrice: 6000,
        askingPrice: 6450,
        condition: 'Good',
        boxAndPapers: true,
        year: 2021,
        verified: true
      }
    ]
  }
];
