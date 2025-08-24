'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { RoadmapWithData, ViewMode, DetailLevel, ViewType, RoadmapItem as RoadmapItemType, Objective, Module, NewObjective, NewModule } from '@/types'
import { AuthGuard } from '@/components/AuthGuard'
import { RoadmapBoard } from '@/components/RoadmapBoard'
import toast from 'react-hot-toast'

export default function RoadmapPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const roadmapId = params.id as string

  const [roadmap, setRoadmap] = useState<RoadmapWithData | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('full')
  const [viewType, setViewType] = useState<ViewType>('objective')

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmap()
    }
  }, [roadmapId, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRoadmap = async () => {
    try {
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', roadmapId)
        .single()

      if (roadmapError) throw roadmapError

      const { data: objectivesData, error: objectivesError } = await supabase
        .from('objectives')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_index')

      if (objectivesError) throw objectivesError

      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_index')

      if (modulesError) throw modulesError

      const { data: itemsData, error: itemsError } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_index')

      if (itemsError) throw itemsError

      const roadmapWithData: RoadmapWithData = {
        ...roadmapData,
        objectives: (objectivesData || []).map(objective => ({
          ...objective,
          items: (itemsData || []).filter(item => item.objective_id === objective.id)
        })),
        modules: modulesData || []
      }

      setRoadmap(roadmapWithData)
    } catch (error) {
      toast.error('Failed to fetch roadmap')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddObjective = async (objective: NewObjective) => {
    if (!user || !roadmap) return

    try {
      const { data, error } = await supabase
        .from('objectives')
        .insert({
          ...objective,
          roadmap_id: roadmap.id
        })
        .select()
        .single()

      if (error) throw error

      const newObjective = { ...data, items: [] }
      setRoadmap(prev => prev ? {
        ...prev,
        objectives: [...prev.objectives, newObjective]
      } : null)

      toast.success('Objective added')
    } catch (error) {
      toast.error('Failed to add objective')
      console.error(error)
    }
  }

  const handleUpdateObjective = async (id: string, updates: Partial<Objective>) => {
    try {
      const { error } = await supabase
        .from('objectives')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        objectives: prev.objectives.map(obj => 
          obj.id === id ? { ...obj, ...updates } : obj
        )
      } : null)

      toast.success('Objective updated')
    } catch (error) {
      toast.error('Failed to update objective')
      console.error(error)
    }
  }

  const handleDeleteObjective = async (id: string) => {
    try {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        objectives: prev.objectives.filter(obj => obj.id !== id)
      } : null)

      toast.success('Objective deleted')
    } catch (error) {
      toast.error('Failed to delete objective')
      console.error(error)
    }
  }

  const handleAddModule = async (module: NewModule) => {
    if (!user || !roadmap) return

    try {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          ...module,
          roadmap_id: roadmap.id
        })
        .select()
        .single()

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        modules: [...prev.modules, data]
      } : null)

      toast.success('Module added')
    } catch (error) {
      toast.error('Failed to add module')
      console.error(error)
    }
  }

  const handleUpdateModule = async (id: string, updates: Partial<Module>) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        modules: prev.modules.map(mod => 
          mod.id === id ? { ...mod, ...updates } : mod
        )
      } : null)

      toast.success('Module updated')
    } catch (error) {
      toast.error('Failed to update module')
      console.error(error)
    }
  }

  const handleDeleteModule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        modules: prev.modules.filter(mod => mod.id !== id)
      } : null)

      toast.success('Module deleted')
    } catch (error) {
      toast.error('Failed to delete module')
      console.error(error)
    }
  }

  const handleSaveItem = async (item: RoadmapItemType | null, updates: Partial<RoadmapItemType>) => {
    if (!user || !roadmap) return

    try {
      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('roadmap_items')
          .update(updates)
          .eq('id', item.id)

        if (error) throw error

        setRoadmap(prev => prev ? {
          ...prev,
          objectives: prev.objectives.map(obj => ({
            ...obj,
            items: obj.items.map(i => 
              i.id === item.id ? { ...i, ...updates } : i
            )
          }))
        } : null)

        toast.success('Item updated')
      } else {
        // Create new item
        const { data, error } = await supabase
          .from('roadmap_items')
          .insert({
            roadmap_id: roadmap.id,
            order_index: 0,
            ...updates
          })
          .select()
          .single()

        if (error) throw error

        // Add to appropriate objective's items list or just refetch to be safe
        await fetchRoadmap()
        toast.success('Item created')
      }
    } catch (error) {
      toast.error(item ? 'Failed to update item' : 'Failed to create item')
      console.error(error)
    }
  }

  const handleCreateObjective = async (title: string): Promise<Objective> => {
    if (!user || !roadmap) throw new Error('Not authorized')

    const { data, error } = await supabase
      .from('objectives')
      .insert({
        roadmap_id: roadmap.id,
        title,
        order_index: roadmap.objectives.length
      })
      .select()
      .single()

    if (error) throw error

    const newObjective = { ...data, items: [] }
    setRoadmap(prev => prev ? {
      ...prev,
      objectives: [...prev.objectives, newObjective]
    } : null)

    return data
  }

  const handleDeleteItem = async (item: RoadmapItemType) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      setRoadmap(prev => prev ? {
        ...prev,
        objectives: prev.objectives.map(obj => ({
          ...obj,
          items: obj.items.filter(i => i.id !== item.id)
        }))
      } : null)

      toast.success('Item deleted')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const handleShare = () => {
    toast.success('Share functionality will be implemented')
  }

  const handleExport = () => {
    toast.success('Export functionality will be implemented')
  }

  const handleComment = (item: RoadmapItemType) => {
    toast.success('Comment functionality will be implemented')
  }

  const handleUpdateRoadmap = async (updates: Partial<RoadmapWithData>) => {
    if (!user || !roadmap) return

    try {
      const { error } = await supabase
        .from('roadmaps')
        .update(updates)
        .eq('id', roadmap.id)

      if (error) throw error

      setRoadmap(prev => prev ? { ...prev, ...updates } : null)
      toast.success('Roadmap updated')
    } catch (error) {
      toast.error('Failed to update roadmap')
      console.error(error)
    }
  }

  const handleDeleteRoadmap = async () => {
    if (!user || !roadmap) return

    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmap.id)

      if (error) throw error

      toast.success('Roadmap deleted')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete roadmap')
      console.error(error)
    }
  }

  const handleNavigateHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Roadmap not found</h1>
          <p className="text-gray-600">The roadmap you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard fallback={
      <RoadmapBoard
        roadmap={roadmap}
        detailLevel={detailLevel}
        viewType={viewType}
        onDetailLevelChange={setDetailLevel}
        onViewTypeChange={setViewType}
        onShare={handleShare}
        onExport={handleExport}
        onNavigateHome={handleNavigateHome}
      />
    }>
      <RoadmapBoard
        roadmap={roadmap}
        detailLevel={detailLevel}
        viewType={viewType}
        onDetailLevelChange={setDetailLevel}
        onViewTypeChange={setViewType}
        onShare={handleShare}
        onExport={handleExport}
        onAddObjective={handleAddObjective}
        onUpdateObjective={handleUpdateObjective}
        onDeleteObjective={handleDeleteObjective}
        onAddModule={handleAddModule}
        onUpdateModule={handleUpdateModule}
        onDeleteModule={handleDeleteModule}
        onSaveItem={handleSaveItem}
        onCreateObjective={handleCreateObjective}
        onDeleteItem={handleDeleteItem}
        onCommentItem={handleComment}
        onUpdateRoadmap={handleUpdateRoadmap}
        onDeleteRoadmap={handleDeleteRoadmap}
        onNavigateHome={handleNavigateHome}
      />
    </AuthGuard>
  )
}