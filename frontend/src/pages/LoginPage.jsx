import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const TEST_USERS = [
  {
    role: 'SuperAdmin',
    email: 'superadmin@rms.dev',
    password: 'rms1234!',
    emoji: '🔑',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'Admin Local',
    email: 'admin@labuena.rms.dev',
    password: 'rms1234!',
    emoji: '🏪',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'Mozo',
    email: 'mozo@labuena.rms.dev',
    password: 'rms1234!',
    emoji: '🛎️',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    role: 'Cocinero',
    email: 'chef@labuena.rms.dev',
    password: 'rms1234!',
    emoji: '👨‍🍳',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    role: 'Comensal',
    email: 'comensal@rms.dev',
    password: 'rms1234!',
    emoji: '👤',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
];

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fillUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex flex-col">

      {/* ── NAV ── */}
      <nav className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-extrabold text-xl tracking-tight hover:text-orange-400 transition-colors">
          RMS <span className="text-orange-400">·</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
            {t('login_back')}
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 px-4 py-10">

        {/* ── LOGIN FORM ── */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-6">{t('login_title')}</h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">
                  {t('login_email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">
                  {t('login_password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all transform hover:scale-[1.02] shadow-md shadow-orange-500/25"
              >
                {t('login_enter')}
              </button>
            </div>
          </div>
        </div>

        {/* ── TEST USERS ── */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              🧪 <span>{t('login_test_users')}</span>
            </h2>
            <div className="space-y-3">
              {TEST_USERS.map((user) => (
                <button
                  key={user.role}
                  onClick={() => fillUser(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-orange-50 border border-white/20 hover:border-orange-300 transition-all text-left group"
                >
                  <span className="text-2xl">{user.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${user.color}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.password}</p>
                  </div>
                  <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                    →
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-300 mt-4 text-center">
              Haz clic en un usuario para autocompletar el formulario
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;



