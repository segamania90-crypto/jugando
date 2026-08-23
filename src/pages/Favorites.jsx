import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import GameModal from '../components/GameModal';
import { useFavorites } from '../hooks/useFavorites';

export default function Favorites() {
  const { t } = useTranslation();
  const { favorites, loading, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(null);

  const filteredFavorites = favorites.filter((fav) =>
    fav.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-primary-accent">{t('favorites.title')}</h1>

        {!loading && favorites.length > 0 && (
          <div className="mt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('favorites.searchPlaceholder')}
              className="w-full sm:max-w-md rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-accent"
            />
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-white/10" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-24 px-4">
            <span className="text-6xl mb-4">☆</span>
            <p className="text-xl font-semibold text-white/80">
              {t('favorites.empty')}
            </p>
            <p className="text-white/50 mt-2 max-w-sm">
              {t('favorites.emptyHint')}
            </p>
            <Link
              to="/catalog"
              className="mt-6 rounded-lg bg-primary-highlight text-primary-dark font-semibold px-5 py-2.5 hover:opacity-90 transition"
            >
              {t('favorites.goToCatalog')}
            </Link>
          </div>
        )}

        {!loading && favorites.length > 0 && filteredFavorites.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-24 px-4">
            <span className="text-6xl mb-4">🔍</span>
            <p className="text-xl font-semibold text-white/80">
              {t('favorites.noResults')}
            </p>
            <p className="text-white/50 mt-2 max-w-sm">
              {t('favorites.noResultsHint')}
            </p>
          </div>
        )}

        {!loading && filteredFavorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {filteredFavorites.map((fav) => (
             <div
               key={fav.gameId}
               onClick={() => setSelectedGameId(fav.gameId)}
              className="relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition group cursor-pointer"
             >
                <img
                  src={fav.background_image}
                  alt={fav.name}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  onClick={(e) => {
                   e.stopPropagation();
                   toggleFavorite({ id: fav.gameId });
                }}
                  aria-label={t('favorites.removeFromFavorites')}
                  className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
                >
                  <span className="text-primary-highlight">⭐</span>
                </button>

                <div className="p-3">
                  <h2 className="font-semibold text-primary-accent truncate">
                    {fav.name}
                  </h2>
                  {fav.rating !== null && (
                    <p className="text-sm text-white/60 mt-1">
                      {t('common.rating')}: {fav.rating} / 5
                    </p>
                  )}
                  <p className="text-sm text-white/60">
                    {fav.genres?.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
                )}
      </div>

      {selectedGameId && (
        <GameModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
        />
      )}
    </div>
  );
}