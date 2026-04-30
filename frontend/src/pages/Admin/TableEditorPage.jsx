import React from 'react';
import { Link } from 'react-router-dom';
import TableMapEditor from '../../components/Admin/TableMapEditor';
import { useTranslation } from 'react-i18next';

const TableEditorPage = () => {
  const { t } = useTranslation();
  // En una app real, el restaurantId vendría del contexto de Auth (usuario admin de ese restaurante)
  const restaurantId = 'default-restaurant-id';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              ← Volver al Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin_table_editor') || 'Editor de Mesas'}</h1>
          </div>
          <div className="text-sm text-gray-500">Panel de Administración</div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <p className="text-gray-600">
            Diseña la distribución de tu salón arrastrando mesas y elementos decorativos.
            Puedes rotar cada elemento, agregar nombres y descripciones a las mesas,
            y crear muros, ventanas y puertas para reflejar la estructura real del espacio.
          </p>
        </div>
        <TableMapEditor restaurantId={restaurantId} />
      </main>
    </div>
  );
};

export default TableEditorPage;
