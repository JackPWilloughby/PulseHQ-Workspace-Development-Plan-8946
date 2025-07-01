import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('pulsehq-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Error parsing saved user data:', e)
      }
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      if (!savedUser) {
        setUser({ 
          id: 'demo-user', 
          email: 'demo@pulsehq.com',
          name: 'Demo User'
        })
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const signInWithMagicLink = async (email) => {
    setLoading(true)
    // Simulate sign in
    setTimeout(() => {
      const userData = { 
        id: 'demo-user', 
        email: email,
        name: 'Demo User'
      }
      setUser(userData)
      localStorage.setItem('pulsehq-user', JSON.stringify(userData))
      setLoading(false)
    }, 1000)
    return { error: null }
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('pulsehq-user', JSON.stringify(updatedUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('pulsehq-user')
    return { error: null }
  }

  return {
    user,
    loading,
    signInWithMagicLink,
    signOut,
    updateUser
  }
}