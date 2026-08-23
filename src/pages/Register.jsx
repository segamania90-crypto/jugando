import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';

const ERROR_KEYS = {
  'auth/email-already-in-use': 'emailInUse',
  'auth/invalid-email': 'invalidEmail',
  'auth/weak-password': 'weakPassword',
};

export default function Register() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/catalog');
    } catch (err) {
      const key = ERROR_KEYS[err.code];
      setError(key ? t(`auth.errors.${key}`) : t('auth.errors.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-primary-accent">{t('auth.registerTitle')}</h1>

        {error && (
          <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300">{error}</p>
        )}

        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-accent"
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-highlight py-2 font-semibold text-primary-dark hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? t('auth.registering') : t('auth.registerButton')}
        </button>

        <p className="text-center text-sm text-white/60">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-primary-highlight underline">
            {t('auth.goToLogin')}
          </Link>
                </p>
      </form>
      </div>
    </div>
  );
}