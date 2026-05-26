import React, { useState } from 'react';
import { Cita, ClientProfile } from '../types';
import { BARBEROS_AURA, SERVICIOS_HAURA } from '../data';
import { DollarSign, Percent, Award, ShieldAlert, BarChart3, Users, PlusCircle, Check } from 'lucide-react';

interface AdminPanelProps {
  citas: Cita[];
  client: ClientProfile;
  onModifyPoints: (pointsDelta: number) => void;
  allClients: ClientProfile[];
  onAddPointAudit: (clientEmail: string, points: number, reason: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  citas,
  client,
  onModifyPoints,
  allClients,
  onAddPointAudit,
}) => {
  // KPI 1: Recaudación Total (COP)
  const totalCompletedCitasPrice = citas
    .filter((c) => c.status === 'finalizada')
    .reduce((sum, c) => sum + c.price, 0);

  // KPI 2: Efectividad por Barbero
  // Calculada como (# Citas Finalizadas / # Citas Totales) por cada barbero
  const barberEffectiveness = BARBEROS_AURA.map((barber) => {
    const totalBarberCitas = citas.filter((c) => c.barberName.toLowerCase() === barber.name.toLowerCase());
    const finishedBarberCitas = totalBarberCitas.filter((c) => c.status === 'finalizada');
    const rate = totalBarberCitas.length > 0 
      ? Math.round((finishedBarberCitas.length / totalBarberCitas.length) * 100) 
      : 85; // Default estimativo del barbero
    return { name: barber.name, rate };
  });

  // KPI 3: Clientes Top (Basado en puntos acumulados)
  const topClients = [...allClients].sort((a, b) => b.points - a.points);

  // Estado para auditar puntos manuales
  const [targetEmail, setTargetEmail] = useState<string>(allClients[0]?.email || '');
  const [pointsAmount, setPointsAmount] = useState<number>(100);
  const [auditReason, setAuditReason] = useState<string>('Bono de Fidelización San Mateo');
  const [auditSuccess, setAuditSuccess] = useState<string>('');

  const handleManualPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail) return;
    onAddPointAudit(targetEmail, pointsAmount, auditReason);
    setAuditSuccess(`¡Se añadieron ${pointsAmount} puntos exitosamente!`);
    setTimeout(() => setAuditSuccess(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado del Administrador */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" /> Consola de Suministros y KPI
        </span>
        <h2 className="font-serif text-3xl font-bold mt-1 text-text-matte">
          Gerencia & Dashboard Ejecutivo
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Puntos de venta de Soacha: Consulta el estatus financiero, audita puntos de fidelización y gestiona personal en tiempo real.
        </p>
      </div>

      {/* Grid de 3 KPIs Clave */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI 1: Recaudación Total */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg relative overflow-hidden flex items-center justify-between shadow-gold">
          <div className="space-y-2 z-10">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Recaudación Total (COP)</span>
            <p className="font-serif text-3xl font-bold text-text-matte">
              ${totalCompletedCitasPrice.toLocaleString('es-CO')}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium">
              ↑ +12.4% con respecto a la semana pasada
            </p>
          </div>
          <div className="p-4 bg-zinc-900 rounded-full z-10 text-gold-premium">
            <DollarSign className="w-7 h-7" />
          </div>
          {/* Luz dorada de fondo */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#d4af37]/5 filter blur-2xl rounded-full"></div>
        </div>

        {/* KPI 2: Efectividad de Personal */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Cumplimiento por Barbero</span>
              <p className="text-xs text-gold-premium font-medium">Efectividad de turnos finalizados</p>
            </div>
            <div className="p-2.5 bg-zinc-900 rounded-full text-blue-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2.5">
            {barberEffectiveness.map((be, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-matte">
                  <span>{be.name}</span>
                  <span>{be.rate}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gold-premium h-full rounded-full transition-all duration-700" 
                    style={{ width: `${be.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI 3: Clientes Top */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Clientes Top (Puntos)</span>
              <p className="text-xs text-gold-premium font-medium">Líderes de fidelización Soacha</p>
            </div>
            <div className="p-2.5 bg-zinc-900 rounded-full text-[#d4af37]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            {topClients.slice(0, 3).map((tc, index) => (
              <div key={index} className="flex items-center justify-between text-xs text-text-matte border-b border-zinc-850/50 pb-1.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gold-premium">#{index + 1}</span>
                  <span className="font-medium">{tc.name}</span>
                </div>
                <span className="font-mono text-gold-premium font-bold">{tc.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo: Auditoría de Puntos de Fidelidad */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg space-y-6">
          <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-gold-premium" /> Auditoría de Fidelización (Añadir Puntos)
          </h3>
          <p className="text-xs text-text-muted">
            Otorga puntos manualmente a tus clientes recurrentes de Soacha para motivar recompensas o corregir reclamos del sistema de estrellas.
          </p>

          <form onSubmit={handleManualPointsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">Seleccionar Cliente</label>
                <select
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-sm text-text-matte focus:ring-1 focus:ring-gold-premium"
                >
                  {allClients.map((c) => (
                    <option key={c.email} value={c.email}>
                      {c.name} ({c.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">Puntos a Otorgar</label>
                <input
                  type="number"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-text-matte focus:ring-1 focus:ring-gold-premium"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">Motivo / Concepto</label>
              <input
                type="text"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                placeholder="Ej. Visita #5, Disculpa de turno, etc."
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-text-matte focus:ring-1 focus:ring-gold-premium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold-premium hover:bg-gold-hover text-dark-premium hover:text-black font-semibold text-xs py-2 px-4 rounded transition-colors uppercase tracking-wider"
            >
              Auditar e Incrementar Puntos
            </button>

            {auditSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 py-2 px-3 rounded border border-emerald-900/30">
                <Check className="w-4 h-4" /> {auditSuccess}
              </div>
            )}
          </form>
        </div>

        {/* Lado derecho: Gestión de Personal / Barberos */}
        <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg space-y-6">
          <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-premium" /> Plantilla de Barberos
          </h3>
          <p className="text-xs text-text-muted">
            Vista administrativa rápida de barberos activos en el salón y métricas consolidadas.
          </p>

          <div className="space-y-4">
            {BARBEROS_AURA.map((barber) => (
              <div
                key={barber.id}
                className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-text-matte">{barber.name}</h4>
                    <p className="text-xs text-text-muted">{barber.specialty}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-gold-premium">Estrella: {barber.rating.toFixed(1)} ★</p>
                  <p className="text-[10px] text-text-muted">{barber.servicesThisMonth} servicios/mes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listado de Clientes Registrados en Soacha */}
      <div className="bg-dark-card border border-zinc-800 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-xl font-bold text-text-matte flex items-center gap-2">
          <Users className="w-5 h-5 text-gold-premium" /> Club de Clientes Registrados (Soacha)
        </h3>
        <p className="text-xs text-text-muted">
          Base de datos de caballeros inscritos en el Aura Loyalty Circle. Puedes ver su correo, puntos acumulados y contactarles directamente vía WhatsApp.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-matte border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-text-muted font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Socio</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Contacto / WhatsApp</th>
                <th className="py-3 px-4">Puntos</th>
                <th className="py-3 px-4 text-center">Rango Club</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {allClients.map((c) => (
                <tr key={c.email} className="border-b border-zinc-900/55 hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-text-matte">{c.name}</td>
                  <td className="py-3 px-4 text-text-muted font-mono">{c.email}</td>
                  <td className="py-3 px-4 text-gold-premium font-mono">{c.phone || 'Sin número registrado'}</td>
                  <td className="py-3 px-4 font-bold">{c.points} pts</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.membership === 'VIP' ? 'bg-purple-950 text-purple-400 border border-purple-900/30' :
                      c.membership === 'Gold' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {c.membership}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {c.phone ? (
                      <a
                        href={`https://wa.me/57${c.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/20 py-1 px-2.5 rounded border border-emerald-900/30 font-semibold"
                      >
                        Enviar WhatsApp
                      </a>
                    ) : (
                      <span className="text-text-muted italic text-[11px]">No disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
