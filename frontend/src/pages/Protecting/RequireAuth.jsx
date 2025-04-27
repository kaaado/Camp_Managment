import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import LoadingSubmit from '../../components/Loading/loading';
import Err403 from '../../pages/Error/403';

export default function RequireAuth({ allowedRoles = [] }) {
  const { user, loading, isAuthenticated, hasRole } = useUser();

  if (loading) {
    return <LoadingSubmit />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
    return <Err403 role={user?.type} />;
  }

  return <Outlet />;
}