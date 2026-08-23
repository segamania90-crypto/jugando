import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import GameModal from '../components/GameModal';
import FavoriteButton from '../components/FavoriteButton';
import { fetchGames } from '../api/rawg';

export default function Popular() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        if (search) {
          const data = await fetchGames({ search, ordering: '-added' });
          setGames(data);
        } else {
          const randomPage = Math.floor(Math.random() * 5) + 1;
          const data = await fetchGames({ ordering: '-added', page: randomPage });
          setGames(data);
        }
      } catch (err) {
        setError(t('common.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [search, t]);

  const resetSearch = () => setSearchInput('');

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-primary-accent">{t('popular.title')}</h1>

        <div className="mt-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('popular.searchPlaceholder')}
            className="w-full sm:max-w-md rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-accent"
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-white/10" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-24 px-4">
            <span className="text-6xl mb-4">🔍</span>
            <p className="text-xl font-semibold text-white/80">
              {t('popular.noResults')}
            </p>
            <p className="text-white/50 mt-2 max-w-sm">
              {t('popular.noResultsHint')}
            </p>
            <button
              onClick={resetSearch}
              className="text-left bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition w-full group"
            >
              {t('popular.resetSearch')}
            </button>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {games.map((game) => (
              <div key={game.id} className="relative">
                <button
                  onClick={() => setSelectedGameId(game.id)}
                  className="text-left bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition w-full group"
                >
                  <img
                    src={game.background_image}
                    alt={game.name}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-40 object-cover opacity-0 transition-all duration-500 group-hover:scale-105"
                    onLoad={(e) => e.target.classList.remove('opacity-0')}
                  />
                  <div className="p-3">
                    <h2 className="font-semibold text-primary-accent truncate">
                      {game.name}
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      {t('common.rating')}: {game.rating} / 5
                    </p>
                    <p className="text-sm text-white/60">
                      {game.genres?.map((g) => g.name).join(', ')}
                    </p>
                  </div>
                </button>

                <FavoriteButton
                  game={game}
                  className="absolute top-2 right-2 z-10"
                />
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