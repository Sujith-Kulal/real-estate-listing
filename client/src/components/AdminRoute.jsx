import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if user is logged in and is admin
  if (!currentUser || currentUser.role !== 'admin') {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }
  
  return children;
}
