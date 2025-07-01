import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      loading: false,
      
      // UI
      currentView: 'tasks',
      sidebarOpen: true,
      
      // Data
      tasks: [],
      contacts: [],
      messages: [],
      teamMembers: [],
      
      // Actions
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setCurrentView: (view) => set({ currentView: view }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTeamMembers: (teamMembers) => set({ teamMembers }),
      
      // Tasks
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: Date.now().toString() }] 
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      // Contacts
      addContact: (contact) => set((state) => ({ 
        contacts: [...state.contacts, { ...contact, id: Date.now().toString() }] 
      })),
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      })),
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== id)
      })),
      
      // Messages
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, { ...message, id: Date.now().toString() }] 
      })),
      
      // Initialize with sample data
      initializeData: () => set({
        tasks: [
          {
            id: '1',
            title: 'Design landing page',
            description: 'Create mockups for new product page',
            status: 'todo',
            priority: 'high',
            assignee: 'John Doe',
            dueDate: '2024-01-20'
          },
          {
            id: '2',
            title: 'Client meeting prep',
            description: 'Prepare slides for quarterly review',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'Jane Smith',
            dueDate: '2024-01-18'
          },
          {
            id: '3',
            title: 'Update documentation',
            description: 'Refresh API documentation',
            status: 'done',
            priority: 'low',
            assignee: 'Bob Johnson',
            dueDate: '2024-01-15'
          }
        ],
        contacts: [
          {
            id: '1',
            name: 'Acme Corp',
            email: 'contact@acme.com',
            phone: '+1 (555) 123-4567',
            company: 'Acme Corporation',
            status: 'client',
            assignee: 'John Doe'
          },
          {
            id: '2',
            name: 'Jane Wilson',
            email: 'jane@techstart.com',
            phone: '+1 (555) 987-6543',
            company: 'Tech Startup',
            status: 'lead',
            assignee: 'Jane Smith'
          }
        ],
        messages: [
          {
            id: '1',
            author: 'John Doe',
            content: 'Great work on the project everyone! 🎉',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            author: 'Jane Smith',
            content: 'Thanks! Ready for the next phase.',
            timestamp: new Date().toISOString()
          }
        ],
        teamMembers: [
          { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Designer' },
          { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Developer' },
          { id: '3', name: 'Bob Johnson', email: 'bob@company.com', role: 'Manager' }
        ]
      })
    }),
    {
      name: 'pulsehq-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        contacts: state.contacts,
        messages: state.messages,
        teamMembers: state.teamMembers,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)

export default useStore