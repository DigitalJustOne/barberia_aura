import React, { useState } from 'react';
import { Cita, Barber } from '../types';
import { BARBEROS_AURA } from '../data';
import { Star, CheckCircle, TrendingUp, Scissors, CalendarCheck, Check, Clock } from 'lucide-react';

interface BarberoPanelProps {
  citas: Cita[];
  onAcceptCita: (id: string) => void;
  onFinishCita: (id: string) => void;
}

export const BarberoPanel: React.FC<BarberoPanelProps> = ({
  citas,
  onAcceptCita,
  onFinishCita,
}) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBEROS_AURA[0].id);

  const activeBarber = BARBEROS_AURA.find((b) => b.id === selectedBarberId) || BARBEROS_AURA[0];

  // Filtrar citas del barbero seleccionado
  const citasDelBarbero = citas.filter(
    (c) => c.barberName.toLowerCase() === activeBarber.name.toLowerCase()
  );

  // Calcular métricas dinámicas
  const finalizadas = citasDelBarbero.filter((c) => c.status === 'finalizada');
  const calitativas = finalizadas.filter((c) => c.rating !== undefined);
  const averageRating = calitativas.length > 0 
    ? (calitativas.reduce((sum, c) => sum + (c.rating || 0), 0) / calitativas.length).toFixed(1)
    : activeBarber.rating.toFixed(1);

  const serviciosEsteMes = activeBarber.servicesThisMonth + finalizadas.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector de Barbero para Simular */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5" /> Agenda Técnica
          </span>
          <h2 className="font-serif text-3xl font-bold mt-1 text-text-matte">
            Panel de Barbero Profesional
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Gestiona tus turnos de hoy, acepta citas y finaliza servicios para acumular tus comisiones.
          </p>
        </div>

        {/* Dropdown de cambio de barbero para simulación */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase text-text-muted">Simulando como:</label>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="bg-dark-card border border-zinc-800 rounded px-3 py-2 text-sm text-text-matte focus:ring-1 focus:ring-gold-premium focus:border-gold-premium focus:outline-none cursor-pointer"
          >
            {BARBEROS_AURA.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjetas de Métricas del Barbero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Servicios Mes */}
        <div className="bg-dark-card border border-zinc-800 p-5 rounded-lg flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <p className="text-xs text-text-muted uppercase font-semibold">Servicios del Mes</p>
            <p className="text-3xl font-bold font-serif text-gold-premium">{serviciosEsteMes}</p>
          </div>
          <div className="p-3 bg-zinc-900 rounded-full z-10">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 filter blur-lg rounded-full"></div>
        </div>

        {/* KPI 2: Calificación Estrella */}
        <div className="bg-dark-card border border-zinc-800 p-5 rounded-lg flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <p className="text-xs text-text-muted uppercase font-semibold">Puntuación de Clientes</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold font-serif text-gold-premium">{averageRating}</p>
              <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-gold-premium stroke-none" />
                <span className="text-text-muted text-[10px]">({calitativas.length} valoraciones)</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-full z-10">
            <Star className="w-6 h-6 text-gold-premium" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 filter blur-lg rounded-full"></div>
        </div>

        {/* KPI 3: Especialidad */}
        <div className="bg-dark-card border border-zinc-800 p-5 rounded-lg flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <p className="text-xs text-text-muted uppercase font-semibold">Especialidad de Estilo</p>
            <p className="text-sm font-semibold text-text-matte truncate pr-4">{activeBarber.specialty}</p>
          </div>
          <div className="p-3 bg-zinc-900 rounded-full z-10">
            <Scissors className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 filter blur-lg rounded-full"></div>
        </div>
      </div>

      {/* Lista del Día */}
      <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-gold-premium" /> Agenda del Día ({citasDelBarbero.length})
          </h3>
          <span className="text-xs text-text-muted">Fecha Hoy: 2026-05-26</span>
        </div>

        {citasDelBarbero.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-850 rounded-lg">
            <Clock className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-matte font-medium">No hay citas asignadas para hoy</p>
            <p className="text-xs text-text-muted mt-1">Comparte tu enlace de agenda para captar clientes locales en Soacha.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-semibold text-text-muted uppercase bg-zinc-900/40">
                  <th className="py-4 px-4">Cliente</th>
                  <th className="py-4 px-4">Servicio</th>
                  <th className="py-4 px-4">Hora</th>
                  <th className="py-4 px-4">Precio (COP)</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-sm">
                {citasDelBarbero.map((cita) => (
                  <tr key={cita.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-text-matte">{cita.clientName}</p>
                        <p className="text-xs text-text-muted">{cita.clientEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gold-premium text-xs">{cita.serviceName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs font-medium px-2 py-1 bg-zinc-800 text-text-matte rounded">
                        {cita.time}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-text-matte font-mono">
                        ${cita.price.toLocaleString('es-CO')}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {cita.status === 'pendiente' && (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-yellow-500 bg-yellow-950/40 rounded border border-yellow-800/30">
                          Pendiente
                        </span>
                      )}
                      {cita.status === 'aceptada' && (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 rounded border border-emerald-800/30">
                          Aceptada
                        </span>
                      )}
                      {cita.status === 'finalizada' && (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 rounded">
                            Finalizada
                          </span>
                          {cita.rating && (
                            <div className="flex items-center gap-0.5 text-gold-premium">
                              {Array.from({ length: cita.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-gold-premium stroke-none" />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cita.status === 'pendiente' && (
                          <button
                            onClick={() => onAcceptCita(cita.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-1.5 px-3 rounded flex items-center gap-1 transition-all"
                          >
                            <Check className="w-3 h-3" /> Aceptar
                          </button>
                        )}
                        {cita.status === 'aceptada' && (
                          <button
                            onClick={() => onFinishCita(cita.id)}
                            className="bg-gold-premium hover:bg-gold-hover text-dark-premium font-semibold text-xs py-1.5 px-3 rounded flex items-center gap-1 transition-all"
                          >
                            <CheckCircle className="w-3 h-3" /> Finalizar Servicio
                          </button>
                        )}
                        {cita.status === 'finalizada' && (
                          <span className="text-zinc-600 text-xs italic">Servicio completado</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
