'use client'

import { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import { Objective, Module, NewObjective, NewModule } from '@/types'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  objectives: Objective[]
  modules: Module[]
  onAddObjective: (objective: NewObjective) => Promise<void>
  onUpdateObjective: (id: string, updates: Partial<Objective>) => Promise<void>
  onDeleteObjective: (id: string) => Promise<void>
  onAddModule: (module: NewModule) => Promise<void>
  onUpdateModule: (id: string, updates: Partial<Module>) => Promise<void>
  onDeleteModule: (id: string) => Promise<void>
  initialTab?: 'objectives' | 'modules'
  initialEditingModule?: Module
  initialEditingObjective?: Objective
}

type EditingItem = {
  type: 'objective' | 'module'
  id: string
  title: string
  color: string
  description?: string
} | null

const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1'
]

export function SettingsModal({
  isOpen,
  onClose,
  objectives,
  modules,
  onAddObjective,
  onUpdateObjective,
  onDeleteObjective,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  initialTab = 'objectives',
  initialEditingModule,
  initialEditingObjective
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'objectives' | 'modules'>(initialTab)
  const [editing, setEditing] = useState<EditingItem>(null)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemColor, setNewItemColor] = useState(DEFAULT_COLORS[0])
  const [newItemDescription, setNewItemDescription] = useState('')

  useEffect(() => {
    if (initialEditingModule) {
      setEditing({
        type: 'module',
        id: initialEditingModule.id,
        title: initialEditingModule.title,
        color: initialEditingModule.color,
        description: initialEditingModule.description || undefined
      })
      setActiveTab('modules')
    } else if (initialEditingObjective) {
      setEditing({
        type: 'objective',
        id: initialEditingObjective.id,
        title: initialEditingObjective.title,
        color: initialEditingObjective.color,
        description: undefined
      })
      setActiveTab('objectives')
    }
  }, [initialEditingModule, initialEditingObjective])

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return

    try {
      if (activeTab === 'objectives') {
        await onAddObjective({
          title: newItemTitle.trim(),
          color: newItemColor,
          order_index: objectives.length,
          roadmap_id: objectives[0]?.roadmap_id || ''
        })
      } else {
        await onAddModule({
          title: newItemTitle.trim(),
          color: newItemColor,
          description: newItemDescription.trim() || null,
          order_index: modules.length,
          roadmap_id: modules[0]?.roadmap_id || ''
        })
      }
      
      setNewItemTitle('')
      setNewItemDescription('')
      setNewItemColor(DEFAULT_COLORS[0])
    } catch (error) {
      console.error(`Failed to add ${activeTab.slice(0, -1)}:`, error)
    }
  }

  const handleEditItem = (item: Objective | Module) => {
    setEditing({
      type: activeTab.slice(0, -1) as 'objective' | 'module',
      id: item.id,
      title: item.title,
      color: item.color,
      description: 'description' in item ? item.description || '' : ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editing) return

    try {
      if (editing.type === 'objective') {
        await onUpdateObjective(editing.id, {
          title: editing.title,
          color: editing.color
        })
      } else {
        await onUpdateModule(editing.id, {
          title: editing.title,
          color: editing.color,
          description: editing.description || null
        })
      }
      setEditing(null)
    } catch (error) {
      console.error(`Failed to update ${editing.type}:`, error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}? Items assigned to it will become unassigned.`)) {
      return
    }

    try {
      if (activeTab === 'objectives') {
        await onDeleteObjective(id)
      } else {
        await onDeleteModule(id)
      }
    } catch (error) {
      console.error(`Failed to delete ${activeTab.slice(0, -1)}:`, error)
    }
  }

  const renderItems = (items: (Objective | Module)[]) => (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{item.title}</div>
            {'description' in item && item.description && (
              <div className="text-sm text-gray-600 truncate">{item.description}</div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditItem(item)}
              className="h-8 w-8 rounded-lg hover:bg-gray-200"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteItem(item.id)}
              className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Roadmap Settings"
      className="max-w-3xl"
    >
      <div className="p-6">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('objectives')}
            className={cn(
              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'objectives'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Objectives ({objectives.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={cn(
              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'modules'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Modules ({modules.length})
          </button>
        </div>

        {/* Add New Item */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-3">
            Add New {activeTab === 'objectives' ? 'Objective' : 'Module'}
          </h3>
          <div className="space-y-3">
            <Input
              placeholder={`${activeTab === 'objectives' ? 'Objective' : 'Module'} title`}
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            {activeTab === 'modules' && (
              <Input
                placeholder="Description (optional)"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
            )}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Color:</span>
              <div className="flex gap-2">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewItemColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 shadow-sm hover:scale-110 transition-transform",
                      color === newItemColor ? "border-gray-900" : "border-white"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddItem}
              disabled={!newItemTitle.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'objectives' ? 'Objective' : 'Module'}
            </Button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            Existing {activeTab === 'objectives' ? 'Objectives' : 'Modules'}
          </h3>
          {activeTab === 'objectives' ? (
            objectives.length > 0 ? (
              renderItems(objectives)
            ) : (
              <p className="text-gray-500 text-center py-8">No objectives yet</p>
            )
          ) : (
            modules.length > 0 ? (
              renderItems(modules)
            ) : (
              <p className="text-gray-500 text-center py-8">No modules yet</p>
            )
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="absolute inset-0 bg-white">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              Edit {editing.type === 'objective' ? 'Objective' : 'Module'}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            {editing.type === 'module' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
            )}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Color</span>
              <div className="flex gap-2">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditing({ ...editing, color })}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 shadow-sm hover:scale-110 transition-transform",
                      color === editing.color ? "border-gray-900" : "border-white"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}