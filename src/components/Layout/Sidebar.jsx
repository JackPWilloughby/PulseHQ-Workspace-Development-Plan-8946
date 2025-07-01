import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import useStore from '../../store/useStore'
import ProfileMenu from './ProfileMenu'

const { FiColumns, FiUsers, FiMessageSquare, FiSearch, FiChevronLeft, FiChevronRight } = FiIcons

const Sidebar = ({ currentView, onViewChange, user, onSignOut, onUpdateProfile }) => {
  const { sidebarCollapsed, setSidebarCollapsed, searchQuery, setSearchQuery } = useStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const navItems = [
    { id: 'kanban', label: 'Tasks', icon: FiColumns },
    { id: 'crm', label: 'CRM', icon: FiUsers },
    { id: 'chat', label: 'Chat', icon: FiMessageSquare }
  ]

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? '64px' : '280px' }}
      className="bg-dark-surface border-r border-dark-border flex flex-col h-full relative z-10"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-dark-border">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-lg font-bold text-dark-text-primary">PulseHQ</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <SafeIcon 
              icon={sidebarCollapsed ? FiChevronRight : FiChevronLeft} 
              className="text-dark-text-secondary w-4 h-4" 
            />
          </button>
        </div>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="flex-shrink-0 p-4">
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted w-4 h-4" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search everywhere..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                currentView === item.id
                  ? 'bg-accent-blue text-white shadow-lg'
                  : 'text-dark-text-secondary hover:bg-dark-bg hover:text-dark-text-primary'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              {!sidebarCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex-shrink-0 p-4 border-t border-dark-border relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center px-3 py-3 text-dark-text-secondary hover:bg-dark-bg hover:text-dark-text-primary rounded-lg transition-colors"
          title={sidebarCollapsed ? user?.name || 'Profile' : undefined}
        >
          <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.[0] || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 flex-1 text-left">
              <div className="text-sm font-medium text-dark-text-primary truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-dark-text-muted truncate">
                {user?.email}
              </div>
            </div>
          )}
        </button>

        <AnimatePresence>
          {showProfileMenu && (
            <ProfileMenu
              user={user}
              onClose={() => setShowProfileMenu(false)}
              onSignOut={onSignOut}
              onUpdateProfile={onUpdateProfile}
              collapsed={sidebarCollapsed}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Sidebar