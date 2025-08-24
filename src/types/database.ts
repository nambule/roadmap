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
      roadmaps: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          is_public: boolean
          share_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          is_public?: boolean
          share_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          share_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      objectives: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          color: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          color?: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          color?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          color: string
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          color?: string
          description?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          color?: string
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_items: {
        Row: {
          id: string
          roadmap_id: string
          objective_id: string | null
          module_id: string | null
          title: string
          description: string | null
          category: 'tech' | 'business' | 'mixed'
          tags: string[]
          status: 'now' | 'next' | 'later'
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          objective_id?: string | null
          module_id?: string | null
          title: string
          description?: string | null
          category?: 'tech' | 'business' | 'mixed'
          tags?: string[]
          status: 'now' | 'next' | 'later'
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          objective_id?: string | null
          module_id?: string | null
          title?: string
          description?: string | null
          category?: 'tech' | 'business' | 'mixed'
          tags?: string[]
          status?: 'now' | 'next' | 'later'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          roadmap_item_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roadmap_item_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roadmap_item_id?: string
          user_id?: string
          content?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}