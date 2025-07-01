import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiMail, FiLock, FiLoader, FiEye, FiEyeOff, FiShield } = FiIcons

const AuthForm = ({ onSignIn }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    workspaceName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (!isLogin && formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    const { error } = await onSignIn(formData.email, formData.password, isLogin ? null : {
      name: formData.name,
      workspaceName: formData.workspaceName
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage(isLogin ? 'Signing you in...' : 'Creating your workspace...')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-surface rounded-default p-8 border border-dark-border shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
              PulseHQ
            </h1>
            <p className="text-dark-text-secondary">
              {isLogin ? 'Sign in to your workspace' : 'Create your secure workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={formData.workspaceName}
                    onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Enter workspace name"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Email address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-primary"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-default text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-default transition-colors duration-120 flex items-center justify-center"
            >
              {loading ? (
                <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
              ) : (
                <SafeIcon icon={FiShield} className="mr-2" />
              )}
              {loading 
                ? (isLogin ? 'Signing In...' : 'Creating Workspace...') 
                : (isLogin ? 'Sign In' : 'Create Workspace')
              }
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-default text-sm ${
                message.includes('Signing') || message.includes('Creating')
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent-blue hover:text-blue-400 text-sm transition-colors"
            >
              {isLogin ? "Don't have a workspace? Create one" : "Already have a workspace? Sign in"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-dark-text-muted">
              🔒 Enterprise-grade security • End-to-end encryption
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthForm