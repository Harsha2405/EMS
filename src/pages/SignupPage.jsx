import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import './AuthPages.css'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signup } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (error) setError('')
  }
  
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    // Check password strength (simple check)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    
    return true
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = "http://localhost:8056/api/users/signup";
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const user = await signup(
        formData.name,
        formData.email,
        formData.password,
        'user' // Default role is user
      )
      
      // Redirect to user dashboard after signup
      navigate('/user')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-content">
            <h2 className="auth-title">Create an Account</h2>
            <p className="auth-subtitle">Join to discover and book events</p>
            
            {error && (
              <div className="auth-error">
                <FiAlertCircle className="auth-error-icon" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="auth-input-group">
                  <FiUser className="auth-input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input auth-input"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="auth-input-group">
                  <FiMail className="auth-input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input auth-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="auth-input-group">
                  <FiLock className="auth-input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input auth-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="auth-input-group">
                  <FiLock className="auth-input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input auth-input"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            <p className="auth-redirect">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="auth-image-content">
            <h2>Join Our Event Community</h2>
            <p>
              Create an account to discover and register for exciting events.
            </p>
          </div>
          <div className="auth-image-overlay"></div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage