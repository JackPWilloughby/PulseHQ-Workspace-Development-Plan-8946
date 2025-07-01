import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import useStore from '../../store/useStore'
import { format } from 'date-fns'

const { FiSend, FiHash, FiEdit2, FiSmile } = FiIcons

const ChatRoom = () => {
  const { messages, addMessage } = useStore()
  const [newMessage, setNewMessage] = useState('')
  const [editingMessage, setEditingMessage] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px'
    }
  }, [newMessage])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    addMessage({
      id: Date.now().toString(),
      sender_id: 'current-user',
      body: newMessage,
      created_at: new Date().toISOString()
    })
    setNewMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const formatMessageBody = (body) => {
    // Simple markdown-lite formatting
    return body
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-dark-surface px-1 rounded text-xs">$1</code>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-accent-blue hover:underline">$1</a>')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-dark-border bg-dark-surface">
        <div className="flex items-center">
          <SafeIcon icon={FiHash} className="text-dark-text-muted mr-3 w-5 h-5" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-dark-text-primary">general</h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary">Team Chat • 3 members</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {messages.map((message, index) => {
          const isOwnMessage = message.sender_id === 'current-user'
          const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex space-x-3 ${showAvatar ? 'mt-4' : 'mt-1'}`}
            >
              {showAvatar ? (
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {isOwnMessage ? 'Y' : 'U'}
                </div>
              ) : (
                <div className="w-8" />
              )}

              <div className="flex-1 min-w-0">
                {showAvatar && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-dark-text-primary text-sm">
                      {isOwnMessage ? 'You' : 'User'}
                    </span>
                    <span className="text-xs text-dark-text-muted">
                      {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                  </div>
                )}

                <div className="group relative">
                  <div 
                    className="text-dark-text-secondary leading-relaxed text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMessageBody(message.body) }}
                  />
                  {isOwnMessage && (
                    <button
                      onClick={() => setEditingMessage(message.id)}
                      className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-surface rounded transition-all"
                    >
                      <SafeIcon icon={FiEdit2} className="w-3 h-3 text-dark-text-muted" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-dark-text-muted rounded-full flex items-center justify-center text-white text-xs">
              U
            </div>
            <div className="flex items-center space-x-2 text-dark-text-muted">
              <span className="text-sm">typing</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiHash} className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-base font-medium text-dark-text-primary mb-2">Welcome to #general</h3>
            <p className="text-dark-text-muted text-sm">
              This is the beginning of the #general channel. Start the conversation with your team!
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-dark-border bg-dark-surface">
        <form onSubmit={handleSendMessage}>
          <div className="flex space-x-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message #general..."
                className="w-full pl-4 pr-10 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent resize-none text-sm leading-relaxed"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '100px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-dark-surface rounded transition-colors"
              >
                <SafeIcon icon={FiSmile} className="w-4 h-4 text-dark-text-muted" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-3 py-2.5 bg-accent-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center"
              style={{ minHeight: '40px' }}
            >
              <SafeIcon icon={FiSend} className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-dark-text-muted mt-2">
            <kbd className="px-1.5 py-0.5 bg-dark-border rounded text-xs">Enter</kbd> to send, 
            <kbd className="px-1.5 py-0.5 bg-dark-border rounded text-xs ml-1">Shift + Enter</kbd> for new line
          </p>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom