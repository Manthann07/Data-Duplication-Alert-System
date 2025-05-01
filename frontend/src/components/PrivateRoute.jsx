import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute; 