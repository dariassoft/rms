import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Clock, CheckCircle, ChefHat, Bell } from 'lucide-react';
import api, { getBaseWsUrl } from '../../services/api';

const KDSPage = () => {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const tenantId = user?.tenantId || 'public';

    // En producción usaríamos la URL de la API y el token
    const newSocket = io(getBaseWsUrl(), {
      auth: {
        token: localStorage.getItem('token')
      }
    });
    setSocket(newSocket);

    // Unirse a la sala del restaurant
    newSocket.emit('joinRestaurant', tenantId);

    newSocket.on('newOrder', (order) => {
      setOrders(prev => [...prev, order]);
      new Audio('/notification.mp3').play().catch(() => {}); // Intentar sonido
    });

    newSocket.on('orderStatusUpdated', (update) => {
      // Actualizar localmente si es necesario
      if (update.type === 'item') {
        setOrders(prev => prev.map(order => {
          if (order.id === update.orderId) {
            return {
              ...order,
              items: order.items.map(item => item.id === update.id ? { ...item, status: update.status } : item)
            };
          }
          return order;
        }));
      } else if (update.type === 'order' && update.status === 'ready') {
        setOrders(prev => prev.filter(o => o.id !== update.id));
      }
    });

    // Cargar órdenes iniciales reales
    api.get('/orders/kitchen').then(res => {
      setOrders(res.data);
    }).catch(err => console.error("Error loading kitchen orders", err));

    return () => newSocket.close();
  }, []);

  const markItemReady = async (orderId, itemId) => {
    try {
      await api.patch(`/orders/items/${itemId}/status`, { status: 'ready' });
      // El socket notificará el cambio, pero podemos actualizar localmente para mayor rapidez
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map(item => item.id === itemId ? { ...item, status: 'ready' } : item)
          };
        }
        return order;
      }));
    } catch (err) {
      console.error("Error updating item status", err);
    }
  };

  const markOrderReady = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'ready' });
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <ChefHat className="text-orange-500" size={40} /> KDS - Monitor de Cocina
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-400">Órdenes Activas</p>
            <p className="text-2xl font-bold text-orange-400">{orders.length}</p>
          </div>
          <Bell className="text-gray-500 animate-pulse" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {orders.map(order => {
          const timeElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60));
          const isUrgent = timeElapsed > 15;

          return (
            <div key={order.id} className={`bg-gray-800 rounded-3xl overflow-hidden border-2 transition-all ${isUrgent ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-gray-700'}`}>
              <div className={`p-4 flex justify-between items-center ${isUrgent ? 'bg-red-500' : 'bg-gray-700'}`}>
                <span className="text-2xl font-black">Mesa {order.table.number}</span>
                <span className="flex items-center gap-1 font-bold">
                  <Clock size={18} /> {timeElapsed} min
                </span>
              </div>
              
              <div className="p-4 space-y-4 min-h-[200px]">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-sm font-black">x{item.quantity}</span>
                        <span className={`font-bold ${item.status === 'ready' ? 'line-through text-gray-500' : 'text-gray-100 text-lg'}`}>
                          {item.dish.name}
                        </span>
                      </div>
                      {item.notes && <p className="text-sm text-orange-300 italic ml-10 mt-1">"{item.notes}"</p>}
                    </div>
                    {item.status !== 'ready' && (
                      <button 
                        onClick={() => markItemReady(order.id, item.id)}
                        className="bg-gray-700 hover:bg-green-600 p-2 rounded-xl transition-colors"
                      >
                        <CheckCircle size={24} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-800/50">
                <button 
                  onClick={() => markOrderReady(order.id)}
                  className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-lg transition-all active:scale-95"
                >
                  TODO LISTO
                </button>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-600">
            <ChefHat size={80} className="mb-4 opacity-20" />
            <p className="text-2xl font-bold">No hay comandas pendientes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KDSPage;
