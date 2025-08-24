'use client'

import { useState } from 'react'
import { RoadmapWithData, ViewMode, DetailLevel, ViewType, RoadmapItem as RoadmapItemType, Objective, Module, RoadmapStatus, NewObjective, NewModule } from '@/types'
import { RoadmapItem } from './RoadmapItem'
import { SettingsModal } from './SettingsModal'
import { ItemEditModal } from './ItemEditModal'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { 
  Settings, 
  Share2, 
  Download, 
  Plus, 
  Edit3,
  Grid3X3,
  List,
  Maximize,
  Minimize,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoadmapBoardProps {
  roadmap: RoadmapWithData
  detailLevel?: DetailLevel
  viewType?: ViewType
  onDetailLevelChange?: (level: DetailLevel) => void
  onViewTypeChange?: (type: ViewType) => void
  onShare?: () => void
  onExport?: () => void
  onAddObjective?: (objective: NewObjective) => Promise<void>
  onUpdateObjective?: (id: string, updates: Partial<Objective>) => Promise<void>
  onDeleteObjective?: (id: string) => Promise<void>
  onAddModule?: (module: NewModule) => Promise<void>
  onUpdateModule?: (id: string, updates: Partial<Module>) => Promise<void>
  onDeleteModule?: (id: string) => Promise<void>
  onSaveItem?: (item: RoadmapItemType | null, updates: Partial<RoadmapItemType>) => Promise<void>
  onCreateObjective?: (title: string) => Promise<Objective>
  onDeleteItem?: (item: RoadmapItemType) => void
  onCommentItem?: (item: RoadmapItemType) => void
  onUpdateRoadmap?: (updates: Partial<RoadmapWithData>) => Promise<void>
  onDeleteRoadmap?: () => Promise<void>
  onNavigateHome?: () => void
}

const statusColumns: { key: RoadmapStatus; title: string; gradient: string; textColor: string }[] = [
  { 
    key: 'now', 
    title: 'Now', 
    gradient: 'from-red-500 to-pink-500', 
    textColor: 'text-red-700' 
  },
  { 
    key: 'next', 
    title: 'Next', 
    gradient: 'from-yellow-400 to-orange-500', 
    textColor: 'text-yellow-700' 
  },
  { 
    key: 'later', 
    title: 'Later', 
    gradient: 'from-green-400 to-emerald-500', 
    textColor: 'text-green-700' 
  },
]

export function RoadmapBoard({
  roadmap,
  detailLevel = 'full',
  viewType = 'objective',
  onDetailLevelChange,
  onViewTypeChange,
  onShare,
  onExport,
  onAddObjective,
  onUpdateObjective,
  onDeleteObjective,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onSaveItem,
  onCreateObjective,
  onDeleteItem,
  onCommentItem,
  onUpdateRoadmap,
  onDeleteRoadmap,
  onNavigateHome,
}: RoadmapBoardProps) {
  const [showControls, setShowControls] = useState(true)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [editingItem, setEditingItem] = useState<RoadmapItemType | null>(null)
  const [isCreatingItem, setIsCreatingItem] = useState(false)
  const [editingRoadmapTitle, setEditingRoadmapTitle] = useState(false)
  const [roadmapTitle, setRoadmapTitle] = useState(roadmap.title)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null)
  
  const canEdit = true // Always in edit mode now

  const getItemsForObjectiveAndStatus = (objectiveId: string, status: RoadmapStatus) => {
    const objective = roadmap.objectives.find(obj => obj.id === objectiveId)
    if (!objective) return []
    return objective.items.filter(item => item.status === status)
      .sort((a, b) => a.order_index - b.order_index)
  }

  const getItemsForModuleAndStatus = (moduleId: string | null, status: RoadmapStatus) => {
    const allItems = roadmap.objectives.flatMap(obj => obj.items)
    return allItems.filter(item => item.module_id === moduleId && item.status === status)
      .sort((a, b) => a.order_index - b.order_index)
  }

  const getModulesWithItems = () => {
    const modulesWithItems = [...roadmap.modules].sort((a, b) => a.order_index - b.order_index)
    
    // Check if there are items without module assignments
    const allItems = roadmap.objectives.flatMap(obj => obj.items)
    const unassignedItems = allItems.filter(item => !item.module_id)
    
    if (unassignedItems.length > 0) {
      modulesWithItems.push({
        id: 'unassigned',
        title: 'Unassigned',
        color: '#94a3b8',
        description: 'Items not assigned to any module',
        order_index: 999,
        roadmap_id: roadmap.id,
        created_at: '',
        updated_at: ''
      } as Module)
    }
    
    return modulesWithItems
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between py-4 lg:py-6 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateHome}
                  className="rounded-xl hover:bg-white/60 p-2"
                >
                  <Home className="h-4 w-4" />
                </Button>
                {editingRoadmapTitle ? (
                  <input
                    type="text"
                    value={roadmapTitle}
                    onChange={(e) => setRoadmapTitle(e.target.value)}
                    onBlur={() => {
                      setEditingRoadmapTitle(false)
                      if (roadmapTitle !== roadmap.title && onUpdateRoadmap) {
                        onUpdateRoadmap({ title: roadmapTitle })
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingRoadmapTitle(false)
                        if (roadmapTitle !== roadmap.title && onUpdateRoadmap) {
                          onUpdateRoadmap({ title: roadmapTitle })
                        }
                      }
                      if (e.key === 'Escape') {
                        setRoadmapTitle(roadmap.title)
                        setEditingRoadmapTitle(false)
                      }
                    }}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent bg-transparent border-none outline-none flex-1"
                    autoFocus
                  />
                ) : (
                  <h1 
                    className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setEditingRoadmapTitle(true)}
                  >
                    {roadmap.title}
                  </h1>
                )}
              </div>
              {roadmap.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 lg:mt-2 line-clamp-2">{roadmap.description}</p>
              )}
            </div>
            
            <div className="flex items-start gap-2 lg:gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowControls(!showControls)}
                className="rounded-full lg:hidden"
              >
                {showControls ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              {(showControls) && (
                <div className="flex flex-col lg:flex-row items-end lg:items-center gap-2 lg:gap-3">
                  {/* Mobile: Stack vertically, Desktop: Horizontal */}
                  <div className="flex items-center gap-2 lg:gap-3">
                    
                    <div className="hidden sm:flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
                      <Button
                        variant={detailLevel === 'compact' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg"
                        onClick={() => onDetailLevelChange?.('compact')}
                      >
                        <Grid3X3 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                      <Button
                        variant={detailLevel === 'full' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg"
                        onClick={() => onDetailLevelChange?.('full')}
                      >
                        <List className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
                      <Button
                        variant={viewType === 'objective' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg text-xs lg:text-sm px-2 lg:px-3"
                        onClick={() => onViewTypeChange?.('objective')}
                      >
                        Objectives
                      </Button>
                      <Button
                        variant={viewType === 'module' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-lg text-xs lg:text-sm px-2 lg:px-3"
                        onClick={() => onViewTypeChange?.('module')}
                      >
                        Modules
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl bg-white/60 backdrop-blur-sm border-gray-200/50 px-2 lg:px-3" onClick={onShare}>
                      <Share2 className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-1" />
                      <span className="hidden lg:inline">Share</span>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="rounded-xl bg-white/60 backdrop-blur-sm border-gray-200/50 px-2 lg:px-3" onClick={onExport}>
                      <Download className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-1" />
                      <span className="hidden lg:inline">Export</span>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="rounded-xl bg-white/60 backdrop-blur-sm border-gray-200/50 px-2 lg:px-3" onClick={() => setShowSettingsModal(true)}>
                      <Settings className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-1" />
                      <span className="hidden lg:inline">Settings</span>
                    </Button>
                    
                    <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-2 lg:px-3" onClick={() => setIsCreatingItem(true)}>
                      <Plus className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-1" />
                      <span className="hidden sm:inline">Add Item</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {roadmap.objectives.length === 0 ? (
          <Card className="text-center py-16 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">No objectives yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Get started by adding your first objective to organize your roadmap items.
              </p>
              <Button onClick={() => setShowSettingsModal(true)} className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {viewType === 'objective' ? (
              /* Desktop Matrix Layout - Objectives */
              <div className="hidden lg:block">
                {/* Column Headers */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="p-4"></div>
                  {statusColumns.map((column) => (
                    <div key={column.key} className="text-center">
                      <div className={cn(
                        "inline-flex items-center px-6 py-3 rounded-2xl text-white font-semibold text-lg shadow-lg",
                        `bg-gradient-to-r ${column.gradient}`
                      )}>
                        {column.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matrix Grid */}
                {roadmap.objectives
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((objective) => (
                    <div key={objective.id} className="grid grid-cols-4 gap-6 group mb-8">
                      {/* Objective Column */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex items-center justify-between group-hover:shadow-xl transition-all duration-300">
                        <div 
                          className="flex items-center gap-4 flex-1 cursor-pointer"
                          onClick={() => setEditingObjective(objective)}
                        >
                          <div
                            className="w-6 h-6 rounded-full shadow-sm border-2 border-white"
                            style={{ backgroundColor: objective.color }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{objective.title}</h3>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingObjective(objective)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status Columns */}
                      {statusColumns.map((column) => {
                        const items = getItemsForObjectiveAndStatus(objective.id, column.key)
                        
                        return (
                          <div key={column.key} className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                              <span className={cn("font-medium text-sm", column.textColor)}>
                                {items.length} items
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:bg-white/60"
                                onClick={() => setIsCreatingItem(true)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Multi-column card grid */}
                            <div className={cn(
                              "grid gap-3",
                              items.length <= 2 ? "grid-cols-1" : 
                              items.length <= 4 ? "grid-cols-2" :
                              "grid-cols-2"
                            )}>
                              {items.map((item) => (
                                <RoadmapItem
                                  key={item.id}
                                  item={item}
                                  viewMode="edit"
                                  detailLevel={detailLevel}
                                  onEdit={() => setEditingItem(item)}
                                  onDelete={onDeleteItem}
                                  onComment={onCommentItem}
                                />
                              ))}
                              
                              {items.length === 0 && (
                                <div className="col-span-full">
                                  <div className="text-center py-8">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/40"
                                      onClick={() => setIsCreatingItem(true)}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add item
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
              </div>
            ) : (
              /* Desktop Matrix Layout - Modules */
              <div className="hidden lg:block">
                {/* Column Headers */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="p-4"></div>
                  {statusColumns.map((column) => (
                    <div key={column.key} className="text-center">
                      <div className={cn(
                        "inline-flex items-center px-6 py-3 rounded-2xl text-white font-semibold text-lg shadow-lg",
                        `bg-gradient-to-r ${column.gradient}`
                      )}>
                        {column.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matrix Grid - Modules */}
                {getModulesWithItems().map((module) => (
                  <div key={module.id} className="grid grid-cols-4 gap-6 group mb-8">
                    {/* Module Column */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex items-center justify-between group-hover:shadow-xl transition-all duration-300">
                      <div 
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => module.id !== 'unassigned' && setEditingModule(module)}
                      >
                        <div
                          className="w-6 h-6 rounded-full shadow-sm border-2 border-white"
                          style={{ backgroundColor: module.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{module.title}</h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      {module.id !== 'unassigned' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingModule(module)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Status Columns */}
                    {statusColumns.map((column) => {
                      const items = getItemsForModuleAndStatus(
                        module.id === 'unassigned' ? null : module.id, 
                        column.key
                      )
                      
                      return (
                        <div key={column.key} className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-6">
                            <span className={cn("font-medium text-sm", column.textColor)}>
                              {items.length} items
                            </span>
                          </div>
                          
                          {/* Multi-column card grid */}
                          <div className={cn(
                            "grid gap-3",
                            items.length <= 2 ? "grid-cols-1" : 
                            items.length <= 4 ? "grid-cols-2" :
                            "grid-cols-2"
                          )}>
                            {items.map((item) => (
                              <RoadmapItem
                                key={item.id}
                                item={item}
                                viewMode="edit"
                                detailLevel={detailLevel}
                                onEdit={() => setEditingItem(item)}
                                onDelete={onDeleteItem}
                                onComment={onCommentItem}
                              />
                            ))}
                            
                            {items.length === 0 && (
                              <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                                No items
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Card Layout */}
            <div className="lg:hidden space-y-8">
              {viewType === 'objective' ? (
                roadmap.objectives
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((objective) => (
                    <div key={objective.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                      {/* Objective Header */}
                      <div className="p-6 border-b border-gray-200/50">
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => setEditingObjective(objective)}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-sm border-2 border-white"
                              style={{ backgroundColor: objective.color }}
                            />
                            <h3 className="font-semibold text-gray-900 text-lg">{objective.title}</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingObjective(objective)}
                            className="rounded-xl"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status Sections */}
                      <div className="space-y-0">
                        {statusColumns.map((column, index) => {
                          const items = getItemsForObjectiveAndStatus(objective.id, column.key)
                          
                          return (
                            <div key={column.key} className={cn(
                              "p-6",
                              index !== statusColumns.length - 1 && "border-b border-gray-200/30"
                            )}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    `bg-gradient-to-r ${column.gradient}`
                                  )} />
                                  <h4 className={cn("font-semibold text-sm", column.textColor)}>
                                    {column.title} ({items.length})
                                  </h4>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-xl hover:bg-white/60"
                                  onClick={() => setIsCreatingItem(true)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {items.length > 0 ? (
                                <div className={cn(
                                  "grid gap-3",
                                  items.length === 1 ? "grid-cols-1" : "grid-cols-2"
                                )}>
                                  {items.map((item) => (
                                    <RoadmapItem
                                      key={item.id}
                                      item={item}
                                      viewMode="edit"
                                      detailLevel={detailLevel}
                                      onEdit={() => setEditingItem(item)}
                                      onDelete={onDeleteItem}
                                      onComment={onCommentItem}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/40"
                                    onClick={() => setIsCreatingItem(true)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add {column.title.toLowerCase()} item
                                  </Button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
              ) : (
                getModulesWithItems().map((module) => (
                  <div key={module.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                    {/* Module Header */}
                    <div className="p-6 border-b border-gray-200/50">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => module.id !== 'unassigned' && setEditingModule(module)}
                        >
                          <div
                            className="w-5 h-5 rounded-full shadow-sm border-2 border-white"
                            style={{ backgroundColor: module.color }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{module.title}</h3>
                            {module.description && (
                              <p className="text-sm text-gray-600">{module.description}</p>
                            )}
                          </div>
                        </div>
                        {module.id !== 'unassigned' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingModule(module)}
                            className="rounded-xl"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Status Sections */}
                    <div className="space-y-0">
                      {statusColumns.map((column, index) => {
                        const items = getItemsForModuleAndStatus(
                          module.id === 'unassigned' ? null : module.id, 
                          column.key
                        )
                        
                        return (
                          <div key={column.key} className={cn(
                            "p-6",
                            index !== statusColumns.length - 1 && "border-b border-gray-200/30"
                          )}>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  `bg-gradient-to-r ${column.gradient}`
                                )} />
                                <h4 className={cn("font-semibold text-sm", column.textColor)}>
                                  {column.title} ({items.length})
                                </h4>
                              </div>
                            </div>
                            
                            {items.length > 0 ? (
                              <div className={cn(
                                "grid gap-3",
                                items.length === 1 ? "grid-cols-1" : "grid-cols-2"
                              )}>
                                {items.map((item) => (
                                  <RoadmapItem
                                    key={item.id}
                                    item={item}
                                    viewMode="edit"
                                    detailLevel={detailLevel}
                                    onEdit={() => setEditingItem(item)}
                                    onDelete={onDeleteItem}
                                    onComment={onCommentItem}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-center py-6 text-sm">No items</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        objectives={roadmap.objectives}
        modules={roadmap.modules}
        onAddObjective={onAddObjective!}
        onUpdateObjective={onUpdateObjective!}
        onDeleteObjective={onDeleteObjective!}
        onAddModule={onAddModule!}
        onUpdateModule={onUpdateModule!}
        onDeleteModule={onDeleteModule!}
      />

      {/* Module Edit Modal */}
      {editingModule && (
        <SettingsModal
          isOpen={true}
          onClose={() => setEditingModule(null)}
          objectives={roadmap.objectives}
          modules={roadmap.modules}
          initialTab="modules"
          initialEditingModule={editingModule}
          onAddObjective={onAddObjective!}
          onUpdateObjective={onUpdateObjective!}
          onDeleteObjective={onDeleteObjective!}
          onAddModule={onAddModule!}
          onUpdateModule={onUpdateModule!}
          onDeleteModule={onDeleteModule!}
        />
      )}

      {/* Objective Edit Modal */}
      {editingObjective && (
        <SettingsModal
          isOpen={true}
          onClose={() => setEditingObjective(null)}
          objectives={roadmap.objectives}
          modules={roadmap.modules}
          initialTab="objectives"
          initialEditingObjective={editingObjective}
          onAddObjective={onAddObjective!}
          onUpdateObjective={onUpdateObjective!}
          onDeleteObjective={onDeleteObjective!}
          onAddModule={onAddModule!}
          onUpdateModule={onUpdateModule!}
          onDeleteModule={onDeleteModule!}
        />
      )}

      {/* Item Edit Modal */}
      <ItemEditModal
        isOpen={editingItem !== null || isCreatingItem}
        onClose={() => {
          setEditingItem(null)
          setIsCreatingItem(false)
        }}
        item={editingItem}
        objectives={roadmap.objectives}
        modules={roadmap.modules}
        onSave={async (updates) => {
          await onSaveItem?.(editingItem, updates)
        }}
        onCreateObjective={onCreateObjective}
      />
    </div>
  )
}