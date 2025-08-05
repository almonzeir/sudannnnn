export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          phone: string | null
          date_of_birth: string | null
          gender: string | null
          role: 'patient' | 'pharmacist' | 'admin'
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          role?: 'patient' | 'pharmacist' | 'admin'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          role?: 'patient' | 'pharmacist' | 'admin'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      pharmacists: {
        Row: {
          id: string
          user_id: string | null
          license_number: string
          pharmacy_name: string | null
          pharmacy_address: string | null
          years_of_experience: number | null
          specialization: string | null
          status: 'pending' | 'approved' | 'rejected'
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          license_number: string
          pharmacy_name?: string | null
          pharmacy_address?: string | null
          years_of_experience?: number | null
          specialization?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          license_number?: string
          pharmacy_name?: string | null
          pharmacy_address?: string | null
          years_of_experience?: number | null
          specialization?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          name: string
          generic_name: string | null
          brand_names: string[] | null
          description: string | null
          dosage_forms: string[] | null
          strength: string | null
          route_of_administration: string | null
          therapeutic_class: string | null
          indications: string[] | null
          contraindications: string[] | null
          side_effects: string[] | null
          interactions: string[] | null
          pregnancy_category: string | null
          storage_conditions: string | null
          manufacturer: string | null
          price_range: string | null
          availability_status: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          generic_name?: string | null
          brand_names?: string[] | null
          description?: string | null
          dosage_forms?: string[] | null
          strength?: string | null
          route_of_administration?: string | null
          therapeutic_class?: string | null
          indications?: string[] | null
          contraindications?: string[] | null
          side_effects?: string[] | null
          interactions?: string[] | null
          pregnancy_category?: string | null
          storage_conditions?: string | null
          manufacturer?: string | null
          price_range?: string | null
          availability_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          generic_name?: string | null
          brand_names?: string[] | null
          description?: string | null
          dosage_forms?: string[] | null
          strength?: string | null
          route_of_administration?: string | null
          therapeutic_class?: string | null
          indications?: string[] | null
          contraindications?: string[] | null
          side_effects?: string[] | null
          interactions?: string[] | null
          pregnancy_category?: string | null
          storage_conditions?: string | null
          manufacturer?: string | null
          price_range?: string | null
          availability_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          status: 'active' | 'archived' | 'deleted'
          metadata: Json
          created_at: string
          updated_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          status?: 'active' | 'archived' | 'deleted'
          metadata?: Json
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          status?: 'active' | 'archived' | 'deleted'
          metadata?: Json
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          content: string
          message_type: 'user' | 'assistant' | 'system'
          status: 'sent' | 'delivered' | 'read' | 'failed'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          content: string
          message_type: 'user' | 'assistant' | 'system'
          status?: 'sent' | 'delivered' | 'read' | 'failed'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string | null
          content?: string
          message_type?: 'user' | 'assistant' | 'system'
          status?: 'sent' | 'delivered' | 'read' | 'failed'
          metadata?: Json
          created_at?: string
          updated_at?: string
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
      user_role: 'patient' | 'pharmacist' | 'admin'
      pharmacist_status: 'pending' | 'approved' | 'rejected'
      question_status: 'open' | 'answered' | 'closed'
      message_type: 'user' | 'assistant' | 'system'
      message_status: 'sent' | 'delivered' | 'read' | 'failed'
      conversation_status: 'active' | 'archived' | 'deleted'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
