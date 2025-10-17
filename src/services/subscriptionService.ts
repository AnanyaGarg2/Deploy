import { supabase } from './supabase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  tokens_included: number;
  features: {
    max_uploads_per_month: number;
    max_file_size_mb: number;
    priority_support: boolean;
    advanced_voices?: boolean;
    custom_voices?: boolean;
  };
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  plan?: SubscriptionPlan;
}

export interface UserTokens {
  id: string;
  user_id: string;
  total_tokens: number;
  used_tokens: number;
  remaining_tokens: number;
  last_reset_date: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  track_id?: string;
  tokens_used: number;
  transaction_type: 'generation' | 'refund' | 'bonus' | 'reset';
  word_count: number;
  estimated_cost: number;
  created_at: string;
}

export class SubscriptionService {
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getUserTokens(userId: string): Promise<UserTokens | null> {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data;
  }

  static async createSubscription(
    userId: string,
    planId: string,
    stripeSubscriptionId?: string
  ): Promise<UserSubscription> {
    // First, get the plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Create subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: stripeSubscriptionId,
        status: 'active'
      })
      .select()
      .single();

    if (subError) throw subError;

    // Create or update user tokens
    const { error: tokenError } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: userId,
        total_tokens: plan.tokens_included,
        used_tokens: 0,
        remaining_tokens: plan.tokens_included,
        last_reset_date: new Date().toISOString()
      });

    if (tokenError) throw tokenError;

    return subscription;
  }

  static async checkTokensAvailable(userId: string, tokensNeeded: number): Promise<boolean> {
    const tokens = await this.getUserTokens(userId);
    return tokens ? tokens.remaining_tokens >= tokensNeeded : false;
  }

  static async useTokens(
    userId: string,
    trackId: string,
    tokensNeeded: number,
    wordCount: number
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc('use_tokens', {
      p_user_id: userId,
      p_track_id: trackId,
      p_tokens_needed: tokensNeeded,
      p_word_count: wordCount
    });

    if (error) throw error;
    return data;
  }

  static async getTokenTransactions(userId: string): Promise<TokenTransaction[]> {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  static calculateTokensNeeded(wordCount: number): number {
    // ElevenLabs pricing: approximately 1 token per word
    return Math.ceil(wordCount);
  }

  static async resetMonthlyTokens(): Promise<void> {
    const { error } = await supabase.rpc('reset_monthly_tokens');
    if (error) throw error;
  }
}