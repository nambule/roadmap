'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Roadmap } from '@/types'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Plus, FolderOpen, Share2, Calendar, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { user, signOut } = useAuth()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRoadmaps()
    }
  }, [user])

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setRoadmaps(data || [])
    } catch (error) {
      toast.error('Failed to fetch roadmaps')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
  }

  const createNewRoadmap = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .insert({
          title: 'New Roadmap',
          description: 'A product roadmap to organize your features and initiatives',
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        window.location.href = `/roadmap/${data.id}`
      }
    } catch (error) {
      toast.error('Failed to create roadmap')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Roadmap Builder
                </h1>
                <p className="text-gray-600 mt-1">Build and share product roadmaps</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200/50">
                  <User className="h-4 w-4" />
                  {user?.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="rounded-xl bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-white/80"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Roadmaps</h2>
              <p className="text-gray-600 text-lg">Manage your product roadmaps</p>
            </div>
            <Button 
              onClick={createNewRoadmap}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Roadmap
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
            </div>
          ) : roadmaps.length === 0 ? (
            <Card className="text-center py-20 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">No roadmaps yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Create your first roadmap to start organizing your product features and initiatives.
                </p>
                <Button 
                  onClick={createNewRoadmap}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Roadmap
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roadmaps.map((roadmap) => (
                <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                  <Card className="group h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {roadmap.description && (
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                          {roadmap.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(roadmap.updated_at).toLocaleDateString()}
                        </div>
                        {roadmap.is_public && (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <Share2 className="h-3.5 w-3.5" />
                            Public
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}