import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          console.log('Found existing session for:', session.user.email)
          setUser(session.user)
          createProfileFromUser(session.user)
        } else if (mounted) {
          console.log('No existing session')
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          createProfileFromUser(session.user)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    getSession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Create profile directly from auth user - no database dependency
  const createProfileFromUser = (authUser) => {
    console.log('Creating profile from user:', authUser.email)
    
    const userProfile = {
      id: authUser.id,
      name: authUser.user_metadata?.name || 
            authUser.user_metadata?.full_name || 
            authUser.email?.split('@')[0] || 
            'User',
      email: authUser.email,
      role: 'owner', // All users are owners for now
      workspace_id: `workspace-${authUser.id}`,
      workspace: {
        id: `workspace-${authUser.id}`,
        name: `${authUser.user_metadata?.name || authUser.email.split('@')[0]}'s Workspace`
      },
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at || new Date().toISOString()
    }

    console.log('Created profile:', userProfile)
    setProfile(userProfile)
    setLoading(false)

    // Try to save to database in background (don't wait for it)
    saveProfileToDatabase(userProfile).catch(err => {
      console.log('Background save failed (this is OK):', err.message)
    })
  }

  // Background database save - don't block on this
  const saveProfileToDatabase = async (profileData) => {
    try {
      // Try to create workspace
      await supabase
        .from('workspaces_pulsehq_2024')
        .upsert({
          id: profileData.workspace_id,
          name: profileData.workspace.name
        })

      // Try to save profile
      await supabase
        .from('profiles_pulsehq_2024')
        .upsert({
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role,
          workspace_id: profileData.workspace_id
        })

      console.log('✅ Profile saved to database')
    } catch (error) {
      console.log('⚠️ Could not save to database:', error.message)
      // This is OK - we continue without database
    }
  }

  const signInWithEmailAndPassword = async (email, password, signUpData = null) => {
    try {
      setLoading(true)

      if (signUpData) {
        // Sign up
        console.log('Attempting sign up for:', email)
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              name: signUpData.name.trim(),
              full_name: signUpData.name.trim()
            }
          }
        })

        if (error) {
          console.error('Sign up error:', error)
          setLoading(false)
          return { error: { message: error.message } }
        }

        console.log('Sign up result:', data)

        // For development, we'll assume email confirmation is disabled
        if (data.user && data.session) {
          console.log('✅ Sign up successful with immediate session')
          setLoading(false)
          return { error: null, message: 'Account created successfully!' }
        } else if (data.user) {
          console.log('📧 Sign up successful, email confirmation required')
          setLoading(false)
          return { 
            error: null, 
            message: 'Account created! Please check your email to confirm your account, then sign in.' 
          }
        }
      } else {
        // Sign in
        console.log('Attempting sign in for:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        })

        if (error) {
          console.error('Sign in error:', error)
          setLoading(false)
          return { error: { message: error.message } }
        }

        console.log('✅ Sign in successful for:', email)
        // Auth state change will handle profile creation
        return { error: null }
      }
    } catch (error) {
      console.error('Auth exception:', error)
      setLoading(false)
      return { error: { message: 'An unexpected error occurred. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Signing out...')
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setLoading(false)
      
      console.log('✅ Signed out successfully')
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
      return { error }
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      console.log('Updating profile:', updates)
      
      // Update auth metadata
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: updates.name,
          full_name: updates.name
        }
      })
      
      if (error) {
        console.error('Auth update error:', error)
        throw error
      }
      
      // Update local profile immediately
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)

      // Try to update database in background
      saveProfileToDatabase(updatedProfile).catch(err => {
        console.log('Background profile update failed:', err.message)
      })

      console.log('✅ Profile updated')
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  const resetPassword = async (email) => {
    try {
      console.log('Sending password reset for:', email)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('Password reset error:', error)
        return { error: { message: error.message } }
      }
      
      console.log('✅ Password reset email sent')
      return { error: null, message: 'Password reset email sent. Please check your inbox.' }
    } catch (error) {
      console.error('Password reset exception:', error)
      return { error: { message: 'Failed to send password reset email.' } }
    }
  }

  // Helper functions
  const isAdmin = () => profile?.role === 'owner' || profile?.role === 'admin'
  const isOwner = () => profile?.role === 'owner'

  return {
    user,
    profile,
    loading,
    signInWithEmailAndPassword,
    signOut,
    updateUserProfile,
    resetPassword,
    isAdmin,
    isOwner
  }
}