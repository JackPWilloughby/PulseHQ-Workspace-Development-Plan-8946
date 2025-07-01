import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmailAndPassword = async (email, password, signUpData = null) => {
    setLoading(true)
    
    try {
      if (signUpData) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: signUpData.name,
              workspace_name: signUpData.workspaceName
            }
          }
        })
        
        if (error) throw error
        
        // Create workspace and user profile
        if (data.user) {
          await createWorkspaceAndProfile(data.user, signUpData)
        }
        
        setLoading(false)
        return { error: null }
      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        setLoading(false)
        return { error: null }
      }
    } catch (error) {
      setLoading(false)
      return { error }
    }
  }

  const createWorkspaceAndProfile = async (user, signUpData) => {
    try {
      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert([
          {
            name: signUpData.workspaceName,
            owner_id: user.id,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (workspaceError) throw workspaceError

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            name: signUpData.name,
            email: user.email,
            workspace_id: workspace.id,
            role: 'owner',
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) throw profileError

    } catch (error) {
      console.error('Error creating workspace and profile:', error)
      throw error
    }
  }

  const updateUser = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...updates })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
    }
    return { error }
  }

  return {
    user,
    loading,
    signInWithEmailAndPassword,
    signOut,
    updateUser
  }
}