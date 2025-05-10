import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiCalendar, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, isUser } = useAuth()
  
  const goToDashboard = () => {
    if (isAdmin) {
      navigate('/admin')
    } else if (isUser) {
      navigate('/user')
    } else {
      navigate('/login')
    }
  }
  
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Seamless Event Management Experience
            </h1>
            <p className="hero-description">
              Organize, manage, and attend events with ease. Our platform provides
              everything you need for successful event planning and attendance.
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                <button className="btn btn-primary btn-large" onClick={goToDashboard}>
                  Go to Dashboard <FiArrowRight className="ml-1" />
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-primary btn-large" 
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </button>
                  <button 
                    className="btn btn-outline btn-large" 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Event Management"
            />
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiCalendar />
              </div>
              <h3>Event Management</h3>
              <p>
                Easily create, edit, and manage events with our intuitive dashboard.
                Keep track of all your events in one place.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers />
              </div>
              <h3>User-Friendly Booking</h3>
              <p>
                Browse available events and book your spot with just a few clicks.
                Manage your bookings and receive updates about upcoming events.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <h3>Seamless Experience</h3>
              <p>
                Enjoy a smooth experience with our responsive design and
                user-friendly interface, designed for both admins and attendees.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Managing Events?</h2>
            <p>
              Join our platform today and experience the easiest way to manage and attend events.
            </p>
            {isAuthenticated ? (
              <button className="btn btn-primary btn-large" onClick={goToDashboard}>
                Go to Dashboard <FiArrowRight className="ml-1" />
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-large" 
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2025 EventMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage