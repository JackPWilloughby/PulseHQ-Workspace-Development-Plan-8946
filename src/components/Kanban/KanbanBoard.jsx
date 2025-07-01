import React, { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import useStore from '../../store/useStore'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import { useHotkeys } from 'react-hotkeys-hook'

const { FiPlus } = FiIcons

const COLUMNS = [
  { id: 'todo', title: 'To-Do', color: 'bg-dark-text-muted' },
  { id: 'doing', title: 'Doing', color: 'bg-accent-blue' },
  { id: 'done', title: 'Done', color: 'bg-accent-green' }
]

const KanbanBoard = () => {
  const { tasks, addTask, updateTask, selectedTask, setSelectedTask, setInspectorOpen } = useStore()
  const [activeTask, setActiveTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Keyboard shortcuts
  useHotkeys('n', () => setShowTaskModal(true))

  const handleDragStart = (event) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    if (tasks.find(t => t.id === taskId)?.status !== newStatus) {
      updateTask(taskId, { status: newStatus })
    }
  }

  const handleTaskSelect = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setInspectorOpen(true)
    }
  }

  const handleTaskEdit = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleCloseModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask({
        id: Date.now().toString(),
        ...taskData,
        status: 'todo',
        created_at: new Date().toISOString()
      })
    }
    handleCloseModal()
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-3 sm:p-6 border-b border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-dark-text-primary">Tasks</h1>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <SafeIcon icon={FiPlus} className="mr-1 sm:mr-2 w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-3 sm:p-6">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-full">
            {COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onTaskSelect={handleTaskSelect}
                onTaskEdit={handleTaskEdit}
                selectedTaskId={selectedTask?.id}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="opacity-95">
                <TaskCard task={activeTask} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  )
}

export default KanbanBoard