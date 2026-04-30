import React, { useState } from 'react';
import { Star, X, MessageSquare, Heart } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, restaurantId, dishId, type = 'restaurant' }) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (score === 0) return alert("Por favor selecciona una puntuación");
    
    try {
      const data = {
        restaurantId,
        dishId,
        score,
        comment,
        type
      };
      // await axios.post('/api/ratings', data);
      alert("¡Gracias por tu valoración!");
      onClose();
    } catch (error) {
      alert("Error al enviar la valoración");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        
        <div className="p-6 text-center border-b border-gray-100">
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="inline-flex p-4 bg-orange-50 rounded-full mb-4">
            {type === 'restaurant' ? (
              <Heart className="text-orange-500" size={32} />
            ) : (
              <MessageSquare className="text-orange-500" size={32} />
            )}
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {type === 'restaurant' ? '¿Qué te pareció el lugar?' : '¿Te gustó el plato?'}
          </h2>
          <p className="text-gray-500 mt-1">Tu opinión nos ayuda a mejorar</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setScore(star)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={48}
                  className={`transition-colors ${
                    (hover || score) >= star ? 'fill-orange-400 text-orange-400' : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Comentario (opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe algo sobre tu experiencia..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            ENVIAR VALORACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
