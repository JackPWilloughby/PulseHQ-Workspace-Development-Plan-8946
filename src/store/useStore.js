import { create } from 'zustand'
import { supabase } from '../config/supabase'

const useStore = create((set, get) => ({
  // UI State
  sidebarCollapsed: false,
  inspectorOpen: false,
  selectedContact: null,
  selectedTask: null,
  searchQuery: '',

  // Data
  tasks: [],
  contacts: [],
  messages: [],
  comments: [],
  notes: [],
  users: [
    {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: null
    },
    {
      id: 'user2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'member',
      avatar: null
    },
    {
      id: 'current-user',
      name: 'You',
      email: 'you@example.com',
      role: 'owner',
      avatar: null
    }
  ],

  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setInspectorOpen: (open) => set({ inspectorOpen: open }),
  setSelectedContact: (contact) => set({ 
    selectedContact: contact, 
    selectedTask: null, // Clear task when selecting contact
    inspectorOpen: !!contact 
  }),
  setSelectedTask: (task) => set({ 
    selectedTask: task, 
    selectedContact: null, // Clear contact when selecting task
    inspectorOpen: !!task 
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Data Actions
  setTasks: (tasks) => set({ tasks }),
  setContacts: (contacts) => set({ contacts }),
  setMessages: (messages) => set({ messages }),
  setComments: (comments) => set({ comments }),
  setNotes: (notes) => set({ notes }),
  setUsers: (users) => set({ users }),

  // Add functions
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),

  // Update functions
  updateTask: (id, updates) => set((state) => {
    const updatedTasks = state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
    
    // Update selectedTask if it's the one being updated
    const updatedSelectedTask = state.selectedTask?.id === id 
      ? { ...state.selectedTask, ...updates } 
      : state.selectedTask

    return { 
      tasks: updatedTasks, 
      selectedTask: updatedSelectedTask 
    }
  }),

  updateContact: (id, updates) => set((state) => {
    const updatedContacts = state.contacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    )
    
    // Update selectedContact if it's the one being updated
    const updatedSelectedContact = state.selectedContact?.id === id 
      ? { ...state.selectedContact, ...updates } 
      : state.selectedContact

    return { 
      contacts: updatedContacts, 
      selectedContact: updatedSelectedContact 
    }
  }),

  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    )
  })),

  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    )
  })),

  // Delete functions
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    inspectorOpen: state.selectedTask?.id === id ? false : state.inspectorOpen
  })),

  deleteContact: (id) => set((state) => ({
    contacts: state.contacts.filter(contact => contact.id !== id),
    selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
    inspectorOpen: state.selectedContact?.id === id ? false : state.inspectorOpen
  })),

  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  })),

  deleteUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id)
  })),
}))

export default useStore