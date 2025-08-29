'use client'

import { useState, useRef, useCallback } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { RoadmapItem, Objective, Module, Team, RoadmapStatus, ItemCategory } from '@/types'
import { cn } from '@/lib/utils'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  objectives: Objective[]
  modules: Module[]
  teams: Team[]
  onImport: (items: Partial<RoadmapItem>[]) => Promise<void>
  onCreateObjective?: (title: string) => Promise<Objective>
}

interface ParsedItem {
  title: string
  description?: string
  status: RoadmapStatus
  category: ItemCategory
  objective_id?: string
  module_id?: string
  team_id?: string
  tags?: string[]
  errors: string[]
}

const EXPECTED_COLUMNS = [
  'title', 'description', 'status', 'category', 
  'objective', 'module', 'team', 'tags'
]

export function ImportModal({
  isOpen,
  onClose,
  objectives,
  modules,
  teams,
  onImport,
  onCreateObjective
}: ImportModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'success'>('upload')
  const [errors, setErrors] = useState<string[]>([])
  const [hasHeaders, setHasHeaders] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setParsedData([])
    setStep('upload')
    setErrors([])
    setDragActive(false)
    setHasHeaders(true)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const parseCSV = (content: string): string[][] => {
    const lines = content.split('\n')
    const result: string[][] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const row: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        
        if (char === '"') {
          if (inQuotes && line[j + 1] === '"') {
            current += '"'
            j++ // Skip next quote
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ';' && !inQuotes) {
          row.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      
      row.push(current.trim())
      result.push(row)
    }
    
    return result
  }

  const findEntityByName = (name: string, entities: { id: string; title: string }[]) => {
    if (!name) return null
    const found = entities.find(entity => 
      entity.title.toLowerCase() === name.toLowerCase().trim()
    )
    return found || null
  }

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrors(['Please select a CSV file'])
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])

    try {
      const content = await selectedFile.text()
      const rows = parseCSV(content)
      
      if (rows.length === 0) {
        setErrors(['The CSV file is empty'])
        setIsProcessing(false)
        return
      }

      // Determine data rows based on header setting
      const dataRows = hasHeaders ? rows.slice(1) : rows

      if (dataRows.length === 0) {
        setErrors(['The CSV file contains no data rows'])
        setIsProcessing(false)
        return
      }

      const parsed: ParsedItem[] = []

      // Positional column mapping (no header detection needed)
      // Column 1: Title, Column 2: Description, Column 3: Status, Column 4: Category,
      // Column 5: Objective, Column 6: Module, Column 7: Team, Column 8: Tags

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        const rowErrors: string[] = []
        
        // Column 1: Title (required)
        let title = row[0]?.trim() || ''
        if (!title) {
          title = 'Missing title'
          rowErrors.push('Title is missing, using default')
        }

        // Column 2: Description
        const description = row[1]?.trim() || ''

        // Column 3: Status
        let status: RoadmapStatus = 'later'
        if (row[2]) {
          const statusValue = row[2].toLowerCase().trim()
          if (statusValue === 'now' || statusValue === 'next' || statusValue === 'later') {
            status = statusValue as RoadmapStatus
          } else if (statusValue) {
            rowErrors.push(`Unknown status "${statusValue}", using "later"`)
          }
        }

        // Column 4: Category
        let category: ItemCategory = 'business'
        if (row[3]) {
          const categoryValue = row[3].toLowerCase().trim()
          if (categoryValue === 'tech' || categoryValue === 'technical') {
            category = 'tech'
          } else if (categoryValue === 'business') {
            category = 'business'
          } else if (categoryValue === 'mixed') {
            category = 'mixed'
          } else if (categoryValue && !['tech', 'technical', 'business', 'mixed'].includes(categoryValue)) {
            rowErrors.push(`Unknown category "${categoryValue}", using "business"`)
          }
        }

        // Column 5: Objective
        let objective_id: string | undefined
        if (row[4]) {
          const objectiveName = row[4].trim()
          if (objectiveName) {
            const foundObjective = findEntityByName(objectiveName, objectives)
            if (foundObjective) {
              objective_id = foundObjective.id
            } else {
              rowErrors.push(`Objective "${objectiveName}" not found`)
            }
          }
        }

        // Column 6: Module
        let module_id: string | undefined
        if (row[5]) {
          const moduleName = row[5].trim()
          if (moduleName) {
            const foundModule = findEntityByName(moduleName, modules)
            if (foundModule) {
              module_id = foundModule.id
            } else {
              rowErrors.push(`Module "${moduleName}" not found`)
            }
          }
        }

        // Column 7: Team
        let team_id: string | undefined
        if (row[6]) {
          const teamName = row[6].trim()
          if (teamName) {
            const foundTeam = findEntityByName(teamName, teams)
            if (foundTeam) {
              team_id = foundTeam.id
            } else {
              rowErrors.push(`Team "${teamName}" not found`)
            }
          }
        }

        // Column 8: Tags
        let tags: string[] = []
        if (row[7]) {
          const tagsValue = row[7].trim()
          if (tagsValue) {
            tags = tagsValue.split(/[,;]/).map(t => t.trim()).filter(Boolean)
          }
        }

        parsed.push({
          title,
          description: description || undefined,
          status,
          category,
          objective_id,
          module_id,
          team_id,
          tags: tags.length > 0 ? tags : undefined,
          errors: rowErrors
        })
      }

      setParsedData(parsed)
      setStep('preview')
    } catch (error) {
      setErrors(['Error reading CSV file: ' + (error as Error).message])
    }
    
    setIsProcessing(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return

    setStep('importing')
    
    try {
      const itemsToImport = parsedData.map(item => ({
        title: item.title,
        description: item.description,
        status: item.status,
        category: item.category,
        objective_id: item.objective_id,
        module_id: item.module_id,
        team_id: item.team_id,
        tags: item.tags
      }))

      await onImport(itemsToImport)
      setStep('success')
      
      setTimeout(() => {
        onClose()
        reset()
      }, 2000)
    } catch (error) {
      setErrors(['Import failed: ' + (error as Error).message])
      setStep('preview')
    }
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Roadmap Items"
      className="max-w-4xl"
    >
      <div className="p-6">
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Import roadmap items from a CSV file using semicolon (;) as separator. Columns are mapped by position, not by header names.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">CSV Column Order:</h4>
                <div className="text-sm text-blue-800 text-left space-y-1">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>• <strong>Column 1:</strong> Title (required)</div>
                    <div>• <strong>Column 2:</strong> Description</div>
                    <div>• <strong>Column 3:</strong> Status (now/next/later)</div>
                    <div>• <strong>Column 4:</strong> Category (tech/business/mixed)</div>
                    <div>• <strong>Column 5:</strong> Objective</div>
                    <div>• <strong>Column 6:</strong> Module</div>
                    <div>• <strong>Column 7:</strong> Team</div>
                    <div>• <strong>Column 8:</strong> Tags</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <div>Missing values use defaults: &quot;Missing title&quot;, &quot;later&quot; status, &quot;business&quot; category</div>
                  </div>
                </div>
              </div>

              {/* Header checkbox */}
              <div className="mb-4">
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHeaders}
                    onChange={(e) => setHasHeaders(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">First line contains headers (skip it)</span>
                </label>
              </div>
            </div>

            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-gray-500">or</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Choose File'}
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900">Import Error</h4>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Preview Import</h3>
                <p className="text-sm text-gray-600">
                  {parsedData.length} items ready to import from {file?.name}
                </p>
              </div>
              <Button
                onClick={() => setStep('upload')}
                variant="outline"
                size="sm"
              >
                Choose Different File
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b text-xs font-medium text-gray-700">
                <div className="col-span-3">Title</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Objective</div>
                <div className="col-span-2">Module</div>
                <div className="col-span-1">Issues</div>
              </div>
              {parsedData.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-3 border-b text-sm hover:bg-gray-50">
                  <div className="col-span-3">
                    <div className="font-medium truncate" title={item.title}>
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate" title={item.description}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs font-medium",
                      item.status === 'now' && "bg-red-100 text-red-700",
                      item.status === 'next' && "bg-yellow-100 text-yellow-700",
                      item.status === 'later' && "bg-green-100 text-green-700"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    {item.objective_id ? (
                      <span className="text-xs text-green-700">
                        {objectives.find(o => o.id === item.objective_id)?.title}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {item.module_id ? (
                      <span className="text-xs text-blue-700">
                        {modules.find(m => m.id === item.module_id)?.title}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                  <div className="col-span-1">
                    {item.errors.length > 0 && (
                      <div title={item.errors.join(', ')}>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleImport}
                className="flex-1"
                disabled={parsedData.length === 0}
              >
                Import {parsedData.length} Items
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Importing Items...</h3>
            <p className="text-gray-600">Please wait while we process your data.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Import Successful!</h3>
            <p className="text-gray-600">
              {parsedData.length} items have been imported to your roadmap.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}