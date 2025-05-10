import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    // User is not logged in
    return <Navigate to="/login" replace />
  }
  
  // Check if user has the required role
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect admin to admin dashboard and user to user dashboard
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (currentUser.role === 'user') {
      return <Navigate to="/user" replace />
    } else {
      // Fallback to login for unexpected roles
      return <Navigate to="/login" replace />
    }
  }
  
  return children
}

export default ProtectedRoute