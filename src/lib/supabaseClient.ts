import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://extdvvsqcpwekmbaslct.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KznAuLW0d_1mi7YtDxd3GQ_PRZCkLgl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Registers a new dealer or collector lead in Supabase
 */
export async function registerDealerLead(lead: {
  email: string;
  dealership: string;
  role: 'dealer' | 'collector';
}) {
  try {
    const { data, error } = await supabase
      .from('dealer_leads')
      .insert([
        {
          email: lead.email,
          dealership_name: lead.dealership,
          role: lead.role,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase lead insertion warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase lead error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Saves a dealer cash appraisal slip into Supabase
 */
export async function saveAppraisalToDb(appraisal: {
  dealerEmail?: string;
  dealershipName?: string;
  reference: string;
  brand: string;
  model: string;
  condition: string;
  hasBox: boolean;
  hasPapers: boolean;
  adjustedCMV: number;
  maxBuyOffer: number;
  projectedProfit: number;
  dealerMarginPct: number;
  clientName?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('appraisals')
      .insert([
        {
          dealer_email: appraisal.dealerEmail || 'guest@luxedata.io',
          dealership_name: appraisal.dealershipName || 'Independent Desk',
          reference: appraisal.reference,
          brand: appraisal.brand,
          model: appraisal.model,
          condition: appraisal.condition,
          has_box: appraisal.hasBox,
          has_papers: appraisal.hasPapers,
          adjusted_cmv: appraisal.adjustedCMV,
          max_buy_offer: appraisal.maxBuyOffer,
          projected_profit: appraisal.projectedProfit,
          dealer_margin_pct: appraisal.dealerMarginPct,
          client_name: appraisal.clientName || 'Walk-In Client',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase appraisal save warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase appraisal error:', err);
    return { success: false, error: err.message };
  }
}

