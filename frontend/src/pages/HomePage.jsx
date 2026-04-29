import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">FlowTable RMS</h1>
      <p className="text-lg mb-8">La solución integral para la gestión de tu restaurante.</p>
      <Link to="/login">
        <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Iniciar Sesión
        </button>
      </Link>
    </div>
  );
};

export default HomePage;

