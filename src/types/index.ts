import { Database } from './database'

export type Roadmap = Database['public']['Tables']['roadmaps']['Row']
export type Objective = Database['public']['Tables']['objectives']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type RoadmapItem = Database['public']['Tables']['roadmap_items']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']

export type NewRoadmap = Database['public']['Tables']['roadmaps']['Insert']
export type NewObjective = Database['public']['Tables']['objectives']['Insert']
export type NewModule = Database['public']['Tables']['modules']['Insert']
export type NewRoadmapItem = Database['public']['Tables']['roadmap_items']['Insert']
export type NewComment = Database['public']['Tables']['comments']['Insert']

export type UpdateRoadmap = Database['public']['Tables']['roadmaps']['Update']
export type UpdateObjective = Database['public']['Tables']['objectives']['Update']
export type UpdateModule = Database['public']['Tables']['modules']['Update']
export type UpdateRoadmapItem = Database['public']['Tables']['roadmap_items']['Update']
export type UpdateComment = Database['public']['Tables']['comments']['Update']

export type RoadmapStatus = 'now' | 'next' | 'later'
export type ItemCategory = 'tech' | 'business' | 'mixed'
export type ViewMode = 'read-only' | 'edit'
export type DetailLevel = 'compact' | 'standard' | 'rich'
export type ViewType = 'objective' | 'module'

export interface RoadmapWithData extends Roadmap {
  objectives: (Objective & {
    items: RoadmapItem[]
  })[]
  modules: Module[]
}