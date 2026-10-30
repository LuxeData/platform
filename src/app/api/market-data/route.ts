import { NextResponse } from 'next/server';
import { getLiveMarketEngine } from '@/lib/marketEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const marketData = getLiveMarketEngine();
    
    return NextResponse.json({
      status: 'success',
      provenance: 'Chrono24 Consensus Valuation Engine v1.0',
      methodology: '10% Trimmed Mean of Professional Dealer Listings with 20% Buy-In Floor',
      timestamp: new Date().toISOString(),
      macro: marketData.macro,
      watches_count: marketData.watches.length,
      arbitrage_deals_count: marketData.allArbitrageListings.length,
      data: {
        macro: marketData.macro,
        references: marketData.watches,
        arbitrage: marketData.allArbitrageListings
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to compute market engine data' },
      { status: 500 }
    );
  }
}

