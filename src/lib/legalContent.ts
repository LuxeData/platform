export interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  version: string;
  effectiveDate: string;
  governingLaw: string;
  summary: string;
  sections: LegalSection[];
}

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Institutional Terms of Service",
  subtitle: "Enterprise Software & Quantitative Valuation Data Services Agreement",
  version: "2026.2-SV",
  effectiveDate: "October 31, 2026",
  governingLaw: "State of Delaware, United States",
  summary: "These Terms of Service constitute a legally binding agreement between LuxeData Technologies Inc. and your institutional entity governing access to the LuxeData asset intelligence terminal, proprietary Tri-Venue consensus algorithms, dealer appraisal modules, and market data feeds.",
  sections: [
    {
      id: "acceptance",
      number: "1.0",
      title: "Acceptance of Agreement & Institutional Scope",
      content: [
        "By accessing, querying, compiling, or otherwise utilizing the LuxeData terminal, API feeds, market consensus engine, or dealer appraisal certificates (collectively, the 'Platform' or 'Services'), you ('Customer', 'Dealer', 'Licensee', or 'You') agree to be unconditionally bound by these Terms of Service ('Terms').",
        "If you are entering into this Agreement on behalf of a corporation, limited liability company, partnership, collateral lender, family office, or independent luxury watch dealership, you represent and warrant that you possess full legal authority to bind said entity to these Terms. If you lack such authority or do not agree with any provision herein, you must immediately terminate access to the Platform."
      ]
    },
    {
      id: "eligibility",
      number: "2.0",
      title: "Authorized Eligibility & Commercial Representations",
      content: [
        "The Platform is engineered exclusively as a business-to-business (B2B) institutional intelligence system for professional horological dealers, secondary market liquidity providers, asset-backed collateral lenders, auction specialists, and qualified high-value asset managers.",
        "The Services are not marketed to or intended for individual consumer personal retail use. By utilizing the Platform, you affirm under penalty of contract cancellation that all appraisal generations, arbitrage queries, and consensus data calculations are conducted for legitimate commercial or portfolio appraisal operations."
      ]
    },
    {
      id: "algorithmic-methodology",
      number: "3.0",
      title: "Tri-Venue Quantitative Consensus Methodology",
      content: [
        "LuxeData synthesizes real-time secondary market liquidity across three distinct provenance vectors: (a) Active Professional Dealer & Collector Ask Books (Chrono24 ingestion); (b) Verified Realized Hammer Transactions (eBay Authenticity Guarantee completed cash sales); and (c) Wholesale Dealer Inventory Indices (WatchCharts composite points).",
        "The resulting Consensus Market Price is calculated through a proprietary 10% trimmed mean algorithm designed to dynamically eliminate extreme listing outliers, speculative ask spikes, and distressed fire-sales. Liquidity depth, bid-ask spread compression, and 20% standard dealer buy-in floors represent algorithmic quantitative estimations derived from available historical sample sizes."
      ]
    },
    {
      id: "financial-disclaimer",
      number: "4.0",
      title: "Strict Financial, Appraisal & Securities Disclaimer",
      content: [
        "NO CERTIFIED APPRAISAL: LuxeData Technologies Inc. is an independent quantitative data provider and is NOT a certified personal property appraiser under the Uniform Standards of Professional Appraisal Practice (USPAP), nor is it affiliated with the American Society of Appraisers (ASA). Generated Dealer Appraisal Certificates reflect automated statistical consensus benchmarks and must not be construed as statutory appraisals for judicial, tax, or bankruptcy proceedings without independent verification.",
        "NO INVESTMENT ADVICE: The Platform does not constitute an offer, recommendation, or solicitation to purchase, finance, hypothecate, or liquidate any timepiece, physical commodity, or alternative investment asset. Horological assets are subject to extreme liquidity volatility, physical condition variance, counterfeit risks, and macroeconomic fluctuations. Customer assumes sole responsibility for all capital allocations, purchase orders, collateral loan-to-value (LTV) ratios, and inventory holdings."
      ]
    },
    {
      id: "proprietary-ip",
      number: "5.0",
      title: "Intellectual Property & Trade Secret Restrictions",
      content: [
        "All algorithms, weighting formulas, consensus models, user interface paradigms, design systems, source code, data architectures, and cryptographic appraisal verification hashes embody protected trade secrets under the United States Defend Trade Secrets Act (18 U.S.C. § 1836) and the Uniform Trade Secrets Act.",
        "PROHIBITED ACTIONS: Customer shall not, directly or indirectly: (a) Decompile, disassemble, reverse engineer, or attempt to derive mathematical weighting coefficients of the consensus engine; (b) Scrape, crawl, harvest, or extract data points via automated bots, scripts, or unauthorized headless browsers; (c) Resell, redistribute, sublicense, or wrap the Platform as a commercial bureau or competing SaaS offering; or (d) Ingest or feed any part of the Platform or realized transaction datasets into artificial intelligence, LLM, or neural network training pipelines without express prior written consent."
      ]
    },
    {
      id: "subscriptions-billing",
      number: "6.0",
      title: "Commercial Subscriptions, Invoicing & Direct Wire Terms",
      content: [
        "BILLING STRUCTURE: Professional Dealer Desk subscriptions are billed on an upfront annual basis ($1,188/year) via direct corporate bank invoice (ACH/wire transfer) or authorized corporate credit card. Enterprise Multi-Seat Licenses and Institutional API feeds are billed according to custom Master Services Agreements ($5,000 to $10,000 monthly).",
        "PAYMENT TERMS: Direct invoices are payable Net 15 days from issuance. Overdue balances accrue late interest at the rate of 1.5% per month (or the maximum permitted by Delaware law). LuxeData reserves the right to suspend terminal access and revoke API authorization keys for accounts delinquent beyond 15 business days. All subscription fees are strictly non-refundable once the billing period has commenced."
      ]
    },
    {
      id: "security-accounts",
      number: "7.0",
      title: "Account Security, Credentials & Rate Limiting",
      content: [
        "Each authorized dealer seat is provisioned for dedicated professional use. Sharing authentication tokens, API keys, or session credentials outside authorized employees of the licensed entity is strictly prohibited and constitutes an incurable material breach resulting in immediate termination.",
        "To protect platform infrastructure from denial-of-service and fraudulent scraping, LuxeData enforces strict algorithmic rate-limiting (standard baseline: 120 queries/minute per licensed seat). Attempts to circumvent rate limits via IP proxy pools or rotation will trigger automated security lockouts."
      ]
    },
    {
      id: "limitation-liability",
      number: "8.0",
      title: "Limitation of Liability & Consequential Damages",
      content: [
        "TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL LUXEDATA TECHNOLOGIES INC., ITS OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, AFFILIATES, OR DATA LICENSORS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOSS OF PROFITS, TRADING LOSSES, CAPITAL IMPAIRMENT, INVENTORY DEPRECIATION, OR BUSINESS INTERRUPTION) ARISING OUT OF OR IN CONNECTION WITH THE PLATFORM.",
        "THE AGGREGATE CUMULATIVE LIABILITY OF LUXEDATA TECHNOLOGIES INC. FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT, REGARDLESS OF THE LEGAL THEORY (WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE), SHALL BE STRICTLY LIMITED TO THE TOTAL FEES ACTUALLY PAID BY CUSTOMER TO LUXEDATA IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY."
      ]
    },
    {
      id: "governing-law",
      number: "9.0",
      title: "Governing Law, Venue & Mandatory Binding Arbitration",
      content: [
        "This Agreement, its interpretation, and any dispute arising out of or related to it shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to choice of law principles.",
        "Any controversy or claim arising out of or relating to this contract, or the breach thereof, shall be determined by final and binding commercial arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The seat and venue of arbitration shall be Wilmington, Delaware (or, at Customer's election, San Francisco, California). Class action proceedings are strictly waived by both parties."
      ]
    },
    {
      id: "contact",
      number: "10.0",
      title: "Institutional Legal & Enterprise Inquiries",
      content: [
        "For legal notices, enterprise contract modifications, corporate compliance verification, or audit requests, please submit formal correspondence to:",
        "LuxeData Technologies Inc. • Attention: Office of the General Counsel • 1209 Orange Street, Wilmington, DE 19801 • Email: legal@luxedata.io"
      ]
    }
  ]
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "Global Enterprise Privacy Policy",
  subtitle: "Institutional Data Governance, Security & Confidentiality Framework",
  version: "2026.2-SV",
  effectiveDate: "October 31, 2026",
  governingLaw: "GDPR (EU), CCPA/CPRA (California), Delaware DPDPA",
  summary: "LuxeData Technologies Inc. is committed to institutional data confidentiality. This Privacy Policy details the technical measures, cryptographic isolation, and regulatory standards we apply to protect dealer data, inventory appraisal queries, and user credentials. We operate on a strict Zero-Brokering and No-Sale pledge.",
  sections: [
    {
      id: "privacy-scope",
      number: "1.0",
      title: "Commitment & Regulatory Compliance Scope",
      content: [
        "LuxeData Technologies Inc. ('LuxeData', 'we', 'our', or 'us') designs financial-grade data platforms for the luxury horological market. We operate this Platform in rigorous alignment with global data protection standards, including the General Data Protection Regulation (Regulation (EU) 2016/679 - 'GDPR'), the California Consumer Privacy Act as amended by the CPRA ('CCPA'), and the Delaware Personal Data Privacy Act ('DPDPA').",
        "We recognize that timepiece valuations, dealer inventory lists, client appraisal requests, and pricing margin thresholds represent commercially sensitive corporate confidential information. Our architecture is engineered around the principle of absolute confidentiality."
      ]
    },
    {
      id: "data-collected",
      number: "2.0",
      title: "Categories of Information Collected",
      content: [
        "1. Commercial Dealer Account Information: Corporate entity name, dealer license number, jurisdiction, primary contact email, corporate telephone, and billing/tax identifiers collected during corporate onboarding.",
        "2. Terminal Query & Appraisal Telemetry: Watch references searched, condition inputs, custom buy-in margin spreads, and generated Certificate IDs. When stored, appraisal certificates are isolated via cryptographic tenant IDs in PostgreSQL database instances utilizing Row-Level Security (RLS).",
        "3. Security & Telemetry Infrastructure: IP addresses, browser TLS fingerprint, timestamp logs, and authentication token signatures collected strictly for multi-factor session validation, anomaly detection, and defense against automated scraping attacks."
      ]
    },
    {
      id: "no-sale-pledge",
      number: "3.0",
      title: "Zero-Brokering & No-Sale of Data Pledge (CCPA § 1798.120)",
      content: [
        "WE DO NOT SELL, RENT, MONETIZE, TRADE, OR LEASE YOUR PERSONAL OR DEALER INVENTORY DATA TO ANY THIRD PARTY, ADVERTISING BROKER, OR FINANCIAL SPECULATOR.",
        "Under no circumstances do we share dealer appraisal activity, customer buy-in offers, or portfolio valuations with outside commercial brokerages or market participants. Your appraisal activity remains strictly quarantined within your authenticated organizational workspace."
      ]
    },
    {
      id: "lawful-basis",
      number: "4.0",
      title: "Lawful Basis for Processing (GDPR Article 6)",
      content: [
        "We process personal and organizational data exclusively pursuant to the following lawful grounds: (a) Performance of Contract: To authenticate access to the terminal and execute requested consensus valuations; (b) Legitimate Commercial Interests: To enforce rate-limits, prevent credential theft, maintain 99.9% uptime, and audit mathematical engine outputs; and (c) Statutory Compliance: To satisfy corporate tax, accounting, and anti-fraud reporting requirements."
      ]
    },
    {
      id: "security-encryption",
      number: "5.0",
      title: "Enterprise Encryption & Technical Architecture",
      content: [
        "DATA IN TRANSIT: All API communications, websocket streams, and terminal interactions are encrypted using Transport Layer Security (TLS 1.3) with modern cipher suites.",
        "DATA AT REST: Database records, appraisal ledger logs, and authentication tokens are encrypted at rest using Advanced Encryption Standard with 256-bit keys (AES-256) through hardware security modules (HSMs).",
        "TENANT ISOLATION: User sessions and saved appraisals leverage Supabase PostgreSQL Row-Level Security (RLS) policies enforcing cryptographic tenant isolation, preventing cross-tenant data leakage even in low-level database query environments."
      ]
    },
    {
      id: "data-retention",
      number: "6.0",
      title: "Data Retention & Automated Purge Schedules",
      content: [
        "Account profiles and billing records are maintained for the active duration of the customer agreement plus seven (7) years to satisfy statutory tax and financial auditing mandates.",
        "Temporary session cache tokens, IP connection logs, and rate-limiting telemetry are automatically purged on a rolling 30-day schedule. Customers may submit written requests for cryptographic deletion of historical appraisal logs upon account deactivation."
      ]
    },
    {
      id: "privacy-rights",
      number: "7.0",
      title: "Global Data Rights (GDPR & CCPA/CPRA Requests)",
      content: [
        "Regardless of your geographic location, LuxeData extends institutional privacy rights to all authorized accounts: (a) Right to Access: Request a machine-readable export of all stored account and appraisal data; (b) Right to Rectification: Correct inaccurate corporate or contact records; (c) Right to Erasure: Request permanent deletion of non-statutory records ('Right to Be Forgotten'); and (d) Right to Non-Discrimination: The quality, pricing, and latency of your terminal access will never be impaired for exercising your statutory privacy rights.",
        "To submit a formal Data Subject Access Request (DSAR), email our compliance team at privacy@luxedata.io. All verified requests receive confirmation within forty-eight (48) hours and full fulfillment within thirty (30) days."
      ]
    },
    {
      id: "dpo-contact",
      number: "8.0",
      title: "Data Protection Officer & Privacy Compliance Contact",
      content: [
        "LuxeData Technologies Inc. has designated a corporate Data Protection Officer (DPO) to oversee ongoing compliance with European, federal, and state data privacy statutes.",
        "Data Protection Officer: Office of Data Governance • LuxeData Technologies Inc. • 1209 Orange Street, Wilmington, DE 19801 • Email: dpo@luxedata.io • General Inquiries: privacy@luxedata.io"
      ]
    }
  ]
};

