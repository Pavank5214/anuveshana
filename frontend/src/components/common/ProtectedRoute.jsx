import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }
  return children;
}

export default ProtectedRoute