import axios from 'axios'

const baseURL = 'http://localhost:8056/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Events API
export const eventApi = {
  // Get all events
  getAll: async () => {
    try {
      const response = await api.get('/events')
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },
  
  // Get a single event by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error)
      throw error
    }
  },
  
  // Create a new event
  create: async (eventData) => {
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },
  
  // Update an existing event
  update: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.error(`Error updating event ${id}:`, error)
      throw error
    }
  },
  
  // Delete an event
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error)
      throw error
    }
  }
}

// Mock functions for bookings (to be implemented with real API later)
export const bookingApi = {
  // Get user's bookings
  getUserBookings: () => {
    return new Promise((resolve) => {
      // Get bookings from localStorage or return mock data
      const bookings = JSON.parse(localStorage.getItem('userBookings')) || []
      setTimeout(() => resolve(bookings), 500)
    })
  },
  
  // Book an event
  bookEvent: (eventId, userId) => {
    return new Promise((resolve) => {
      // Get current bookings
      const currentBookings = JSON.parse(localStorage.getItem('userBookings')) || []
      
      // Check if already booked
      const isAlreadyBooked = currentBookings.some(booking => 
        booking.eventId === eventId && booking.userId === userId
      )
      
      if (!isAlreadyBooked) {
        // Add new booking
        const newBooking = {
          id: Date.now().toString(),
          eventId,
          userId,
          bookingDate: new Date().toISOString(),
        }
        
        const updatedBookings = [...currentBookings, newBooking]
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings))
        
        setTimeout(() => resolve(newBooking), 500)
      } else {
        setTimeout(() => resolve({ error: 'Already booked' }), 500)
      }
    })
  },
  
  // Cancel a booking
  cancelBooking: (bookingId) => {
    return new Promise((resolve) => {
      // Get current bookings
      const currentBookings = JSON.parse(localStorage.getItem('userBookings')) || []
      
      // Remove the booking
      const updatedBookings = currentBookings.filter(booking => booking.id !== bookingId)
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings))
      
      setTimeout(() => resolve({ success: true }), 500)
    })
  }
}

export default api