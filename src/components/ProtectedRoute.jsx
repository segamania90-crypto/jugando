import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Каталог, детальная страница и избранное доступны только вошедшим.
// Пока Firebase Auth не подключён (Этап 4), всегда редиректит на /login —
// это ожидаемо и исчезнет после интеграции авторизации.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
