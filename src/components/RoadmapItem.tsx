'use client'

import { useState } from 'react'
import { RoadmapItem as RoadmapItemType, ItemCategory, ViewMode, DetailLevel } from '@/types'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Button } from './ui/Button'
import { MessageSquare, Tag, Trash2, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoadmapItemProps {
  item: RoadmapItemType
  viewMode: ViewMode
  detailLevel: DetailLevel
  onEdit?: (item: RoadmapItemType) => void
  onDelete?: (item: RoadmapItemType) => void
  onComment?: (item: RoadmapItemType) => void
  isDragging?: boolean
}

const categoryStyles: Record<ItemCategory, { bg: string; text: string; border: string; gradient: string }> = {
  tech: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-cyan-400'
  },
  business: {
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-400 to-teal-400'
  },
  mixed: {
    bg: 'bg-violet-50',
    text: 'text-violet-700', 
    border: 'border-violet-200',
    gradient: 'from-violet-400 to-purple-400'
  },
}

export function RoadmapItem({ 
  item, 
  viewMode, 
  detailLevel,
  onEdit, 
  onDelete, 
  onComment,
  isDragging = false
}: RoadmapItemProps) {
  const [showDescription, setShowDescription] = useState(detailLevel === 'rich')
  const [isHovered, setIsHovered] = useState(false)

  const canEdit = viewMode === 'edit'
  const isCompact = detailLevel === 'compact'
  const isRich = detailLevel === 'rich'
  const categoryStyle = categoryStyles[item.category]

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-xl bg-white/90 backdrop-blur-sm',
        isDragging && 'opacity-50 rotate-2 shadow-lg scale-95',
        isCompact ? 'p-2' : 'p-3',
        'hover:scale-[1.01] hover:-translate-y-0.5'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border effect */}
      <div className={cn(
        'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        `bg-gradient-to-r ${categoryStyle.gradient} p-[1px]`
      )}>
        <div className="w-full h-full bg-white rounded-lg" />
      </div>
      
      <div className="relative z-10">
        {!isCompact && (
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-gray-800 text-sm leading-tight pr-2 line-clamp-2">
                {item.title}
              </h4>
              {canEdit && (
                <div className={cn(
                  'flex gap-1 transition-all duration-200',
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                )}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-gray-100"
                    onClick={() => onEdit?.(item)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600"
                    onClick={() => onDelete?.(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        )}
        
        <CardContent className="p-0">
          {isCompact && (
            <h4 className="font-semibold text-gray-800 text-xs mb-2 leading-tight line-clamp-2">
              {item.title}
            </h4>
          )}
          
          {!isCompact && item.description && (
            <div className="mb-3">
              {isRich || showDescription ? (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              ) : (
                <button
                  onClick={() => setShowDescription(true)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors italic"
                >
                  Click to see description...
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
                categoryStyle.bg,
                categoryStyle.text,
                categoryStyle.border
              )}>
                {item.category}
              </span>
              
              {item.tags.length > 0 && !isCompact && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <div className="flex gap-1">
                    {item.tags.slice(0, 1).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 1 && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                        +{item.tags.length - 1}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!isCompact && canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 rounded-lg transition-all duration-200 hover:bg-gray-100',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
                onClick={() => onComment?.(item)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}