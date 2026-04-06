import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ adminOnly = false }) {
  const { currentUser, userRole } = useAuth();

  // Si hay usuario pero el rol todavía no se ha cargado, esperamos para evitar rebotes
  if (currentUser && userRole === null) {
    return null; // O un spinner si prefieres
  }

  // Si no hay usuario logueado, enviar al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para admins y el usuario no tiene el rol, enviar al landing
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, renderiza el componente hijo
  return <Outlet />;
}
