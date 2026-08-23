import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Popular from './pages/Popular';
import GameDetails from './pages/GameDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Mascot from './components/Mascot';

export default function App() {
  return (
    <>
      <Mascot />
      <Routes>
        {/* Открыто всем */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/games/:id" element={<GameDetails />} />

        {/* Только для вошедших пользователей */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}