import { useState, useEffect } from 'react'

const EventForm = ({ event = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  })
  
  const [errors, setErrors] = useState({})
  
  // If editing, populate form with event data
  useEffect(() => {
    if (event.id) {
      // Format date strings for datetime-local input
      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
      }
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: formatDateForInput(event.startTime),
        endTime: formatDateForInput(event.endTime),
        location: event.location || '',
      })
    }
  }, [event])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    } else if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = 'End time must be after start time'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit({ 
        ...formData,
        id: event.id // Include the id if we're editing
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
          disabled={isLoading}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-input form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          disabled={isLoading}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startTime" className="form-label">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            className="form-input"
            value={formData.startTime}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.startTime && <p className="form-error">{errors.startTime}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="endTime" className="form-label">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            className="form-input"
            value={formData.endTime}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.endTime && <p className="form-error">{errors.endTime}</p>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="location" className="form-label">Location (Optional)</label>
        <input
          type="text"
          id="location"
          name="location"
          className="form-input"
          value={formData.location}
          onChange={handleChange}
          placeholder="Event Location"
          disabled={isLoading}
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : event.id ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

export default EventForm