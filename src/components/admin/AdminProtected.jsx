import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../../utils/adminAuth.js';

export default function AdminProtected() {
  const isAuth = isAdminAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
