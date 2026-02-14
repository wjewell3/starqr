export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: 'coffee' | 'ice_cream' | 'bagel' | 'other' | null
          reward_text: string
          stamps_needed: number
          plan_tier: 'free' | 'paid'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: 'trialing' | 'active' | 'paused' | 'canceled' | 'free'
          trial_ends_at: string | null
          subscription_current_period_end: string | null
          apple_pass_type_id: string | null
          google_issuer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type?: 'coffee' | 'ice_cream' | 'bagel' | 'other' | null
          reward_text?: string
          stamps_needed?: number
          plan_tier?: 'free' | 'paid'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'trialing' | 'active' | 'paused' | 'canceled' | 'free'
          trial_ends_at?: string | null
          subscription_current_period_end?: string | null
          apple_pass_type_id?: string | null
          google_issuer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: 'coffee' | 'ice_cream' | 'bagel' | 'other' | null
          reward_text?: string
          stamps_needed?: number
          plan_tier?: 'free' | 'paid'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'trialing' | 'active' | 'paused' | 'canceled' | 'free'
          trial_ends_at?: string | null
          subscription_current_period_end?: string | null
          apple_pass_type_id?: string | null
          google_issuer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          merchant_id: string
          phone_hash: string
          phone_last_4: string
          stamps_current: number
          stamps_lifetime: number
          visits_total: number
          first_visit_at: string
          last_visit_at: string | null
          apple_pass_serial: string | null
          google_pass_id: string | null
          wallet_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          phone_hash: string
          phone_last_4: string
          stamps_current?: number
          stamps_lifetime?: number
          visits_total?: number
          first_visit_at?: string
          last_visit_at?: string | null
          apple_pass_serial?: string | null
          google_pass_id?: string | null
          wallet_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          phone_hash?: string
          phone_last_4?: string
          stamps_current?: number
          stamps_lifetime?: number
          visits_total?: number
          first_visit_at?: string
          last_visit_at?: string | null
          apple_pass_serial?: string | null
          google_pass_id?: string | null
          wallet_enabled?: boolean
          created_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          merchant_id: string
          customer_id: string
          stamps_added: number
          created_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          customer_id: string
          stamps_added?: number
          created_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          customer_id?: string
          stamps_added?: number
          created_at?: string
        }
      }
      rewards_redeemed: {
        Row: {
          id: string
          merchant_id: string
          customer_id: string
          stamps_used: number
          redeemed_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          customer_id: string
          stamps_used?: number
          redeemed_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          customer_id?: string
          stamps_used?: number
          redeemed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
