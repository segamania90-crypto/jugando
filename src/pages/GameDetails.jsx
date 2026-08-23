import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { fetchGameDetails } from '../api/rawg';

export default function GameDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGameDetails(id);
        setGame(data);
      } catch (err) {
        setError(t('gameModal.loadError'));
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id, t]);

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />
      <div className="px-6 py-4 max-w-4xl mx-auto">
        {loading && <p className="text-white/60 mt-4">{t('gameModal.loading')}</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {!loading && !error && game && (
          <>
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-72 object-cover rounded-lg"
            />
            <h1 className="text-3xl font-bold text-primary-accent mt-6">
              {game.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-white/70 mt-3">
              <span>{t('common.rating')}: {game.rating} / 5</span>
              <span>{t('gameModal.released')}: {game.released}</span>
              <span>
                {t('gameModal.platforms')}: {game.platforms?.map((p) => p.platform.name).join(', ')}
              </span>
            </div>

            <div
              className="text-white/80 mt-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: game.description }}
            />
          </>
        )}
      </div>
    </div>
  );
}