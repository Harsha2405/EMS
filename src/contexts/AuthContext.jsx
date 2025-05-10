import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])
  
  // Mock login functionality
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === 'admin@example.com' && password === 'password') {
          const user = { id: 1, email, role: 'admin', name: 'Admin User' }
          setCurrentUser(user)
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user)
        } else if (email === 'user@example.com' && password === 'password') {
          const user = { id: 2, email, role: 'user', name: 'Regular User' }
          setCurrentUser(user)
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1000) // Simulate API delay
    })
  }
  
  // Mock signup functionality
  const signup = (name, email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation - in a real app, check if email already exists
        if (email && password) {
          const user = { 
            id: Math.floor(Math.random() * 1000), 
            email, 
            role, 
            name 
          }
          setCurrentUser(user)
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error('Please fill in all fields'))
        }
      }, 1000) // Simulate API delay
    })
  }
  
  // Logout functionality
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
    navigate('/')
  }
  
  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user'
  }
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}