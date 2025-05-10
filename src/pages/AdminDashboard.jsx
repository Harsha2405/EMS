import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { eventApi } from '../services/api'
import EventForm from '../components/EventForm'
import Modal from '../components/Modal'
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiAlertCircle, FiSearch, FiRefreshCw } from 'react-icons/fi'
import './Dashboard.css'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  // Fetch events
  const fetchEvents = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const data = await eventApi.getAll()
      setEvents(data)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('Failed to load events. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchEvents()
  }, [])
  
  // Handle event creation
  const handleAddEvent = async (eventData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const newEvent = await eventApi.create(eventData)
      setEvents([...events, newEvent])
      setShowAddModal(false)
    } catch (err) {
      console.error('Failed to create event:', err)
      setError('Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle event update
  const handleUpdateEvent = async (eventData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const updatedEvent = await eventApi.update(eventData.id, eventData)
      
      setEvents(events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ))
      
      setShowEditModal(false)
    } catch (err) {
      console.error('Failed to update event:', err)
      setError('Failed to update event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!currentEvent) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await eventApi.delete(currentEvent.id)
      setEvents(events.filter(event => event.id !== currentEvent.id))
      setShowDeleteModal(false)
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError('Failed to delete event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Edit button handler
  const openEditModal = (event) => {
    setCurrentEvent(event)
    setShowEditModal(true)
  }
  
  // Delete button handler
  const openDeleteModal = (event) => {
    setCurrentEvent(event)
    setShowDeleteModal(true)
  }
  
  // Filter events by search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-welcome">Welcome back, {currentUser.name}</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn btn-outline btn-icon btn-refresh"
              onClick={fetchEvents}
              disabled={isLoading}
            >
              <FiRefreshCw />
              Refresh
            </button>
            
            <button 
              className="btn btn-primary btn-icon"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus />
              Add Event
            </button>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-container">
            <FiLoader className="loading-spinner" />
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Description</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td className="description-cell">
                      {event.description.length > 50 
                        ? `${event.description.substring(0, 50)}...` 
                        : event.description}
                    </td>
                    <td>{formatDate(event.startTime)}</td>
                    <td>{formatDate(event.endTime)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-small btn-outline"
                          onClick={() => openEditModal(event)}
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => openDeleteModal(event)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FiCalendar className="empty-state-icon" />
            <h3 className="empty-state-title">No events found</h3>
            <p className="empty-state-description">
              {searchTerm 
                ? "No events match your search criteria" 
                : "You haven't created any events yet"}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus className="mr-1" />
              Create First Event
            </button>
          </div>
        )}
      </div>
      
      {/* Add Event Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Event"
        footer={
          <>
            <button 
              className="btn btn-outline"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              form="add-event-form" 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </>
        }
      >
        <EventForm 
          onSubmit={handleAddEvent} 
          isLoading={isSubmitting} 
          id="add-event-form"
        />
      </Modal>
      
      {/* Edit Event Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Event"
        footer={
          <>
            <button 
              className="btn btn-outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              form="edit-event-form" 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
          </>
        }
      >
        {currentEvent && (
          <EventForm 
            event={currentEvent} 
            onSubmit={handleUpdateEvent} 
            isLoading={isSubmitting}
            id="edit-event-form"
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        footer={
          <>
            <button 
              className="btn btn-outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteEvent}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Event'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete the event "{currentEvent?.title}"?</p>
        <p className="mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default AdminDashboard