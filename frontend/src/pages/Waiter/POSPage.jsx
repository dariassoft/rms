import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShoppingCart, Plus, Minus, Send, Trash2, Table as TableIcon } from 'lucide-react';

const POSPage = () => {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/restaurants/me');
        const restaurant = res.data;
        if (restaurant) {
          setTables(restaurant.tables || []);
          setMenu(restaurant.dishes || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching POS data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId) => {
    setCart(prev => prev.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === dishId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sendOrder = async () => {
    if (!selectedTable) return alert("Selecciona una mesa");
    if (cart.length === 0) return alert("El carrito está vacío");

    try {
      const res = await api.get('/restaurants/me');
      const restaurant = res.data;

      const orderData = {
        restaurantId: restaurant.id,
        tableId: selectedTable.id,
        items: cart.map(i => ({ dishId: i.id, quantity: i.quantity, price: i.price })),
      };
      
      await api.post('/orders', orderData);
      alert("Pedido enviado a cocina!");
      setCart([]);
      setSelectedTable(null);
    } catch (error) {
      alert("Error al enviar el pedido");
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando POS...</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 font-sans">
      
      {/* ── LEFT: TABLES & MENU ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Tables Section */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TableIcon className="text-orange-500" /> Mesas
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {tables.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(t)}
                className={`h-16 rounded-xl font-bold border-2 transition-all ${
                  selectedTable?.id === t.id 
                    ? 'bg-orange-500 text-white border-orange-600 shadow-lg' 
                    : t.status === 'occupied' 
                      ? 'bg-red-100 text-red-600 border-red-200' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                {t.number}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Menú</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {menu.map(dish => (
              <div 
                key={dish.id}
                onClick={() => addToCart(dish)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{dish.name}</h3>
                  <p className="text-orange-600 font-semibold">${dish.price}</p>
                </div>
                <button className="bg-orange-100 text-orange-600 p-2 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── RIGHT: CART / ORDER SUMMARY ── */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <ShoppingCart className="text-orange-500" /> Comanda
          </h2>
          {selectedTable ? (
            <p className="text-orange-600 font-bold mt-1">Mesa {selectedTable.number}</p>
          ) : (
            <p className="text-gray-400 mt-1">Selecciona una mesa</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingCart size={48} className="mb-2" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0 mr-2">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-orange-500"><Minus size={16} /></button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-orange-500"><Plus size={16} /></button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-xl font-black">
            <span>Total:</span>
            <span className="text-orange-600">${total}</span>
          </div>
          <button
            onClick={sendOrder}
            disabled={!selectedTable || cart.length === 0}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-black text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <Send size={20} /> ENVIAR A COCINA
          </button>
        </div>
      </div>

    </div>
  );
};

export default POSPage;
