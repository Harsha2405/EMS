import { Link } from 'react-router-dom'
import { FiHome, FiAlertTriangle } from 'react-icons/fi'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-icon">
          <FiAlertTriangle />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-icon">
          <FiHome />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound