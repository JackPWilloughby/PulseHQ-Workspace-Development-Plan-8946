import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Layout from './components/Layout'
import Tasks from './components/Tasks'
import CRM from './components/CRM'
import Chat from './components/Chat'
import Team from './components/Team'
import './App.css'

const App = () => {
  const { user, setUser, currentView, initializeData, loading, setLoading } = useStore()

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        initializeData()
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        initializeData()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, initializeData, setLoading])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks': return <Tasks />
      case 'crm': return <CRM />
      case 'chat': return <Chat />
      case 'team': return <Team />
      default: return <Tasks />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">PulseHQ</h1>
          <p className="text-blue-200">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default App