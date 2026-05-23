import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactElement; allowedRoles?: string[] }) => {
  const current = auth.current();
  const location = useLocation();

  if (!current) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(current.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
