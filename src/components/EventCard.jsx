import { FiClock, FiCalendar, FiMapPin } from 'react-icons/fi'
import './EventCard.css'

const EventCard = ({ event, actions, isBooked = false }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    })
  }
  
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }
  
  return (
    <div className={`event-card ${isBooked ? 'event-card-booked' : ''}`}>
      <div className="event-card-header">
        <h3 className="event-card-title">{event.title}</h3>
        {isBooked && <span className="event-card-badge">Booked</span>}
      </div>
      
      <div className="event-card-body">
        <p className="event-card-description">{event.description}</p>
        
        <div className="event-card-details">
          <div className="event-card-detail">
            <FiCalendar className="event-card-icon" />
            <span>{formatDate(event.startTime)}</span>
          </div>
          
          <div className="event-card-detail">
            <FiClock className="event-card-icon" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          
          {event.location && (
            <div className="event-card-detail">
              <FiMapPin className="event-card-icon" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="event-card-footer">
          {actions}
        </div>
      )}
    </div>
  )
}

export default EventCard