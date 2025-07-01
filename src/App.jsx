import React, { useState, useEffect } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

// Components
import AuthForm from './components/Auth/AuthForm'
import Sidebar from './components/Layout/Sidebar'
import Inspector from './components/Layout/Inspector'
import KanbanBoard from './components/Kanban/KanbanBoard'
import ContactList from './components/CRM/ContactList'
import ChatRoom from './components/Chat/ChatRoom'
import GlobalSearch from './components/common/GlobalSearch'

// Hooks & Store
import { useAuth } from './hooks/useAuth'
import useStore from './store/useStore'

// Styles
import './App.css'

const App = () => {
  const { user, loading, signInWithEmailAndPassword, signOut, updateUser } = useAuth()
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    inspectorOpen, 
    setInspectorOpen, 
    setSelectedContact, 
    setSelectedTask 
  } = useStore()
  const [currentView, setCurrentView] = useState('kanban')

  // Global keyboard shortcuts
  useHotkeys('meta+k,ctrl+k', (e) => {
    e.preventDefault()
    // Global search would be triggered here
  })

  // Clear selections when changing views
  const handleViewChange = (newView) => {
    setCurrentView(newView)
    // Close inspector and clear selections when changing tabs
    setInspectorOpen(false)
    setSelectedContact(null)
    setSelectedTask(null)
  }

  const handleUpdateProfile = (profileData) => {
    updateUser(profileData)
  }

  // Mock data initialization
  useEffect(() => {
    if (user) {
      // Initialize with mock data
      useStore.getState().setTasks([
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create wireframes and mockups for the new product landing page',
          status: 'todo',
          due_date: '2024-01-15',
          assignee_id: 'user1',
          assignee_name: 'John Doe',
          priority: 'high',
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'Client presentation prep',
          description: 'Prepare slides for quarterly review meeting',
          status: 'doing',
          assignee_id: 'user2',
          assignee_name: 'Jane Smith',
          priority: 'medium',
          created_at: '2024-01-10T11:00:00Z'
        },
        {
          id: '3',
          title: 'Update brand guidelines',
          description: 'Refresh logo usage and color palette documentation',
          status: 'done',
          assignee_id: 'user1',
          assignee_name: 'John Doe',
          priority: 'low',
          created_at: '2024-01-09T09:00:00Z'
        }
      ])

      useStore.getState().setContacts([
        {
          id: '1',
          name: 'Acme Corp',
          company: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1 (555) 123-4567',
          website: 'https://acme.com',
          assigned_to: 'John Doe',
          status: 'client',
          created_at: '2024-01-08T09:00:00Z'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Tech Startup Inc',
          email: 'sarah@techstartup.com',
          phone: '+1 (555) 987-6543',
          website: 'https://techstartup.com',
          assigned_to: 'Jane Smith',
          status: 'prospect',
          created_at: '2024-01-09T14:30:00Z'
        },
        {
          id: '3',
          name: 'Mike Chen',
          company: 'Digital Solutions Ltd',
          email: 'mike@digitalsolutions.com',
          phone: '+1 (555) 456-7890',
          website: 'https://digitalsolutions.com',
          assigned_to: 'John Doe',
          status: 'lead',
          created_at: '2024-01-10T11:15:00Z'
        }
      ])

      useStore.getState().setMessages([
        {
          id: '1',
          sender_id: 'other-user',
          body: 'Hey team! Just finished the client call. They loved our proposal! 🎉',
          created_at: '2024-01-10T15:30:00Z'
        },
        {
          id: '2',
          sender_id: 'current-user',
          body: 'That\'s **amazing** news! When do we start?',
          created_at: '2024-01-10T15:32:00Z'
        },
        {
          id: '3',
          sender_id: 'other-user',
          body: 'They want to kick off next Monday. I\'ll send over the contract details.',
          created_at: '2024-01-10T15:35:00Z'
        }
      ])

      useStore.getState().setNotes([
        {
          id: '1',
          contact_id: '1',
          author_id: 'current-user',
          body: 'Initial discovery call went well. They\'re interested in our **premium package**. Next steps: send proposal by Friday.',
          created_at: '2024-01-08T16:00:00Z'
        },
        {
          id: '2',
          contact_id: '2',
          author_id: 'current-user',
          body: 'Follow-up meeting scheduled for next week. Need to prepare demo of new features.',
          created_at: '2024-01-09T10:30:00Z'
        }
      ])
    }
  }, [user])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-text-secondary">Loading PulseHQ...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSignIn={signInWithEmailAndPassword} />
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanBoard />
      case 'crm':
        return <ContactList />
      case 'chat':
        return <ChatRoom />
      default:
        return <KanbanBoard />
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-dark-text-primary">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            user={user}
            onSignOut={signOut}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* Main Content */}
          <main className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="h-full overflow-hidden"
              >
                {renderMainContent()}
              </motion.div>
            </div>

            {/* Inspector */}
            {inspectorOpen && <Inspector />}
          </main>
        </div>

        {/* Global Search */}
        <GlobalSearch onNavigate={handleViewChange} />
      </div>
    </Router>
  )
}

export default App