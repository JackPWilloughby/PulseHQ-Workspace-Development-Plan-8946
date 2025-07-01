import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiMail, FiLoader } = FiIcons

const AuthForm = ({ onSignIn }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await onSignIn(email)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Signing you in...')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-surface rounded-default p-8 border border-dark-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
              PulseHQ
            </h1>
            <p className="text-dark-text-secondary">
              Sign in to your agency workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Email address
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiMail} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-default transition-colors duration-120 flex items-center justify-center"
            >
              {loading ? (
                <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
              ) : (
                <SafeIcon icon={FiMail} className="mr-2" />
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-default text-sm ${
                message.includes('Signing') 
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-dark-text-muted">
              Demo mode - use any email to sign in
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthForm