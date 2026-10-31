import { createClient } from '@supabase/supabase-js';
import { UserSession } from '../types/watch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://extdvvsqcpwekmbaslct.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KznAuLW0d_1mi7YtDxd3GQ_PRZCkLgl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Real Supabase Email & Password Sign Up
 */
export async function signUpWithSupabase(params: {
  email: string;
  password: string;
  dealership: string;
  role: 'dealer' | 'collector';
}): Promise<{
  success: boolean;
  user?: UserSession;
  requiresEmailConfirmation?: boolean;
  error?: string;
}> {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanDealership = params.dealership.trim() || 'Independent Horology Desk';

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          dealership_name: cleanDealership,
          role: params.role,
          tier: 'free'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Record lead into dealer_leads table for admin CRM tracking
    try {
      await supabase.from('dealer_leads').upsert([
        {
          email: cleanEmail,
          dealership_name: cleanDealership,
          role: params.role,
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'email' });
    } catch (dbErr) {
      console.warn('Dealer lead upsert notice:', dbErr);
    }

    // Check if session was returned immediately (auto-confirmed)
    if (data.session && data.user) {
      const sessionUser: UserSession = {
        id: data.user.id,
        name: cleanDealership,
        email: cleanEmail,
        dealership: cleanDealership,
        role: params.role,
        tier: 'free'
      };
      return {
        success: true,
        user: sessionUser,
        requiresEmailConfirmation: false
      };
    }

    // User created, confirmation email required by Supabase settings
    return {
      success: true,
      requiresEmailConfirmation: true
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to initialize account' };
  }
}

/**
 * Real Supabase Email & Password Sign In
 */
export async function signInWithSupabase(params: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  user?: UserSession;
  error?: string;
}> {
  try {
    const cleanEmail = params.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: params.password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'User record not found.' };
    }

    // Check if this dealer has pro status in dealer_leads table or metadata
    let isPro = false;
    let dealershipName = data.user.user_metadata?.dealership_name || 'Independent Desk';
    let role: UserSession['role'] = (data.user.user_metadata?.role as any) || 'dealer';

    try {
      const { data: leadRecord } = await supabase
        .from('dealer_leads')
        .select('role, dealership_name')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (leadRecord) {
        if (leadRecord.dealership_name) dealershipName = leadRecord.dealership_name;
        if (['pro', 'partner', 'admin', 'vip'].includes(leadRecord.role?.toLowerCase())) {
          isPro = true;
          role = 'pro';
        }
      }
    } catch (e) {
      // ignore
    }

    if (data.user.user_metadata?.tier === 'pro') {
      isPro = true;
      role = 'pro';
    }

    const sessionUser: UserSession = {
      id: data.user.id,
      name: dealershipName,
      email: cleanEmail,
      dealership: dealershipName,
      role: role,
      tier: isPro ? 'pro' : 'free'
    };

    return { success: true, user: sessionUser };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Authentication failed' };
  }
}

/**
 * Real Supabase Sign Out
 */
export async function signOutFromSupabase(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase signOut warning:', error.message);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Password Reset via Supabase
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Retrieve Active User Session from Supabase on App Mount
 */
export async function getActiveUserSession(): Promise<UserSession | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const cleanEmail = session.user.email?.toLowerCase() || '';
    let isPro = session.user.user_metadata?.tier === 'pro';
    let dealershipName = session.user.user_metadata?.dealership_name || 'Independent Desk';
    let role: UserSession['role'] = (session.user.user_metadata?.role as any) || 'dealer';

    try {
      const { data: leadRecord } = await supabase
        .from('dealer_leads')
        .select('role, dealership_name')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (leadRecord) {
        if (leadRecord.dealership_name) dealershipName = leadRecord.dealership_name;
        if (['pro', 'partner', 'admin', 'vip'].includes(leadRecord.role?.toLowerCase())) {
          isPro = true;
          role = 'pro';
        }
      }
    } catch (e) {
      // ignore
    }

    return {
      id: session.user.id,
      name: dealershipName,
      email: cleanEmail,
      dealership: dealershipName,
      role: role,
      tier: isPro ? 'pro' : 'free'
    };
  } catch (err) {
    console.warn('Failed to recover active Supabase session:', err);
    return null;
  }
}

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

