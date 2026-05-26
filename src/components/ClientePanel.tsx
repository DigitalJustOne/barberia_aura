import React from 'react';
import { ClientProfile, Cita } from '../types';
import { AvatarIcon } from './AvatarIcon';
import { PREDEFINED_AVATARS } from '../data';
import { Award, Zap, Briefcase, Calendar, Star, Sparkles } from 'lucide-react';

interface ClientePanelProps {
  client: ClientProfile;
  onChangeAvatar: (avatarId: string) => void;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  citas: Cita[];
}

export const ClientePanel: React.FC<ClientePanelProps> = ({
  client,
  onChangeAvatar,
  onChangeName,
  onChangePhone,
  citas,
}) => {
  const nextRewardPoints = 1000;
  const progressPercent = Math.min((client.points / nextRewardPoints) * 100, 100);

  // Filtrar citas del cliente actual
  const misCitas = citas.filter(
    (c) => c.clientEmail.toLowerCase() === client.email.toLowerCase()
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Saludo y bienvenida */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Miembro Exclusivo
          </span>
          <h2 className="font-serif text-3xl font-bold mt-1 text-text-matte">
            Bienvenido de vuelta,{' '}
            <span className="text-gold-premium">{client.name}</span>
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Gestiona tus citas de barbería y revisa tus beneficios del club.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-dark-card border border-zinc-800 p-4 rounded-xl">
          <AvatarIcon id={client.avatarId} className="w-14 h-14" />
          <div className="space-y-1">
            <div className="font-semibold text-xs text-text-muted uppercase tracking-wider">Perfil Socio Aura</div>
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                value={client.name}
                onChange={(e) => onChangeName(e.target.value)}
                placeholder="Tu nombre"
                className="bg-transparent border-0 border-b border-zinc-750 focus:border-gold-premium text-gold-premium text-sm py-0.5 px-0 font-bold focus:ring-0 w-44 transition-colors"
              />
              <div className="flex items-center gap-1 text-[11px] text-text-muted">
                <span>Tel / WA:</span>
                <input
                  type="text"
                  value={client.phone || ''}
                  onChange={(e) => onChangePhone(e.target.value)}
                  placeholder="Tu celular o WA"
                  className="bg-transparent border-0 border-b border-zinc-800 focus:border-gold-premium text-text-matte text-[11px] py-0 px-0 focus:ring-0 w-32 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo: Tarjeta dorada de fidelización */}
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-premium" /> Tarjeta Aura Club
          </h3>

          {/* Tarjeta Dorada de Lujo Física en CSS */}
          <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/40 bg-gradient-to-br from-[#1c1a17] via-[#2A2317] to-[#12110e] p-6 lg:p-8 shadow-2xl h-56 flex flex-col justify-between">
            {/* Brillo de Fondo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#d4af37]/20 to-transparent rounded-full filter blur-xl"></div>
            
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-[#d4af37] text-[10px] tracking-widest uppercase font-bold">Aura Loyalty Circle</p>
                <p className="text-stone-300 text-xs mt-1">Socio Rank: <span className="text-white font-bold">{client.membership}</span></p>
              </div>
              <div className="text-[#d4af37] font-semibold text-right">
                <span className="text-xs">PUNTOS</span>
                <p className="text-3xl font-extrabold tracking-tight scale-y-110">{client.points}</p>
              </div>
            </div>

            <div className="z-10">
              <div className="flex justify-between text-[11px] text-stone-300 font-medium mb-1.5">
                <span>Próxima recompensa (Corte Gratis)</span>
                <span>{client.points} / {nextRewardPoints} pts</span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full bg-black/50 rounded-full h-3 p-[2px] border border-stone-800">
                <div 
                  className="bg-gradient-to-r from-orange-400 via-yellow-400 to-[#d4af37] h-full rounded-full transition-all duration-1000 progress-bar-glow"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center z-10 border-t border-[#d4af37]/10 pt-3">
              <span className="text-[10px] uppercase font-mono tracking-tight text-stone-400">ID: AURA-992348</span>
              <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded text-white font-mono uppercase">CO - Soacha</span>
            </div>
          </div>

          {/* Selector de Avatares Predefinidos */}
          <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg space-y-4">
            <h4 className="font-serif text-sm font-bold text-text-matte flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-gold-premium" /> Selecciona tu Avatar de Estilo
            </h4>
            <p className="text-xs text-text-muted">
              Define tu estilo clásico o moderno para que nuestros Barberos reconozcan tus preferencias.
            </p>
            <div className="grid grid-cols-4 gap-3">
              {PREDEFINED_AVATARS.map((avatar) => {
                const isSelected = client.avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => onChangeAvatar(avatar.id)}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-gold-premium bg-gold-premium/5 shadow-gold'
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                    }`}
                  >
                    <AvatarIcon id={avatar.id} className="w-12 h-12" color={isSelected ? "#D4AF37" : "#A1A1A6"} />
                    <span className={`text-[9px] font-medium truncate w-full ${
                      isSelected ? 'text-gold-premium' : 'text-text-muted'
                    }`}>
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado derecho: Citas activas e historial */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg space-y-6 flex flex-col">
          <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-premium" /> Mis Reservas en Soacha
          </h3>

          {misCitas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 flex-grow border border-dashed border-zinc-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-sm font-medium text-text-matte">No tienes reservas activas</p>
              <p className="text-xs text-text-muted max-w-xs">
                ¡Agenda tu primer corte Aura! Deslízate abajo y selecciona la hora que mejor te convenga.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 flex-grow">
              {misCitas.map((cita) => (
                <div
                  key={cita.id}
                  className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-850 hover:border-zinc-800 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-gold-premium">
                      {cita.serviceName}
                    </span>
                    <p className="font-serif text-sm font-semibold text-text-matte">
                      Maestro: {cita.barberName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{cita.date}</span>
                      <span>{cita.time} H</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1.5">
                    <p className="text-xs font-bold text-text-matte">
                      ${cita.price.toLocaleString('es-CO')} COP
                    </p>
                    {cita.status === 'pendiente' && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-yellow-950 text-yellow-500 rounded border border-yellow-900/30">
                        Pendiente
                      </span>
                    )}
                    {cita.status === 'aceptada' && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-teal-950 text-teal-400 rounded border border-teal-900/30">
                        Aceptada
                      </span>
                    )}
                    {cita.status === 'finalizada' && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                          Finalizada
                        </span>
                        {cita.rating ? (
                          <div className="flex items-center gap-0.5 text-gold-premium">
                            {Array.from({ length: cita.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-gold-premium stroke-none" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] text-gold-premium animate-pulse">Pendiente de calificar</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
