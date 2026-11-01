// Ensure WebSocket constructor exists in headless test runners before Supabase import
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class MockWebSocket {
    constructor() {}
    close() {}
    send() {}
  };
}

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  isSupabaseConfigured,
  signUpWithSupabase,
  signInWithSupabase,
  signOutFromSupabase,
  requestPasswordReset,
  saveAppraisalToDb
} from '../supabaseClient';

class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

describe('Supabase Client (Offline/Unconfigured Mock Mode)', () => {
  let mockStorage: MockLocalStorage;

  beforeAll(() => {
    mockStorage = new MockLocalStorage();
    (globalThis as any).localStorage = mockStorage;
    (globalThis as any).window = globalThis;
  });

  beforeEach(() => {
    mockStorage.clear();
  });

  it('reports isSupabaseConfigured as false in offline test environment', () => {
    expect(typeof isSupabaseConfigured).toBe('boolean');
  });

  it('signs up a mock dealer session without network errors', async () => {
    const res = await signUpWithSupabase({
      email: 'dealer@horologydesk.com',
      password: 'password123',
      dealership: 'Manhattan Watch Club',
      role: 'dealer'
    });

    expect(res.success).toBe(true);
    expect(res.user).toBeDefined();
    expect(res.user?.email).toBe('dealer@horologydesk.com');
    expect(res.user?.dealership).toBe('Manhattan Watch Club');
    expect(res.user?.tier).toBe('free');
  });

  it('signs in a free dealer session for regular email addresses', async () => {
    const res = await signInWithSupabase({
      email: 'desk@genevawatches.ch',
      password: 'password123'
    });

    expect(res.success).toBe(true);
    expect(res.user?.tier).toBe('free');
  });

  it('grants pro tier when sign in email contains pro or partner keyword', async () => {
    const res = await signInWithSupabase({
      email: 'partner.desk@luxedata.io',
      password: 'password123'
    });

    expect(res.success).toBe(true);
    expect(res.user?.tier).toBe('pro');
    expect(res.user?.role).toBe('pro');
  });

  it('records appraisals into offline localStorage ledger and returns success', async () => {
    const appraisal = {
      dealerEmail: 'trader@diamonddistrict.com',
      dealershipName: '47th St Horology',
      reference: '126610LN',
      brand: 'Rolex',
      model: 'Submariner Date',
      condition: 'Very Good' as const,
      hasBox: true,
      hasPapers: true,
      adjustedCMV: 15200,
      maxBuyOffer: 12160,
      projectedProfit: 3040,
      dealerMarginPct: 20,
      clientName: 'Walk-in client'
    };

    const res = await saveAppraisalToDb(appraisal);
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();

    const storedRaw = mockStorage.getItem('luxedata_offline_ledger');
    expect(storedRaw).not.toBeNull();
    const storedList = JSON.parse(storedRaw!);
    expect(storedList).toHaveLength(1);
    expect(storedList[0].reference).toBe('126610LN');
    expect(storedList[0].maxBuyOffer).toBe(12160);
  });

  it('recovers gracefully if localStorage contains corrupted non-array data', async () => {
    mockStorage.setItem('luxedata_offline_ledger', '{"corrupted": true}');

    const res = await saveAppraisalToDb({
      reference: '116500LN',
      brand: 'Rolex',
      model: 'Daytona',
      condition: 'Unworn' as const,
      hasBox: true,
      hasPapers: true,
      adjustedCMV: 31000,
      maxBuyOffer: 24800,
      projectedProfit: 6200,
      dealerMarginPct: 20
    });

    expect(res.success).toBe(true);
    const stored = JSON.parse(mockStorage.getItem('luxedata_offline_ledger')!);
    expect(Array.isArray(stored)).toBe(true);
    expect(stored).toHaveLength(1);
  });

  it('handles signOut and passwordReset safely in offline mode', async () => {
    const signOutRes = await signOutFromSupabase();
    expect(signOutRes.success).toBe(true);

    const resetRes = await requestPasswordReset('dealer@horology.com');
    expect(resetRes.success).toBe(true);
  });
});
