import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoriteButton({ game, className = '' }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);

  const active = isAuthenticated && isFavorite(game.id);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    toggleFavorite(game);
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        aria-label={active ? t('toast.removeFromFavorites') : t('toast.addToFavorites')}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 hover:scale-110 transition"
      >
        <span className={active ? 'text-primary-highlight' : 'text-white'}>
          {active ? '⭐' : '☆'}
        </span>
      </button>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50 whitespace-nowrap">
          {t('toast.loginToSave')}
        </div>
      )}
    </div>
  );
}