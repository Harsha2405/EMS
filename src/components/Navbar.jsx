import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiLogOut, FiMenu, FiX, FiCalendar } from 'react-icons/fi'
import './Navbar.css'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentUser, logout, isAdmin, isUser } = useAuth()
  const location = useLocation()
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }
  
  const getDashboardLink = () => {
    if (isAdmin) return '/admin'
    if (isUser) return '/user'
    return '/'
  }
  
  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiCalendar className="navbar-logo-icon" />
          <span>EventMaster</span>
        </Link>
        
        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>
        
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          
          {currentUser ? (
            <>
              <li className="navbar-item">
                <Link to={getDashboardLink()} className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item navbar-user">
                <div className="navbar-user-info">
                  <FiUser className="navbar-user-icon" />
                  <span>{currentUser.name}</span>
                </div>
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-role">
                    Role: {currentUser.role}
                  </div>
                  <button onClick={handleLogout} className="navbar-logout">
                    <FiLogOut className="navbar-logout-icon" />
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/signup" className="navbar-link navbar-link-btn">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar