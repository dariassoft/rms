import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    activeReservations: 0,
    tablesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Obtener datos del restaurante
      const restaurantRes = await api.get('/restaurants/me');
      setRestaurant(restaurantRes.data);

      // TODO: Implementar endpoints para estadísticas
      // Por ahora valores de ejemplo
      setStats({
        todayOrders: 0,
        todayRevenue: 0,
        activeReservations: 0,
        tablesCount: 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Editor de Mesas',
      description: 'Gestiona la distribución de mesas',
      icon: '🪑',
      path: '/admin/tables',
      color: 'bg-blue-500',
    },
    {
      title: 'Inventario',
      description: 'Control de stock e ingredientes',
      icon: '📦',
      path: '/admin/inventory',
      color: 'bg-green-500',
    },
    {
      title: 'Finanzas',
      description: 'Facturas y reportes financieros',
      icon: '💰',
      path: '/admin/finance',
      color: 'bg-purple-500',
    },
  ];

  const statCards = [
    {
      title: 'Pedidos Hoy',
      value: stats.todayOrders,
      icon: '🛎️',
      color: 'bg-orange-100 text-orange-800',
      border: 'border-orange-200',
    },
    {
      title: 'Ingresos Hoy',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: '💵',
      color: 'bg-green-100 text-green-800',
      border: 'border-green-200',
    },
    {
      title: 'Reservas Activas',
      value: stats.activeReservations,
      icon: '📅',
      color: 'bg-blue-100 text-blue-800',
      border: 'border-blue-200',
    },
    {
      title: 'Total Mesas',
      value: stats.tablesCount,
      icon: '🪑',
      color: 'bg-purple-100 text-purple-800',
      border: 'border-purple-200',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              {restaurant && (
                <p className="text-sm text-gray-600 mt-1">
                  {restaurant.name}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border ${stat.border} p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.color} rounded-full w-16 h-16 flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-300 transition-all group"
              >
                <div className={`${action.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="mt-4 flex items-center text-orange-500 font-semibold text-sm">
                  Ir al módulo
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📊</p>
            <p>Próximamente: Actividad reciente y gráficos</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
