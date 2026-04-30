import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, restRes] = await Promise.all([
        api.get('/super-admin/stats'),
        api.get('/super-admin/restaurants')
      ]);
      setStats(statsRes.data);
      setRestaurants(restRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SuperAdmin data', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando Dashboard de SuperAdmin...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard SuperAdmin</h1>
          <p className="text-gray-600">Analíticas globales del SaaS</p>
        </header>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Restaurantes Registrados</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalRestaurants}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Usuarios Totales</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Ingresos Globales (SaaS)</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">${Number(stats.totalRevenue).toFixed(2)}</p>
          </div>
        </div>

        {/* Lista de Restaurantes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Restaurantes Activos</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Nuevo Onboarding</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subdominio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((rest) => (
                  <tr key={rest.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{rest.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-sm">{rest.subdomain}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Premium</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">Gestionar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
