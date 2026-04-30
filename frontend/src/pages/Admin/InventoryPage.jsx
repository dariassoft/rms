import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const InventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: 'unit', stock: 0, costPerUnit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ingRes, supRes] = await Promise.all([
        api.get('/inventory/ingredients'),
        api.get('/inventory/suppliers')
      ]);
      setIngredients(ingRes.data);
      setSuppliers(supRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data', error);
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory/ingredients', newIngredient);
      setNewIngredient({ name: '', unit: 'unit', stock: 0, costPerUnit: 0 });
      fetchData();
    } catch (error) {
      console.error('Error adding ingredient', error);
    }
  };

  if (loading) return <div className="p-8">Cargando inventario...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestión de Inventario</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de nuevo ingrediente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Añadir Ingrediente</h2>
          <form onSubmit={handleAddIngredient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="l">Litros (l)</option>
                  <option value="unit">Unidad</option>
                  <option value="gr">Gramos (gr)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Inicial</label>
                <input
                  type="number"
                  step="0.001"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={newIngredient.stock}
                  onChange={(e) => setNewIngredient({ ...newIngredient, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Costo por Unidad</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={newIngredient.costPerUnit}
                onChange={(e) => setNewIngredient({ ...newIngredient, costPerUnit: Number(e.target.value) })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Añadir al Inventario
            </button>
          </form>
        </div>

        {/* Lista de ingredientes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stock Actual</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ingrediente</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ingredients.map((ing) => (
                  <tr key={ing.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{ing.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`font-medium ${ing.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {ing.stock} {ing.unit}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">${ing.costPerUnit}</td>
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

export default InventoryPage;
