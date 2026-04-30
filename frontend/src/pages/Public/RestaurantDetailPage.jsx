import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import ReservationForm from '../../components/Public/ReservationForm';
import { Star, MapPin, ChevronLeft } from 'lucide-react';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      // Mock: como no hay endpoint :id, usamos el de todos y filtramos
      const res = await api.get('/restaurants');
      const found = res.data.find(r => r.id === id);
      setRestaurant(found);
    } catch (err) {
      console.error('Error fetching restaurant', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20 animate-pulse text-orange-500 font-bold">Cargando...</div>;
  if (!restaurant) return <div className="text-center py-20">Restaurante no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative h-64 w-full bg-gray-900">
        {restaurant.bannerUrl && (
          <img src={restaurant.bannerUrl} alt={restaurant.name} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute top-4 left-4">
          <Link to="/search" className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all block">
            <ChevronLeft size={24} />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{restaurant.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-500">
                <span className="flex items-center gap-1 font-bold text-orange-600">
                  <Star size={16} fill="currentColor" /> {restaurant.rating || '5.0'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {restaurant.address}
                </span>
              </div>
            </div>
            <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
              {restaurant.cuisineType}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4">Sobre nosotros</h2>
              <p className="text-gray-600 leading-relaxed">
                {restaurant.description || 'Bienvenido a nuestro restaurante. Disfruta de la mejor experiencia gastronómica con productos frescos y atención personalizada.'}
              </p>
              
              <h2 className="text-xl font-bold mt-8 mb-4">Menú destacado</h2>
              <div className="space-y-4">
                {restaurant.dishes?.map(dish => (
                  <div key={dish.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-bold">{dish.name}</div>
                      <div className="text-xs text-gray-500">{dish.description}</div>
                    </div>
                    <div className="font-black text-orange-600">${dish.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Reserva tu mesa</h2>
              <ReservationForm restaurantId={restaurant.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
