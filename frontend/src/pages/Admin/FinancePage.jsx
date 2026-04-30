import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FinancePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/finance/invoices');
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Cargando finanzas...</div>;

  const totalRevenue = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalTips = invoices.reduce((acc, inv) => acc + Number(inv.tip), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestión Financiera</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
          <p className="text-blue-600 text-sm font-semibold uppercase">Ingresos Totales</p>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
          <p className="text-green-600 text-sm font-semibold uppercase">Propinas Acumuladas</p>
          <p className="text-3xl font-bold">${totalTips.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
          <p className="text-purple-600 text-sm font-semibold uppercase">Total Facturas</p>
          <p className="text-3xl font-bold">{invoices.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Historial de Facturación</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CAE (AFIP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-2 whitespace-nowrap font-mono text-sm">{inv.invoiceNumber}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-bold text-sm">${inv.amount}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm capitalize">{inv.paymentMethod}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 font-mono">{inv.cae}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
