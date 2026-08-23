import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-primary-dark text-white flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-primary-accent">404</h1>
      <p className="text-white/60">{t('notFound.title')}</p>
      <Link to="/" className="text-primary-highlight underline">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}