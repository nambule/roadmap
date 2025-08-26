'use client'

import { useState } from 'react'
import { RoadmapItem as RoadmapItemType, ItemCategory, ViewMode, DetailLevel } from '@/types'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Button } from './ui/Button'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoadmapItemProps {
  item: RoadmapItemType
  viewMode: ViewMode
  detailLevel: DetailLevel
  onEdit?: (item: RoadmapItemType) => void
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
  isDragging = false
}: RoadmapItemProps) {
  const [showDescription, setShowDescription] = useState(detailLevel === 'full')

  const canEdit = viewMode === 'edit'
  const isCompact = detailLevel === 'compact'
  const isFull = detailLevel === 'full'
  const categoryStyle = categoryStyles[item.category]

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-xl bg-white/90 backdrop-blur-sm cursor-pointer',
        isDragging && 'opacity-50 rotate-2 shadow-lg scale-95',
        isCompact ? 'p-1.5' : 'p-2',
        'hover:scale-[1.01] hover:-translate-y-0.5'
      )}
      onClick={() => onEdit?.(item)}
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
          <CardHeader className="p-0 pb-1.5">
            <div className="flex items-start">
              <h4 className="font-semibold text-gray-800 text-sm leading-tight w-full line-clamp-3">
                {item.title}
              </h4>
            </div>
          </CardHeader>
        )}
        
        <CardContent className="p-0">
          {isCompact && (
            <h4 className="font-semibold text-gray-800 text-sm mb-1.5 leading-tight line-clamp-2 w-full">
              {item.title}
            </h4>
          )}
          
          {!isCompact && item.description && (
            <div className="mb-2">
              {isFull || showDescription ? (
                <p className="text-xs text-gray-600 leading-snug line-clamp-2">
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
          
          <div className="flex items-center">
            <div className="flex items-center gap-1 flex-wrap">
              <span className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium border',
                categoryStyle.bg,
                categoryStyle.text,
                categoryStyle.border
              )}>
                {item.category}
              </span>
              
              {item.tags.length > 0 && !isCompact && (
                <div className="flex items-center gap-0.5">
                  <Tag className="h-2.5 w-2.5 text-gray-400" />
                  <div className="flex gap-0.5">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-1 py-0.5 rounded">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}