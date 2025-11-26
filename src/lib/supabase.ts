import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for server-side usage (admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Database = {
  public: {
    Tables: {
      investments: {
        Row: {
          id: string
          user_id: string
          currency: string
          currency_name: string
          amount: number
          buy_price: number
          buy_date: string
          current_value: number
          profit: number
          profit_percent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          currency: string
          currency_name: string
          amount: number
          buy_price: number
          buy_date: string
          current_value?: number
          profit?: number
          profit_percent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          currency?: string
          currency_name?: string
          amount?: number
          buy_price?: number
          buy_date?: string
          current_value?: number
          profit?: number
          profit_percent?: number
          updated_at?: string
        }
      }
    }
  }
}