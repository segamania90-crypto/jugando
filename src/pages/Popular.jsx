import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import GameModal from '../components/GameModal';
import FavoriteButton from '../components/FavoriteButton';
import { fetchGames } from '../api/rawg';

const MAX_LOAD_MORE = 4;

export default function Popular() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loadMoreCount, setLoadMoreCount] = useState(0);

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
          const data = await fetchGames({ search, ordering: '-added', page: 1 });
          setGames(data);
          setPage(1);
        } else {
          const randomPage = Math.floor(Math.random() * 5) + 1;
          const data = await fetchGames({ ordering: '-added', page: randomPage });
          setGames(data);
          setPage(randomPage);
        }
        setLoadMoreCount(0);
      } catch (err) {
        setError(t('common.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [search, t]);

  async function handleLoadMore() {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchGames({
        search: search || undefined,
        ordering: '-added',
        page: nextPage,
      });
      setGames((prev) => [...prev, ...data]);
      setPage(nextPage);
      setLoadMoreCount((prev) => prev + 1);
    } catch (err) {
      setError(t('landing.loadMoreError'));
    } finally {
      setLoadingMore(false);
    }
  }

  const canLoadMore = loadMoreCount < MAX_LOAD_MORE;

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
          <>
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

              {loadingMore &&
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`more-${i}`} className="bg-white/5 rounded-lg overflow-hidden animate-pulse">
                    <div className="w-full h-40 bg-white/10" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                ))}
            </div>

            {canLoadMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loadingMore ? t('landing.loading') : t('landing.more')}
                </button>
              </div>
            )}
          </>
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
