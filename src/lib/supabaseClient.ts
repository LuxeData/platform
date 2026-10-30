import { createClient } from '@supabase/supabase-js';
import { UserSession } from '../types/watch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://extdvvsqcpwekmbaslct.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KznAuLW0d_1mi7YtDxd3GQ_PRZCkLgl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verifies if an email has Pro status in Supabase dealer_leads, or registers a new dealer lead
 */
export async function verifyOrRegisterDealer(lead: {
  email: string;
  dealership?: string;
  role?: 'dealer' | 'collector';
}): Promise<{ success: boolean; user: UserSession; isNew: boolean; error?: string }> {
  try {
    const cleanEmail = lead.email.trim().toLowerCase();

    // 1. Check if dealer exists in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from('dealer_leads')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      const isProRole = ['pro', 'partner', 'admin', 'vip'].includes(existing.role?.toLowerCase());
      const sessionUser: UserSession = {
        name: existing.dealership_name || 'Verified Member',
        email: existing.email,
        dealership: existing.dealership_name || 'Independent Horology Desk',
        role: existing.role || 'dealer',
        tier: isProRole ? 'pro' : 'free'
      };
      return { success: true, user: sessionUser, isNew: false };
    }

    // 2. If new user, register them in dealer_leads
    const newDealership = lead.dealership?.trim() || 'Independent Horology Desk';
    const newRole = lead.role || 'dealer';

    const { data: inserted, error: insertError } = await supabase
      .from('dealer_leads')
      .insert([
        {
          email: cleanEmail,
          dealership_name: newDealership,
          role: newRole,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.warn('Supabase lead registration notice:', insertError.message);
      // Fallback local session if Supabase has network glitch
      return {
        success: true,
        user: {
          name: newDealership,
          email: cleanEmail,
          dealership: newDealership,
          role: newRole,
          tier: 'free'
        },
        isNew: true
      };
    }

    const sessionUser: UserSession = {
      name: inserted.dealership_name || newDealership,
      email: inserted.email,
      dealership: inserted.dealership_name || newDealership,
      role: inserted.role || newRole,
      tier: 'free'
    };

    return { success: true, user: sessionUser, isNew: true };
  } catch (err: any) {
    console.error('Supabase dealer verification error:', err);
    return {
      success: false,
      user: {
        name: lead.dealership || 'Guest Member',
        email: lead.email,
        dealership: lead.dealership || 'Independent Horology Desk',
        role: 'dealer',
        tier: 'free'
      },
      isNew: false,
      error: err.message
    };
  }
}

/**
 * Registers a new dealer or collector lead in Supabase
 */
export async function registerDealerLead(lead: {
  email: string;
  dealership: string;
  role: 'dealer' | 'collector';
}) {
  return verifyOrRegisterDealer(lead);
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

