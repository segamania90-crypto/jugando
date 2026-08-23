import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const linkClass =
    'px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 shadow-md hover:scale-105 transition';
  const primaryLinkClass =
    'px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-highlight text-primary-dark shadow-md hover:opacity-90 hover:scale-105 transition';
  const outlineLinkClass =
    'px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-accent text-primary-accent shadow-md hover:bg-primary-accent/10 hover:scale-105 transition';

  const LanguageSwitcher = ({ mobile }) => (
    <div className={`flex items-center gap-1 ${mobile ? 'justify-center py-1' : ''}`}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
            i18n.language === lang.code
              ? 'bg-primary-accent text-primary-dark'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-primary-dark/95 backdrop-blur border-b border-white/10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-2xl tracking-wide transition-transform hover:scale-105"
          style={{
            fontFamily: "'Russo One', sans-serif",
            background: 'linear-gradient(90deg, #fde047, #d946ef, #2dd4bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))',
          }}
        >
          <span role="img" aria-label="logo" style={{ filter: 'none' }}>🎮</span>
          Jugando
        </Link>

        {/* Кнопки для десктопа */}
          <div className="hidden lg:flex items-center gap-3 text-white">
          <Link to="/catalog" className={linkClass}>{t('navbar.catalog')}</Link>
          <Link to="/popular" className={linkClass}>{t('navbar.popular')}</Link>

          {isAuthenticated ? (
            <>
              <Link to="/favorites" className={linkClass}>{t('navbar.favorites')}</Link>
              <span className="text-white/50 text-sm px-2">{user.email}</span>
              <button onClick={handleLogout} className={outlineLinkClass}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={primaryLinkClass}>{t('navbar.login')}</Link>
              <Link to="/register" className={outlineLinkClass}>{t('navbar.register')}</Link>
            </>
          )}

          <LanguageSwitcher />
        </div>

        {/* Кнопка гамбургера для мобильного */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-white"
          aria-label="Открыть меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Выпадающее меню для мобильного */}
      {menuOpen && (
          <div className="lg:hidden flex flex-col gap-2 px-4 pb-4 text-white">
          <Link to="/catalog" onClick={closeMenu} className={linkClass + ' text-center'}>{t('navbar.catalog')}</Link>
          <Link to="/popular" onClick={closeMenu} className={linkClass + ' text-center'}>{t('navbar.popular')}</Link>

          {isAuthenticated ? (
            <>
              <Link to="/favorites" onClick={closeMenu} className={linkClass + ' text-center'}>{t('navbar.favorites')}</Link>
              <span className="text-white/50 text-sm text-center py-1">{user.email}</span>
              <button onClick={handleLogout} className={outlineLinkClass + ' text-center'}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={primaryLinkClass + ' text-center'}>{t('navbar.login')}</Link>
              <Link to="/register" onClick={closeMenu} className={outlineLinkClass + ' text-center'}>{t('navbar.register')}</Link>
            </>
          )}

          <LanguageSwitcher mobile />
        </div>
      )}
    </nav>
  );
}