'use client'

import { useState, useEffect, useCallback } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Plus, Trash2 } from 'lucide-react'
import { RoadmapItem, Objective, Module, Team, RoadmapStatus, ItemCategory } from '@/types'
import { cn } from '@/lib/utils'

interface ItemEditModalProps {
  isOpen: boolean
  onClose: () => void
  item: RoadmapItem | null
  objectives: Objective[]
  modules: Module[]
  teams: Team[]
  onSave: (updates: Partial<RoadmapItem>) => Promise<void>
  onDelete?: (item: RoadmapItem) => Promise<void>
  onCreateObjective?: (title: string) => Promise<Objective>
  defaultObjectiveId?: string | null
  defaultModuleId?: string | null
  defaultTeamId?: string | null
  defaultStatus?: RoadmapStatus
}

const STATUS_OPTIONS: { value: RoadmapStatus; label: string; color: string }[] = [
  { value: 'now', label: 'Now', color: 'from-red-500 to-pink-500' },
  { value: 'next', label: 'Next', color: 'from-yellow-400 to-orange-500' },
  { value: 'later', label: 'Later', color: 'from-green-400 to-emerald-500' }
]

const CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: 'tech', label: 'Technical' },
  { value: 'business', label: 'Business' },
  { value: 'mixed', label: 'Mixed' }
]

export function ItemEditModal({
  isOpen,
  onClose,
  item,
  objectives,
  modules,
  teams,
  onSave,
  onDelete,
  onCreateObjective,
  defaultObjectiveId,
  defaultModuleId,
  defaultTeamId,
  defaultStatus
}: ItemEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'now' as RoadmapStatus,
    category: 'business' as ItemCategory,
    objective_id: null as string | null,
    module_id: null as string | null,
    team_id: null as string | null,
    tags: [] as string[]
  })
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('')
  const [isCreatingObjective, setIsCreatingObjective] = useState(false)

  const handleSaveAndClose = useCallback(async () => {
    if (!formData.title.trim()) return
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }, [formData, onSave, onClose])

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        status: item.status,
        category: item.category,
        objective_id: item.objective_id,
        module_id: item.module_id,
        team_id: item.team_id,
        tags: item.tags || []
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus || 'now',
        category: 'business',
        objective_id: defaultObjectiveId || null,
        module_id: defaultModuleId || null,
        team_id: defaultTeamId || null,
        tags: []
      })
    }
  }, [item, defaultObjectiveId, defaultModuleId, defaultTeamId, defaultStatus])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement
        // Don't trigger on multiline textarea or when Ctrl/Cmd+Enter
        if (target.tagName === 'TEXTAREA' || (e.ctrlKey || e.metaKey)) {
          return
        }
        // If we're in a regular input and it's not the title input, return
        if (target.tagName === 'INPUT' && target !== document.activeElement) {
          return
        }
        
        e.preventDefault()
        handleSaveAndClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleSaveAndClose])

  const handleSave = async () => {
    if (!formData.title.trim()) return

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  const handleCreateObjective = async () => {
    if (!newObjectiveTitle.trim() || !onCreateObjective) return

    setIsCreatingObjective(true)
    try {
      const objective = await onCreateObjective(newObjectiveTitle.trim())
      setFormData({ ...formData, objective_id: objective.id })
      setNewObjectiveTitle('')
    } catch (error) {
      console.error('Failed to create objective:', error)
    } finally {
      setIsCreatingObjective(false)
    }
  }

  const handleDelete = async () => {
    if (!item || !onDelete) return
    
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await onDelete(item)
        onClose()
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Create Item'}
      className="max-w-2xl"
    >
      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter item title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter item description"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => setFormData({ ...formData, status: status.value })}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all",
                  formData.status === status.value
                    ? `bg-gradient-to-r ${status.color} text-white border-transparent shadow-md`
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.value}
                onClick={() => setFormData({ ...formData, category: category.value })}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg border font-medium transition-colors",
                  formData.category === category.value
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module
          </label>
          <select
            value={formData.module_id || ''}
            onChange={(e) => setFormData({ ...formData, module_id: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No module assigned</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
          {modules.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No modules available. Create modules in Settings to assign items to them.
            </p>
          )}
        </div>

        {/* Team Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team
          </label>
          <select
            value={formData.team_id || ''}
            onChange={(e) => setFormData({ ...formData, team_id: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No team assigned</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.title}
              </option>
            ))}
          </select>
          {teams.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No teams available. Create teams in Settings to assign items to them.
            </p>
          )}
        </div>

        {/* Objective Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objective
          </label>
          <div className="space-y-2">
            <select
              value={formData.objective_id || ''}
              onChange={(e) => setFormData({ ...formData, objective_id: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No objective assigned</option>
              {objectives.map((objective) => (
                <option key={objective.id} value={objective.id}>
                  {objective.title}
                </option>
              ))}
            </select>
            
            {/* Create new objective */}
            {onCreateObjective && (
              <div className="flex gap-2">
                <Input
                  value={newObjectiveTitle}
                  onChange={(e) => setNewObjectiveTitle(e.target.value)}
                  placeholder="Or create new objective"
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateObjective}
                  disabled={!newObjectiveTitle.trim() || isCreatingObjective}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <Input
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            placeholder="Enter tags separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tags help categorize and search for items
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button onClick={handleSaveAndClose} disabled={!formData.title.trim()} className="flex-1">
            {item ? 'Save Changes' : 'Create Item'}
          </Button>
          {item && onDelete && (
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}