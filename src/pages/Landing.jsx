import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import GameModal from '../components/GameModal';
import FavoriteButton from '../components/FavoriteButton';
import { fetchGames } from '../api/rawg';
import { useAuth } from '../hooks/useAuth';

const VIDEO_COUNT = 4;
const PREVIEW_COUNT = 8;
const MAX_LOAD_MORE = 4;

export default function Landing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [page, setPage] = useState(1);
  const [loadMoreCount, setLoadMoreCount] = useState(0);
  const videoIndex = useRef(Math.floor(Math.random() * VIDEO_COUNT) + 1);

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchGames({ page: 1 });
        setGames(data.slice(0, PREVIEW_COUNT));
      } catch (err) {
        setError(t('common.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [t]);

  async function handleLoadMore() {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchGames({ page: nextPage });
      setGames((prev) => [...prev, ...data.slice(0, PREVIEW_COUNT)]);
      setPage(nextPage);
      setLoadMoreCount((prev) => prev + 1);
    } catch (err) {
      setError(t('landing.loadMoreError'));
    } finally {
      setLoadingMore(false);
    }
  }

  const canLoadMore = loadMoreCount < MAX_LOAD_MORE;

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />

      {/* Видео-фон на первом экране */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <video
          key={videoIndex.current}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`/videos/bg-${videoIndex.current}.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-primary-dark/60" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <p className="max-w-md text-white/90 text-lg mb-6">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/catalog"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-primary-highlight text-primary-dark shadow-md hover:opacity-90 hover:scale-105 transition"
            >
              {t('landing.watchCatalog')}
            </Link>

            {isAuthenticated ? (
              <Link
                to="/favorites"
                className="px-6 py-2.5 rounded-full text-sm font-semibold border border-primary-accent text-primary-accent shadow-md hover:bg-primary-accent/10 hover:scale-105 transition"
              >
                {t('landing.myFavorites')}
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full text-sm font-semibold border border-primary-accent text-primary-accent shadow-md hover:bg-primary-accent/10 hover:scale-105 transition"
              >
                {t('landing.register')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4">
        <div className="w-full max-w-6xl py-12">
          <h2 className="text-xl font-bold text-primary-accent mb-6 text-center">
            {t('landing.popularNow')}
          </h2>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <p className="text-red-400 text-center">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    className="relative text-left bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition cursor-pointer group"
                  >
                    <FavoriteButton game={game} className="absolute top-2 right-2 z-10" />
                    <img
                      src={game.background_image}
                      alt={game.name}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-40 object-cover opacity-0 transition-all duration-500 group-hover:scale-105"
                      onLoad={(e) => e.target.classList.remove('opacity-0')}
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-primary-accent truncate">
                        {game.name}
                      </h3>
                      <p className="text-sm text-white/60 mt-1">
                        {t('common.rating')}: {game.rating} / 5
                      </p>
                      <p className="text-sm text-white/60">
                        {game.genres?.map((g) => g.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}

                {loadingMore &&
                  Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
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

              <div className="flex justify-center mt-8">
                {canLoadMore ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loadingMore ? t('landing.loading') : t('landing.more')}
                  </button>
                ) : (
                  <Link
                    to="/catalog"
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 shadow-md hover:scale-105 transition"
                  >
                    {t('landing.watchFullCatalog')}
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
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