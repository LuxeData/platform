import { createClient } from '@supabase/supabase-js';
import { UserSession } from '../types/watch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  if (typeof window !== 'undefined' || (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test')) {
    console.warn(
      '[LuxeData Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is omitted. ' +
      'Terminal is operating in mock/local fallback mode without transmitting credentials.'
    );
  }
}

// Client instance: real if env vars provided, dummy placeholder if unconfigured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://mock-unconfigured-project.supabase.co', 'mock-anon-key');

/**
 * Real Supabase Email & Password Sign Up (with graceful local fallback)
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

    if (!isSupabaseConfigured) {
      const mockUser: UserSession = {
        id: `mock-dealer-${Date.now()}`,
        name: cleanDealership,
        email: cleanEmail,
        dealership: cleanDealership,
        role: params.role,
        tier: 'free'
      };
      return {
        success: true,
        user: mockUser,
        requiresEmailConfirmation: false
      };
    }

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
 * Real Supabase Email & Password Sign In (with graceful local fallback)
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

    if (!isSupabaseConfigured) {
      const isPro = cleanEmail.includes('pro') || cleanEmail.includes('partner');
      const sessionUser: UserSession = {
        id: 'mock-auth-user',
        name: 'Geneva Partner Desk',
        email: cleanEmail,
        dealership: 'Geneva Partner Desk',
        role: isPro ? 'pro' : 'dealer',
        tier: isPro ? 'pro' : 'free'
      };
      return { success: true, user: sessionUser };
    }

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
    if (!isSupabaseConfigured) {
      return { success: true };
    }
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
    if (!isSupabaseConfigured) {
      return { success: true };
    }
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
    if (!isSupabaseConfigured) {
      return null;
    }
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
 * Saves a dealer cash appraisal slip into Supabase (with fallback ledger simulation)
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
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('luxedata_offline_ledger') || '[]';
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : [];
          list.push({ ...appraisal, saved_at: new Date().toISOString() });
          localStorage.setItem('luxedata_offline_ledger', JSON.stringify(list));
        } catch (storageErr) {
          // ignore storage error
        }
      }
      return { success: true, data: [{ id: `offline-${Date.now()}` }] };
    }

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
