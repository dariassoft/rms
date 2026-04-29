import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const features = [
  'feature1', 'feature2', 'feature3',
  'feature4', 'feature5', 'feature6',
];

const roles = [
  { key: 'role_diner',      emoji: '👤' },
  { key: 'role_waiter',     emoji: '🛎️' },
  { key: 'role_chef',       emoji: '👨‍🍳' },
  { key: 'role_admin',      emoji: '🏪' },
  { key: 'role_superadmin', emoji: '🔑' },
];

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen font-sans text-gray-800">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-white font-extrabold text-xl tracking-tight">
            RMS <span className="text-orange-400">·</span>
          </span>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login">
              <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors">
                {t('nav_login')}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium">
            SaaS Multi-tenant · PWA Mobile-first
          </div>
          <h1 className="text-6xl sm:text-7xl font-black mb-2 tracking-tight">
            {t('hero_title')}
          </h1>
          <p className="text-xl sm:text-2xl text-orange-300 font-semibold mb-4">
            {t('hero_subtitle')}
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            {t('hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25">
              {t('hero_cta_search')}
            </button>
            <Link to="/login">
              <button className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg transition-all">
                {t('hero_cta_login')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all"
              >
                <div className="text-4xl mb-4">{t(`${f}_icon`)}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t(`${f}_title`)}</h3>
                <p className="text-gray-500 leading-relaxed">{t(`${f}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-12 text-gray-900">
            {t('roles_title')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {roles.map(({ key, emoji }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-6 w-44 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-bold text-gray-800 text-sm text-center">{t(key)}</span>
                <span className="text-xs text-gray-500 text-center">{t(`${key}_desc`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">{t('cta_title')}</h2>
          <p className="text-orange-100 text-lg mb-8">{t('cta_desc')}</p>
          <Link to="/login">
            <button className="px-10 py-4 rounded-xl bg-white text-orange-600 font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg">
              {t('cta_button')}
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} RMS - Restaurant Management System. {t('footer_rights')}</p>
      </footer>

    </div>
  );
};

export default HomePage;



