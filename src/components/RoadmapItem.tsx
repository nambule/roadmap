'use client'

import { useState } from 'react'
import { RoadmapItem as RoadmapItemType, ViewMode, DetailLevel, CardDisplayOptions } from '@/types'
import { Card, CardContent, CardHeader } from './ui/Card'
import { cn } from '@/lib/utils'

interface RoadmapItemProps {
  item: RoadmapItemType
  viewMode: ViewMode
  detailLevel: DetailLevel
  onEdit?: (item: RoadmapItemType) => void
  isDragging?: boolean
  cardDisplayOptions?: CardDisplayOptions
}



export function RoadmapItem({ 
  item, 
  viewMode, 
  detailLevel,
  onEdit, 
  isDragging = false,
  cardDisplayOptions = {
    showDescription: true,
    showCategory: false,
    showTeam: false
  }
}: RoadmapItemProps) {
  const [showDescription, setShowDescription] = useState(detailLevel === 'full')

  const canEdit = viewMode === 'edit'
  const isCompact = detailLevel === 'compact'
  const isFull = detailLevel === 'full'

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-300 border-0 shadow-sm bg-white/90 backdrop-blur-sm cursor-pointer',
        isDragging && 'opacity-50 rotate-2 shadow-lg scale-95',
        isCompact ? 'p-1.5' : 'p-2',
        viewMode === 'edit' ? 'hover:shadow-xl hover:scale-[1.01] hover:-translate-y-0.5' : 'hover:shadow-md'
      )}
      onClick={() => onEdit?.(item)}
    >
      {/* Gradient border effect */}
      {viewMode === 'edit' && (
        <div className={cn(
          'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'bg-gradient-to-r from-blue-400 to-purple-400 p-[1px]'
        )}>
          <div className="w-full h-full bg-white rounded-lg" />
        </div>
      )}
      
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
          
          {!isCompact && item.description && cardDisplayOptions.showDescription && (
            <div className="mb-2">
              {isFull || showDescription ? (
                <p className="text-xs text-gray-600 leading-snug line-clamp-5">
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
          
        </CardContent>
      </div>
    </Card>
  )
}