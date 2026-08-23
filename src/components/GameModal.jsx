import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchGameDetails } from '../api/rawg';
import FavoriteButton from './FavoriteButton';

export default function GameModal({ gameId, onClose }) {
  const { t } = useTranslation();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGameDetails(gameId);
        setGame(data);
      } catch (err) {
        setError(t('gameModal.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId, t]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-primary-dark border border-white/10 rounded-2xl max-w-lg w-full max-h-[75vh] overflow-hidden relative shadow-2xl shadow-black/50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 hover:scale-110 text-white rounded-full w-9 h-9 flex items-center justify-center transition shadow-md"
          aria-label={t('gameModal.close')}
        >
          ✕
        </button>

        {!loading && !error && game && (
          <FavoriteButton game={game} className="absolute top-4 left-4 z-10" />
        )}

        {loading && <p className="text-white/60 p-8">{t('gameModal.loading')}</p>}
        {error && <p className="text-red-400 p-8">{error}</p>}

        {!loading && !error && game && (
          <>
            <div className="rounded-t-2xl overflow-hidden shrink-0">
              <img
                src={game.background_image}
                alt={game.name}
                draggable={false}
                className="w-full h-44 object-cover"
              />
            </div>

            <div
              className="overflow-y-auto flex-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff30 transparent' }}
            >
              <div className="p-5">
                <h2 className="text-2xl font-bold text-primary-accent">
                  {game.name}
                </h2>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70 mt-3">
                  <span>⭐ {game.rating} / 5</span>
                  <span>📅 {game.released}</span>
                  <span>
                    🖥️ {game.platforms?.map((p) => p.platform.name).join(', ')}
                  </span>
                </div>

                <div className="h-px bg-white/10 my-5" />

                <div
                  className="text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}