import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi'
import './AuthPages.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (error) setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const url = "http://localhost:8056/api/users/signin";
    
    const promise = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    const data = await promise.text()
    console.log(data)

    if(data === "Login successful!") {
      navigate('/user')
    }else {
      setError(data)
    }
    
  }
  
  // Demo account login handlers
  const loginAsAdmin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const user = await login('admin@example.com', 'password')
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const loginAsUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const user = await login('user@example.com', 'password')
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
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
            
            {error && (
              <div className="auth-error">
                <FiAlertCircle className="auth-error-icon" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="auth-input-group">
                  <FiUser className="auth-input-icon" />
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
              
              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>Or use demo accounts</span>
            </div>
            
            <div className="auth-demo-buttons">
              <button 
                onClick={loginAsAdmin}
                className="btn btn-outline auth-demo-btn"
                disabled={isLoading}
              >
                Login as Admin
              </button>
              <button 
                onClick={loginAsUser}
                className="btn btn-outline auth-demo-btn"
                disabled={isLoading}
              >
                Login as User
              </button>
            </div>
            
            <p className="auth-redirect">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="auth-image-content">
            <h2>Manage Events with Ease</h2>
            <p>
              Access your dashboard to view, create, and manage events effortlessly.
            </p>
          </div>
          <div className="auth-image-overlay"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage