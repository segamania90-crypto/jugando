import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import GameModal from '../components/GameModal';
import FavoriteButton from '../components/FavoriteButton';
import { fetchGames, fetchGenres, fetchPlatforms } from '../api/rawg';

const MAX_LOAD_MORE = 4;

export default function Catalog() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [page, setPage] = useState(1);
  const [loadMoreCount, setLoadMoreCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [genresData, platformsData] = await Promise.all([
          fetchGenres(),
          fetchPlatforms(),
        ]);
        setGenres(genresData);
        setPlatforms(platformsData);
      } catch (err) {
        // Если список фильтров не загрузился, просто не показываем их
      }
    }

    loadFilters();
  }, []);

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        const hasSearchOrFilters = Boolean(search || genre || platform);
        const data = await fetchGames({
          search,
          genres: genre,
          platforms: platform,
          ordering: hasSearchOrFilters ? '-added' : '',
          page: 1,
        });
        setGames(data);
        setPage(1);
        setLoadMoreCount(0);
      } catch (err) {
        setError(t('common.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [search, genre, platform, t]);

  async function handleLoadMore() {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const hasSearchOrFilters = Boolean(search || genre || platform);
      const data = await fetchGames({
        search,
        genres: genre,
        platforms: platform,
        ordering: hasSearchOrFilters ? '-added' : '',
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

  const hasActiveFilters = Boolean(searchInput || genre || platform);

  const resetFilters = () => {
    setSearchInput('');
    setGenre('');
    setPlatform('');
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-primary-accent">{t('catalog.title')}</h1>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            className="w-full sm:max-w-md rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-accent"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white hover:bg-white/10 hover:border-white/20 transition focus:outline-none focus:border-primary-accent"
          >
            <option value="" className="bg-primary-dark">{t('catalog.allGenres')}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug} className="bg-primary-dark">
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-primary-accent"
          >
            <option value="" className="bg-primary-dark">{t('catalog.allPlatforms')}</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id} className="bg-primary-dark">
                {p.name}
              </option>
            ))}
          </select>
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
              {t('catalog.noResults')}
            </p>
            <p className="text-white/50 mt-2 max-w-sm">
              {t('catalog.noResultsHint')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-6 rounded-lg bg-primary-highlight text-primary-dark font-semibold px-5 py-2.5 hover:opacity-90 transition"
              >
                {t('catalog.resetFilters')}
              </button>
            )}
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
