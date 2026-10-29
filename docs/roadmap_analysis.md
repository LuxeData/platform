# 🔍 Luxury Asset Intelligence Platform — Full Analysis & Roadmap

## TL;DR Verdict

> [!TIP]
> **This is a solid, well-structured document.** The idea is legit — fragmented luxury pricing data is a real pain point, the niche (watches) is smart for launch, and the phased approach (intelligence → marketplace) is the correct playbook. The split (Leo = business/sales, you = tech) makes sense. Below is my honest breakdown and the exact execution roadmap you should follow.

---

## 📋 Document Breakdown — What Leo Wrote

| Section | What It Says | My Take |
|---|---|---|
| **Niche** | Luxury watches first (Rolex, Omega, Tudor, Patek) | ✅ Smart. High AOV ($5K–$30K+), active secondary market, data-hungry buyers |
| **Problem** | Pricing data is fragmented across auction houses, forums, dealer sites | ✅ Real problem. Anyone who's tried to price a Submariner knows this pain |
| **Phase 1** | Subscription SaaS — aggregated price intelligence + AI scoring | ✅ Low-risk, no inventory, recurring revenue |
| **Phase 2** | P2P middleman marketplace with 5–10% commission | ✅ Classic marketplace play, but only after traffic/trust exists |
| **AI Features** | Opportunity ratings, price trend analysis, spread detection | ⚠️ Sounds good but needs grounding in real data first |
| **Validation** | Interview 3–5 dealers before building | ✅ This is the right instinct — most founders skip this |
| **Role Split** | Leo = biz/sales/fundraising, You = full-stack + AI + data | ⚠️ Heavy on your side — more on this below |

---

## ⚠️ Honest Concerns You Should Raise With Leo

### 1. Your Workload vs His

Leo's responsibilities (strategy, outreach, fundraising) are important but **back-loaded** — most of that work ramps up after the product exists. Meanwhile you're building:
- Full-stack web platform
- Data scrapers + API integrations
- Database infrastructure
- AI valuation models
- Security & performance

> [!WARNING]
> **You are doing 80% of the early work.** Make sure equity and vesting reflect this. A standard 50/50 split is only fair if Leo is actively closing those 3–5 dealer interviews, building a waitlist, and running customer discovery *right now* while you code. If he's waiting for you to build before he starts working, that's a red flag.

### 2. Data Sourcing is the Real Moat (and the Real Challenge)

The entire product depends on getting reliable historical sales data. Ask Leo:
- **Which auction houses have public APIs?** (Spoiler: very few. Christie's, Sotheby's, Bonhams don't offer public price APIs)
- **WatchCharts** has some data but may have terms restricting scraping
- **eBay Commerce API** is the most accessible but prices there skew lower than dealer/auction
- **Chrono24** is the biggest watch marketplace but aggressively blocks scraping

> [!IMPORTANT]
> **The data pipeline is the make-or-break technical challenge.** Don't underestimate it. This is where 60% of your early engineering effort will go.

### 3. Revenue Timeline

Subscription SaaS for a niche audience (luxury watch collectors/dealers) is a slow ramp. Expect:
- **Months 1–3**: Zero revenue (building + validating)
- **Months 4–6**: Maybe 10–50 free users, a handful of paid
- **Months 7–12**: If product-market fit exists, $1K–$5K MRR

Leo should be realistic about this. If he's pitching YC, the marketplace (Phase 2) is the big swing, but Phase 1 needs to work first.

---

## 🗺️ Your Execution Roadmap

### Phase 0: Foundation (Weeks 1–2) — DO THIS FIRST

```
YOU (Tech)                                    LEO (Business)
─────────────────────────────────────────     ─────────────────────────────────────
□ Set up project repo + CI/CD                 □ Interview 3-5 watch dealers/collectors
□ Choose tech stack (see below)               □ Document their exact workflow:
□ Set up dev environment                        - Where do they check prices?
□ Research data source APIs/legality            - What reference data matters most?
                                                - Would they pay for this? How much?
                                              □ Start building a waitlist landing page
                                              □ Join watch forums/Reddit communities
```

> [!IMPORTANT]
> **Gate the build on Leo's interviews.** Don't write a single scraper until Leo comes back with validated data sources from real dealers. If he can't get 3–5 interviews done in 2 weeks, that tells you something about his hustle.

### Phase 1A: MVP Data Platform (Weeks 3–6)

**Goal**: A working dashboard for 2–3 Rolex reference models with real price history.

#### Tech Stack Recommendation

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js + TypeScript | SSR for SEO, React ecosystem, fast iteration |
| **Styling** | Vanilla CSS with CSS variables | Full control, premium feel, no dependency bloat |
| **Backend API** | Node.js (Express or Fastify) or Python (FastAPI) | Python preferred if heavy on data/ML later |
| **Database** | PostgreSQL + TimescaleDB extension | Time-series price data is your bread and butter |
| **Cache** | Redis | For rate limiting, session cache, hot price data |
| **Data Pipeline** | Python scripts + Celery/cron jobs | Scraping, API polling, data normalization |
| **AI/ML** | Python + scikit-learn → upgrade to custom models later | Start simple — regression models on price factors |
| **Hosting** | Vercel (frontend) + Railway/Fly.io (backend) | Cheap, fast deploys, good free tiers |
| **Search** | Meilisearch or Algolia | Fast reference model search with typo tolerance |

#### MVP Features (Build Only These)

1. **Reference Model Search** — Search by brand, model, reference number
2. **Price History Chart** — Line chart of historical sold prices over time
3. **Current Market Snapshot** — Avg asking price, recent sales, price range
4. **Basic AI Score** — Simple scoring based on: current price vs. 6-month avg, volume trend, price volatility
5. **Watchlist** — Save models you're tracking

#### Data Sources (Priority Order)

| Source | Access Method | Data Quality | Difficulty |
|---|---|---|---|
| eBay Sold Listings | eBay Browse API | Medium (noisy) | Low |
| WatchCharts | Web scraping (check ToS) | High | Medium |
| Chrono24 | Web scraping (aggressive anti-bot) | High | Hard |
| Public Auction Results | Individual scrapers per house | Very High | Medium-Hard |
| Reddit r/Watchexchange | Reddit API | Medium | Low |

### Phase 1B: Paid Tier + Growth (Weeks 7–12)

**Goal**: First paying users. $500+ MRR.

```
YOU (Tech)                                    LEO (Business)
─────────────────────────────────────────     ─────────────────────────────────────
□ Implement Stripe subscription billing       □ Run targeted ads (IG, watch forums)
□ Build Pro features:                         □ Partner with 2-3 watch YouTubers
  - Advanced price spread analysis            □ Post market analysis content on social
  - Custom alerts (price drops, deals)        □ Collect user feedback religiously
  - AI deal-finder notifications              □ Start YC application if traction exists
□ Improve AI scoring model with more data     □ Build dealer partnerships for data
□ Add more reference models (50-100+)
□ Performance optimization + mobile UX
```

### Phase 2: Marketplace (Month 6+ — ONLY if Phase 1 works)

> [!CAUTION]
> **Do NOT build marketplace features until you have at least 500+ active users and clear demand.** The marketplace is capital-intensive (escrow, KYC, dispute resolution, fraud prevention) and requires trust that takes months to build.

When ready:
- Escrow system (use Stripe Connect or Mangopay)
- KYC/ID verification (use Persona or Onfido API)
- Listing system with photo upload + serial verification
- Buyer protection + dispute resolution flow
- 5–10% commission on completed sales

---

## 💰 Things to Agree With Leo BEFORE You Start

| Topic | What to Discuss |
|---|---|
| **Equity Split** | 50/50 is standard for co-founders, but negotiate vesting (4-year, 1-year cliff). If you're doing more early work, consider 55/45 or accelerated vesting |
| **Vesting Schedule** | **Non-negotiable**: 4-year vesting with 1-year cliff for BOTH of you. If either walks after 3 months, the other isn't stuck giving away half the company |
| **Decision Making** | Who has final say on product vs. business decisions? |
| **Expenses** | Who's paying for hosting, APIs, tools in the early months? |
| **IP Ownership** | All code belongs to the company, not to you personally |
| **Time Commitment** | Is this full-time for both? If Leo has another job, that changes things |
| **Exit Scenarios** | What if one of you wants out in 6 months? |

> [!IMPORTANT]
> **Get a simple co-founder agreement in writing.** Doesn't need to be a lawyer document — even a signed Google Doc covering equity, vesting, roles, and what happens if someone leaves. YC has a standard template called the [YC Handshake Deal](https://www.ycombinator.com/handshake).

---

## 🎯 Success Metrics (What Good Looks Like)

| Timeframe | Milestone |
|---|---|
| **Week 2** | Leo has completed 3+ dealer interviews with documented insights |
| **Week 6** | Working MVP with real data for 3–5 Rolex references |
| **Week 8** | 50+ registered users, feedback from 10+ active users |
| **Week 12** | 10+ paying subscribers, $500+ MRR |
| **Month 6** | 500+ users, $2K+ MRR, clear signal on marketplace demand |
| **Month 9** | YC application with real traction data |

---

## 🏁 Your Immediate Next Steps (This Week)

1. **Talk to Leo** — Share this analysis. Align on the co-founder agreement points above (especially equity/vesting)
2. **Set a deadline for Leo** — He needs to complete 3 dealer interviews within 2 weeks. This is his first "proof of work"
3. **Start your research** — Spend 2–3 days auditing eBay API, Chrono24, WatchCharts for data availability and legal terms
4. **Set up the project** — Repo, CI/CD, basic Next.js scaffold, PostgreSQL schema for price data
5. **Build the landing page together** — Even before the product exists, start collecting emails

> [!TIP]
> **The idea is good. The document is solid. The real question is execution.** Leo's ability to hustle on the business side in the first 4 weeks will tell you everything you need to know about whether this partnership works. Watch what he *does*, not what he *says*.
