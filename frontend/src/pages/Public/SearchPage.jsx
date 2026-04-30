import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    // Intentar obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Geolocation denied', err)
      );
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = { q: query };
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }
      const res = await api.get('/restaurants/search', { params });
      setResults(res.data);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── SEARCH HEADER ── */}
      <div className="bg-white shadow-sm pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              {t('search_button')}
            </button>
          </form>
          {coords && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium px-2">
              <MapPin size={14} />
              {t('search_using_location')}
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.length > 0 ? (
              results.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {r.logoUrl ? (
                    <img src={r.logoUrl} alt={r.name} className="w-24 h-24 rounded-xl object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 font-bold text-2xl">
                      {r.name[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xl text-gray-900">{r.name}</h3>
                      <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-sm font-bold">
                        <Star size={14} fill="currentColor" />
                        {r.rating || '5.0'}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{r.cuisineType} · {r.address}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.dishes?.slice(0, 3).map(d => (
                        <span key={d.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{t('search_no_results')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
