import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import LoadingSubmit from '../../../components/Loading/loading';
import Err403 from '../Error/403';

export default function RequireAuth({ allowedRoles }) {  
  const { user, loading, isAuthenticated, hasRole } = useUser();
  if (loading) {
    return <LoadingSubmit />;
  } 

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const hasAllowedRole = allowedRoles?.includes(user.type);
  
  if (!hasAllowedRole) {
    return <Err403 role={user.type} />;
  }



  return <Outlet />;
}