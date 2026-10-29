"""
LuxeData Price Ingestion & Valuation Engine Prototype
Fetches and analyzes open market sales data for target watch references.
"""

import sys
import json
import re
import urllib.request
from datetime import datetime, timezone

def calculate_ai_valuation(reference: str, sales_data: list, asking_price: float):
    """
    Computes fair market value, liquidity score, and AI opportunity rating (0-10).
    """
    if not sales_data:
        return None

    sold_prices = [item['price'] for item in sales_data if item.get('price')]
    sold_prices.sort()

    # Outlier rejection: Trim top and bottom 10%
    n = len(sold_prices)
    trimmed = sold_prices[int(n*0.1):int(n*0.9)] if n >= 5 else sold_prices
    
    fair_market_value = sum(trimmed) / len(trimmed) if trimmed else 0
    spread_dollars = asking_price - fair_market_value
    spread_pct = (spread_dollars / fair_market_value) * 100 if fair_market_value else 0

    # Valuation scoring formula:
    # Lower asking price relative to fair value = higher arbitrage opportunity
    if spread_pct < -5.0:
        opp_score = 9.2 # Severe discount / immediate buy
        rec = "STRONG BUY / ARBITRAGE"
    elif spread_pct <= 2.0:
        opp_score = 8.4 # Fair to slight discount
        rec = "ACCUMULATE / FAIR VALUE"
    elif spread_pct <= 8.0:
        opp_score = 6.8 # Standard dealer premium
        rec = "HOLD / MONITOR"
    else:
        opp_score = 4.5 # Overpriced relative to auction hammer
        rec = "OVERVALUED"

    liquidity_score = min(98, max(40, len(sales_data) * 15))

    return {
        "reference": reference,
        "sample_size": len(sold_prices),
        "fair_market_value": round(fair_market_value, 2),
        "asking_price": asking_price,
        "spread_dollars": round(spread_dollars, 2),
        "spread_pct": round(spread_pct, 2),
        "opportunity_score": opp_score,
        "recommendation": rec,
        "liquidity_score": liquidity_score,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    print("--- LuxeData AI Valuation Engine Prototype ---")
    # Test with baseline Rolex Submariner 126610LN
    mock_sales = [
        {"price": 13200, "source": "Sotheby's", "date": "2024-10-24"},
        {"price": 13050, "source": "eBay", "date": "2024-10-22"},
        {"price": 13650, "source": "Chrono24", "date": "2024-10-18"},
        {"price": 13400, "source": "Dealer Direct", "date": "2024-10-15"},
        {"price": 12900, "source": "Antiquorum", "date": "2024-10-10"},
    ]

    analysis = calculate_ai_valuation("126610LN", mock_sales, asking_price=14250)
    print(json.dumps(analysis, indent=2))
