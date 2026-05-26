import React, { useState } from 'react';
import { Cita } from '../types';
import { Star, MessageSquare, XCircle, Award } from 'lucide-react';

interface RatingModalProps {
  cita: Cita;
  onSubmitRating: (id: string, stars: number, comment: string) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  cita,
  onSubmitRating,
  onClose,
}) => {
  const [stars, setStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(cita.id, stars, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-card border border-gold-premium/30 rounded-xl max-w-md w-full p-6 md:p-8 space-y-6 relative shadow-gold">
        
        {/* Cancel button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-gold-premium transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <span className="inline-block text-[10px] font-bold text-gold-premium bg-gold-premium/10 px-2 py-1 rounded border border-gold-premium/20 uppercase tracking-widest">
            Servicio Finalizado
          </span>
          <h3 className="font-serif text-2xl font-bold text-text-matte">¿Cómo estuvo tu corte?</h3>
          <p className="text-xs text-text-muted">
            Hola, Samuel. Haz finalizado tu cita de <span className="text-gold-premium font-medium">{cita.serviceName}</span> con el barbero <span className="text-gold-premium font-medium">{cita.barberName}</span>. Ayúdanos a calificarlo:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Estrellas interactiva */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoveredStars !== null ? star <= hoveredStars : star <= stars;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStars(star)}
                  onMouseEnter={() => setHoveredStars(star)}
                  onMouseLeave={() => setHoveredStars(null)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      active 
                        ? 'fill-gold-premium text-gold-premium' 
                        : 'text-zinc-700'
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Comentario */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gold-premium" /> Cuéntanos tu experiencia (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ej. Excelente degradado y excelente atención!"
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium text-sm text-text-matte rounded p-2.5 resize-none"
            />
          </div>

          {/* Recompensa */}
          <div className="bg-zinc-950 p-3 rounded border border-dashed border-gold-premium/20 flex items-center justify-between text-xs text-gold-premium">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Bono de Reseña Activo:
            </span>
            <span className="font-bold">+100 Puntos Loyalty</span>
          </div>

          <button
            type="submit"
            className="w-full bg-gold-premium hover:bg-gold-hover text-dark-premium font-bold py-3 rounded transition-colors text-xs tracking-widest uppercase"
          >
            Enviar Calificación
          </button>
        </form>
      </div>
    </div>
  );
};
