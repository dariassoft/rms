import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../services/api';

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
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener dominio actual para los usuarios de prueba
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  
  // Si estamos en restaurante.rms.dariassoft.com.ar (5 partes)
  // El baseDomain para emails debería ser rms.dariassoft.com.ar (últimas 4 partes)
  let baseDomain;
  if (domainParts.length >= 4) {
    baseDomain = domainParts.slice(-4).join('.');
  } else {
    baseDomain = hostname;
  }

  const fillUser = (user) => {
    // Ajustar el email al dominio base actual
    const emailParts = user.email.split('@');
    const localPart = emailParts[0];
    const emailDomain = emailParts[1]; // ej. labuena.rms.dev
    
    let adjustedEmail = user.email;
    if (emailDomain.includes('rms.dev')) {
      // Reemplazar rms.dev por el baseDomain actual, manteniendo cualquier subdominio
      const targetDomain = baseDomain === 'localhost' ? 'rms.dev' : baseDomain;
      
      // Si el baseDomain es rms.dariassoft.com.ar (4 partes)
      // No queremos que sea admin@labuena.rms.dariassoft.com.ar si el email original era admin@labuena.rms.dev
      // Pero SeedService usa `admin@labuena.${domain}`
      // Entonces si domain=rms.dariassoft.com.ar, el email es admin@labuena.rms.dariassoft.com.ar
      
      adjustedEmail = `${localPart}@${emailDomain.replace('rms.dev', targetDomain)}`;
    }
    
    setEmail(adjustedEmail);
    setPassword(user.password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.tenantId) {
        localStorage.setItem('tenantId', user.tenantId);
      }

      // Redirección basada en rol (coincidiendo con UserRole enum del backend)
      switch (user.role) {
        case 'SuperAdmin':
          navigate('/super-admin');
          break;
        case 'Admin Local':
          navigate('/admin');
          break;
        case 'Mozo':
          navigate('/waiter/pos');
          break;
        case 'Cocinero':
          navigate('/chef/kds');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-200 text-red-700 text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">
                  {t('login_email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all transform hover:scale-[1.02] shadow-md shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') || 'Cargando...' : t('login_enter')}
              </button>
            </form>
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



