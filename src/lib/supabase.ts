import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'penanggung_jawab' | 'pekerja'
          avatar_url: string | null
          phone: string | null
          department: string | null
          position: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'penanggung_jawab' | 'pekerja'
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
          position?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'penanggung_jawab' | 'pekerja'
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
          position?: string | null
          updated_at?: string
        }
      }
      work_reports: {
        Row: {
          id: string
          code: string
          title: string
          description: string
          category: 'perawatan' | 'pembangunan' | 'upgrading' | 'perbaikan'
          start_date: string
          end_date: string
          status: 'planning' | 'ongoing' | 'completed' | 'delayed'
          progress: number
          worker_count: number
          responsible_persons: string[]
          location_name: string
          location_latitude: number | null
          location_longitude: number | null
          risk_level: 'low' | 'medium' | 'high'
          weather_condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
          safety_incidents: number
          photos: string[]
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description: string
          category: 'perawatan' | 'pembangunan' | 'upgrading' | 'perbaikan'
          start_date: string
          end_date: string
          status?: 'planning' | 'ongoing' | 'completed' | 'delayed'
          progress?: number
          worker_count: number
          responsible_persons: string[]
          location_name: string
          location_latitude?: number | null
          location_longitude?: number | null
          risk_level: 'low' | 'medium' | 'high'
          weather_condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
          safety_incidents?: number
          photos?: string[]
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string
          category?: 'perawatan' | 'pembangunan' | 'upgrading' | 'perbaikan'
          start_date?: string
          end_date?: string
          status?: 'planning' | 'ongoing' | 'completed' | 'delayed'
          progress?: number
          worker_count?: number
          responsible_persons?: string[]
          location_name?: string
          location_latitude?: number | null
          location_longitude?: number | null
          risk_level?: 'low' | 'medium' | 'high'
          weather_condition?: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
          safety_incidents?: number
          photos?: string[]
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          data: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          data?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          data?: any | null
        }
      }
    }
  }
}