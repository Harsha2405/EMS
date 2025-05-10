import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { eventApi, bookingApi } from '../services/api'
import EventCard from '../components/EventCard'
import { FiCalendar, FiLoader, FiAlertCircle, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import './Dashboard.css'

const UserDashboard = () => {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('available')
  const [searchTerm, setSearchTerm] = useState('')
  const [bookingStatus, setBookingStatus] = useState({ show: false, success: false, message: '' })
  
  const { currentUser } = useAuth()
  
  // Fetch events and user bookings
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError('')
      
      try {
        // Fetch events
        const eventsData = await eventApi.getAll()
        setEvents(eventsData)
        
        // Fetch user bookings
        const userBookings = await bookingApi.getUserBookings()
        setBookings(userBookings)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Book an event
  const handleBookEvent = async (eventId) => {
    setIsBookingLoading(true)
    setError('')
    
    try {
      const result = await bookingApi.bookEvent(eventId, currentUser.id)
      
      if (result.error) {
        setBookingStatus({
          show: true,
          success: false,
          message: 'You have already booked this event'
        })
      } else {
        // Add new booking to state
        setBookings([...bookings, result])
        setBookingStatus({
          show: true,
          success: true,
          message: 'Event booked successfully!'
        })
      }
      
      // Hide the status message after a delay
      setTimeout(() => {
        setBookingStatus({ show: false, success: false, message: '' })
      }, 3000)
    } catch (err) {
      console.error('Failed to book event:', err)
      setError('Failed to book event. Please try again.')
    } finally {
      setIsBookingLoading(false)
    }
  }
  
  // Cancel a booking
  const handleCancelBooking = async (bookingId) => {
    setIsBookingLoading(true)
    setError('')
    
    try {
      await bookingApi.cancelBooking(bookingId)
      
      // Remove cancelled booking from state
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      
      setBookingStatus({
        show: true,
        success: true,
        message: 'Booking cancelled successfully'
      })
      
      // Hide the status message after a delay
      setTimeout(() => {
        setBookingStatus({ show: false, success: false, message: '' })
      }, 3000)
    } catch (err) {
      console.error('Failed to cancel booking:', err)
      setError('Failed to cancel booking. Please try again.')
    } finally {
      setIsBookingLoading(false)
    }
  }
  
  // Check if an event is already booked
  const isEventBooked = (eventId) => {
    return bookings.some(booking => booking.eventId === eventId)
  }
  
  // Find booking ID for a specific event
  const getBookingId = (eventId) => {
    const booking = bookings.find(booking => booking.eventId === eventId)
    return booking ? booking.id : null
  }
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Filter booked events
  const bookedEvents = filteredEvents.filter(event => 
    isEventBooked(event.id)
  )
  
  // Display events based on active tab
  const displayedEvents = activeTab === 'booked' 
    ? bookedEvents
    : filteredEvents
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p className="dashboard-welcome">Welcome back, {currentUser.name}</p>
      </div>
      
      {bookingStatus.show && (
        <div className={`alert ${bookingStatus.success ? 'alert-success' : 'alert-error'}`}>
          {bookingStatus.success ? <FiCheckCircle /> : <FiXCircle />}
          <span>{bookingStatus.message}</span>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Events
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Bookings ({bookings.length})
          </button>
        </div>
        
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
        ) : displayedEvents.length > 0 ? (
          <div className="events-grid">
            {displayedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                isBooked={isEventBooked(event.id)}
                actions={
                  activeTab === 'booked' ? (
                    <button 
                      className="btn btn-danger btn-icon btn-small"
                      onClick={() => handleCancelBooking(getBookingId(event.id))}
                      disabled={isBookingLoading}
                    >
                      <FiXCircle />
                      Cancel Booking
                    </button>
                  ) : isEventBooked(event.id) ? (
                    <button 
                      className="btn btn-outline btn-icon btn-small"
                      disabled
                    >
                      <FiCheckCircle />
                      Already Booked
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-icon btn-small"
                      onClick={() => handleBookEvent(event.id)}
                      disabled={isBookingLoading}
                    >
                      <FiCalendar />
                      Book Event
                    </button>
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiCalendar className="empty-state-icon" />
            <h3 className="empty-state-title">
              {activeTab === 'booked' 
                ? "You haven't booked any events yet" 
                : "No events found"}
            </h3>
            <p className="empty-state-description">
              {activeTab === 'booked'
                ? "Browse available events and book the ones you'd like to attend"
                : searchTerm 
                  ? "No events match your search criteria" 
                  : "There are no upcoming events at the moment"}
            </p>
            {activeTab === 'booked' && (
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('available')}
              >
                Browse Available Events
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard