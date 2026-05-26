import React, { useState, useEffect } from 'react';
import { Service, Barber, Cita } from '../types';
import { SERVICIOS_HAURA, BARBEROS_AURA } from '../data';
import { Calendar, Clock, Scissors, User, Mail, Check, Sparkles, Phone } from 'lucide-react';

interface BookingFormProps {
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
  onBookingSuccess: (cita: Cita) => void;
  currentUser: { name: string; email: string; phone: string; avatarId: string } | null;
  onClickAuth?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  onSelectService,
  onBookingSuccess,
  currentUser,
  onClickAuth,
}) => {
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>(BARBEROS_AURA[0].name);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('09:00');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Sincronizar datos de usuario si está logueado
  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientEmail(currentUser.email);
      setClientPhone(currentUser.phone || '');
    } else {
      setClientName('');
      setClientEmail('');
      setClientPhone('');
    }
  }, [currentUser]);

  // Valores de horas disponibles comunes en Soacha
  const HORAS_AURA_BASE = [
    '09:00', '10:00', '11:00', '12:00', '13:30', '14:30', 
    '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'
  ];

  // Cargar disponibilidad desde backend
  useEffect(() => {
    if (!bookingDate) {
      setBusySlots([]);
      return;
    }
    
    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      try {
        const response = await fetch(`/api/availability?date=${bookingDate}`);
        if (response.ok) {
          const data = await response.json();
          setBusySlots(data.busySlots || []);
        } else {
          setBusySlots([]);
        }
      } catch (error) {
        console.error('Error fetching availability', error);
        setBusySlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    fetchAvailability();
  }, [bookingDate]);

  const today = new Date();
  // Format local date to YYYY-MM-DD for comparison (handling timezone correctly for Colombia/local)
  // Or simply parse the bookingDate and compare with today.
  const isToday = bookingDate === today.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }) || bookingDate === today.toISOString().split('T')[0];
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();

  const horasDisponibles = HORAS_AURA_BASE.filter(hora => {
    if (busySlots.includes(hora)) return false;
    if (isToday) {
      const [h, m] = hora.split(':').map(Number);
      if (h < currentHour || (h === currentHour && m <= currentMinutes)) {
        return false;
      }
    }
    return true;
  });

  // Ensure selected time is still valid
  useEffect(() => {
    if (horasDisponibles.length > 0 && !horasDisponibles.includes(bookingTime)) {
      setBookingTime(horasDisponibles[0]);
    }
  }, [horasDisponibles, bookingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName || !clientEmail || !clientPhone || !bookingDate || !bookingTime) {
      alert('Por favor completa todos los campos del formulario.');
      return;
    }

    setIsSubmitting(true);

    const nuevaCita: Cita = {
      id: 'cita-' + Math.random().toString(36).substring(2, 9),
      clientName,
      clientEmail,
      clientPhone,
      clientAvatar: currentUser?.avatarId || 'avatar-gentleman',
      barberName: selectedBarber,
      serviceName: selectedService.name,
      price: selectedService.price,
      date: bookingDate,
      time: bookingTime,
      status: 'pendiente'
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCita)
      });
      
      const data = await res.json().catch(() => null);
      
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.error) ? data.error : 'Error al conectar con el servidor API.');
      }
    } catch (e: any) {
      alert("Error al reservar la cita: " + (e.message || "Verifique la base de datos y el calendario."));
      setIsSubmitting(false);
      return;
    }

    onBookingSuccess(nuevaCita);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onSelectService(null); // Cerrar formulario
      setIsSubmitting(false);
    }, 4000);
  };

  return (
    <div className="bg-dark-card border border-zinc-800 rounded-xl p-6 md:p-8 shadow-gold relative overflow-hidden transition-all duration-300">
      {showConfetti && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gold-premium/10 flex items-center justify-center border border-gold-premium animate-bounce">
            <Check className="w-8 h-8 text-gold-premium" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-text-matte">¡Reserva Registrada, Campeón!</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Tu cita de <span className="text-gold-premium font-medium">{selectedService?.name}</span> para el <span className="text-text-matte font-medium">{bookingDate}</span> a las <span className="text-text-matte font-medium">{bookingTime}</span> con {selectedBarber} ha sido recibida. El barbero te enviará la confirmación vía WhatsApp al número de celular <span className="text-gold-premium font-medium">{clientPhone}</span>.
          </p>
          <p className="text-xs text-gold-premium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> ¡Has acumulado +150 puntos de fidelización!
          </p>
        </div>
      )}

      <h3 className="font-serif text-2xl font-bold text-text-matte border-b border-zinc-800 pb-4 mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gold-premium" /> Agendar Cita Premium
      </h3>

      {!currentUser && onClickAuth && (
        <div className="bg-gold-premium/5 border border-gold-premium/15 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs animate-fade-in">
          <div className="space-y-1">
            <p className="text-text-matte font-bold flex items-center gap-1 text-gold-premium uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> ¿Deseas acumular hoy +250 puntos VIP?
            </p>
            <p className="text-text-muted leading-relaxed">
              Inscríbete gratis al <strong className="text-text-matte">Aura Loyalty Circle</strong> antes de reservar. Recibirás <strong className="text-gold-premium font-semibold">100 puntos de bienvenida</strong> de inmediato, más <strong className="text-gold-premium font-semibold">150 puntos por agendar esta cita</strong>. Canjeables por servicios gratis y café premium.
            </p>
          </div>
          <button
            type="button"
            onClick={onClickAuth}
            className="whitespace-nowrap bg-gold-premium/10 hover:bg-gold-premium text-gold-premium hover:text-dark-premium font-bold py-2 px-4 rounded border border-gold-premium/30 hover:border-gold-premium transition-all text-[11px] uppercase tracking-wider cursor-pointer self-start md:self-center"
          >
            Inscribirse al Club
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Tu Nombre
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={!!currentUser}
              placeholder="Ej. Andrés Restrepo"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte transition-colors placeholder-zinc-650"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={!!currentUser}
              placeholder="tuemail@ejemplo.com"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte transition-colors placeholder-zinc-650"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gold-premium" /> Celular o WhatsApp
            </label>
            <input
              type="tel"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              disabled={!!currentUser}
              placeholder="Ej. 3101234567"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte transition-colors placeholder-zinc-650"
            />
          </div>
        </div>

        {/* Servicio e Historial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" /> Servicio Elegido
            </label>
            <select
              value={selectedService?.id || ''}
              onChange={(e) => {
                const s = SERVICIOS_HAURA.find((serv) => serv.id === e.target.value);
                onSelectService(s || null);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte"
            >
              <option value="" disabled>Selecciona un servicio</option>
              {SERVICIOS_HAURA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ${s.price.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Selecciona Barbero
            </label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte"
            >
              {BARBEROS_AURA.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Fecha
            </label>
            <input
              type="date"
              required
              min="2026-05-26"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Hora Disponible
            </label>
            <select
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              disabled={isLoadingSlots || horasDisponibles.length === 0}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-3 text-sm text-text-matte disabled:opacity-50"
            >
              {isLoadingSlots ? (
                <option value="">Cargando horarios...</option>
              ) : horasDisponibles.length === 0 ? (
                <option value="">Sin disponibilidad hoy</option>
              ) : (
                horasDisponibles.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora} {parseInt(hora.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Caja de tarifas / Resumen */}
        {selectedService && (
          <div className="p-4 bg-zinc-950 rounded-lg border border-gold-premium/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Total Experiencia Premium:</p>
              <p className="font-serif text-lg font-bold text-text-matte">
                {selectedService.name} <span className="text-xs text-text-muted font-normal">({selectedService.duration} min)</span>
              </p>
            </div>
            <p className="font-serif text-xl font-bold text-gold-premium">
              ${selectedService.price.toLocaleString('es-CO')} <span className="text-xs font-normal">COP</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoadingSlots || horasDisponibles.length === 0}
          className="w-full bg-gold-premium hover:bg-gold-hover text-dark-premium font-bold py-3.5 rounded transition-all shadow-gold hover:-translate-y-0.5 uppercase text-xs tracking-widest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar y Reservar Experiencia Aura'}
        </button>

        <p className="text-[11px] text-text-muted text-center italic">
          * Al agendar, acumulas puntos canjeables en tu Membresía VIP. No se requiere tarjeta de crédito para reservar.
        </p>
      </form>
    </div>
  );
};
