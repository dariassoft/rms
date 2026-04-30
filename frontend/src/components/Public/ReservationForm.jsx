import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

const ReservationForm = ({ restaurantId }) => {
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [formData, setFormData] = useState({
    tableId: '',
    reservationTime: '',
    adults: 1,
    children: 0,
    babies: 0,
    notes: '',
    preOrderItems: [],
  });

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      const [tablesRes, restaurantRes] = await Promise.all([
        api.get(`/restaurants/${restaurantId}/tables`),
        api.get(`/restaurants`), // Debería ser un endpoint de un solo restaurante
      ]);
      setTables(tablesRes.data);
      // Mock de platos por ahora si el endpoint no está listo
      setDishes(restaurantRes.data[0]?.dishes || []);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleAddItem = (dish) => {
    const existing = formData.preOrderItems.find(item => item.dishId === dish.id);
    if (existing) {
      setFormData({
        ...formData,
        preOrderItems: formData.preOrderItems.map(item => 
          item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      });
    } else {
      setFormData({
        ...formData,
        preOrderItems: [...formData.preOrderItems, { dishId: dish.id, quantity: 1, priceAtOrder: dish.price, dish }]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reservations`, {
        ...formData,
        restaurantId,
      });
      alert('Reserva enviada!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Fecha y Hora</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={formData.reservationTime}
            onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Mesa</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.tableId}
            onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
            required
          >
            <option value="">Selecciona una mesa</option>
            {tables.map(t => (
              <option key={t.id} value={t.id}>Mesa {t.number} (Cap: {t.capacity})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Adultos</label>
          <input type="number" min="1" className="w-full p-2 border rounded" value={formData.adults} onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Niños</label>
          <input type="number" min="0" className="w-full p-2 border rounded" value={formData.children} onChange={(e) => setFormData({...formData, children: parseInt(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Bebés</label>
          <input type="number" min="0" className="w-full p-2 border rounded" value={formData.babies} onChange={(e) => setFormData({...formData, babies: parseInt(e.target.value)})} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Pre-pedido (Opcional)</label>
        <div className="border rounded p-4 max-h-40 overflow-y-auto space-y-2">
          {dishes.map(dish => (
            <div key={dish.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>{dish.name} - ${dish.price}</span>
              <button type="button" onClick={() => handleAddItem(dish)} className="bg-orange-500 text-white px-2 py-1 rounded text-xs">+</button>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Items seleccionados: {formData.preOrderItems.length}
        </div>
      </div>

      <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600">
        Confirmar Reserva
      </button>
    </form>
  );
};

export default ReservationForm;
