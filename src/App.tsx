import React, { useState, useEffect } from 'react';
import { UserRole, Cita, ClientProfile, Service } from './types';
import { 
  SERVICIOS_HAURA, 
  BARBEROS_AURA, 
  CITAS_INICIALES, 
  IMAGENES_GALERIA 
} from './data';
import { AvatarIcon } from './components/AvatarIcon';
import { ClientePanel } from './components/ClientePanel';
import { BarberoPanel } from './components/BarberoPanel';
import { AdminPanel } from './components/AdminPanel';
import { BookingForm } from './components/BookingForm';
import { RatingModal } from './components/RatingModal';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Scissors, 
  Sparkles, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Facebook, 
  Award, 
  Layers, 
  Check,
  Star,
  Home,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  Mail
} from 'lucide-react';

export default function App() {
  // Estado para simulación de rol de usuario
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('aura_role');
    return (saved as UserRole) || 'anonimo';
  });

  // Clientes cargados dínamicamente
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('aura_clients');
    if (saved) return JSON.parse(saved);
    return [
      {
        name: 'Samuel Restrepo',
        email: 'samuel@ejemplo.com',
        phone: '3123456789',
        avatarId: 'avatar-gentleman',
        points: 450,
        membership: 'VIP'
      },
      {
        name: 'Andrés Mendoza',
        email: 'andres@ejemplo.com',
        phone: '3159998877',
        avatarId: 'avatar-hipster',
        points: 200,
        membership: 'Gold'
      },
      {
        name: 'Juan Carlos Gómez',
        email: 'juan@ejemplo.com',
        phone: '3215554433',
        avatarId: 'avatar-casual',
        points: 80,
        membership: 'Estandar'
      }
    ];
  });

  // Email de cliente de simulación y registro activo actual
  const [activeClientEmail, setActiveClientEmail] = useState<string>(() => {
    const saved = localStorage.getItem('aura_active_client_email');
    return saved || 'samuel@ejemplo.com';
  });

  // Citas registradas en el lounge
  const [citas, setCitas] = useState<Cita[]>(() => {
    const saved = localStorage.getItem('aura_citas');
    if (saved) return JSON.parse(saved);
    return CITAS_INICIALES;
  });

  // Servicio activo seleccionado para reservar
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Filtro activo para la galería premium
  const [galeriaFilter, setGaleriaFilter] = useState<string>('Todos');

  // Historial de auditoría de puntos
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; date: string; clientName: string; points: number; reason: string }>>([
    { id: '1', date: '2026-05-26 10:14', clientName: 'Samuel Restrepo', points: 150, reason: 'Bono Cita Combo Máximo' },
    { id: '2', date: '2026-05-26 11:30', clientName: 'Andrés Mendoza', points: 100, reason: 'Bono Cita Corte Premium' }
  ]);

  // Manejo de popup automático para calificar cita finalizada
  const [unratedCita, setUnratedCita] = useState<Cita | null>(null);

  // Estados del Modal de Registro/Login de Clientes
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'registro'>('registro');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Sincronizar en localStorage
  useEffect(() => {
    localStorage.setItem('aura_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('aura_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('aura_citas', JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem('aura_active_client_email', activeClientEmail);
  }, [activeClientEmail]);

  // Buscar cliente activo de la simulación
  const activeClient = clients.find(c => c.email.toLowerCase() === activeClientEmail.toLowerCase()) || clients[0];

  // Efecto automático: si rol es 'cliente'
  // buscamos si cuenta con alguna cita 'finalizada' que no tenga 'rating' calificado aún.
  useEffect(() => {
    if (role === 'cliente' && activeClient) {
      const found = citas.find(
        (c) => c.clientEmail.toLowerCase() === activeClient.email.toLowerCase() && 
               c.status === 'finalizada' && 
               c.rating === undefined
      );
      if (found) {
        setUnratedCita(found);
      } else {
        setUnratedCita(null);
      }
    } else {
      setUnratedCita(null);
    }
  }, [role, citas, clients, activeClientEmail]);

  // Actualizar avatar del cliente activo
  const handleUpdateAvatar = (avatarId: string) => {
    setClients(prev => prev.map(c => c.email.toLowerCase() === activeClient.email.toLowerCase() ? { ...c, avatarId } : c));
  };

  // Actualizar nombre del cliente activo
  const handleUpdateName = (name: string) => {
    setClients(prev => prev.map(c => c.email.toLowerCase() === activeClient.email.toLowerCase() ? { ...c, name } : c));
  };

  // Actualizar teléfono del cliente activo
  const handleUpdatePhone = (phone: string) => {
    setClients(prev => prev.map(c => c.email.toLowerCase() === activeClient.email.toLowerCase() ? { ...c, phone } : c));
  };

  // Acciones de barbero
  const handleAcceptCita = (id: string) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, status: 'aceptada' } : c));
  };

  const handleFinishCita = (id: string) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, status: 'finalizada' } : c));
  };

  // Enviar calificación desde modal de feedback
  const handleRateCita = (id: string, stars: number, comment: string) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, rating: stars, comment } : c));
    
    // Premiar con puntos
    setClients(prev => prev.map(c => c.email.toLowerCase() === activeClient.email.toLowerCase() ? { ...c, points: c.points + 100 } : c));
    
    setUnratedCita(null);
  };

  // Administrador otorga puntos
  const handleAddPointsAudit = (email: string, pointsAmount: number, reason: string) => {
    setClients(prev => prev.map(c => c.email.toLowerCase() === email.toLowerCase() ? { ...c, points: c.points + pointsAmount } : c));
    
    const targetClient = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (targetClient) {
      setAuditLogs(prev => [
        {
          id: Date.now().toString(),
          date: '2026-05-26 ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
          clientName: targetClient.name,
          points: pointsAmount,
          reason
        },
        ...prev
      ]);
    }
  };

  // Éxito de reserva desde el formulario
  const handleBookingSuccess = (nuevaCita: Cita) => {
    setCitas(prev => [nuevaCita, ...prev]);

    // Buscar si el cliente que agendó está registrado para sumarle puntos de fidelización
    setClients(prev => prev.map(c => {
      if (c.email.toLowerCase() === nuevaCita.clientEmail.toLowerCase()) {
        return { ...c, points: c.points + 150 }; // Premio por agendar
      }
      return c;
    }));
  };

  // Agendar servicio inmediato (CRO)
  const handleServiceAgendarClick = (service: Service) => {
    setSelectedService(service);
    const bookingSection = document.getElementById('reservar');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Manejo de Registro/Login de Cliente para el Club Aura Soacha
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'registro') {
      if (!authName || !authEmail || !authPhone) {
        setAuthError('Por favor completa todos los campos.');
        return;
      }
      const yaExiste = clients.some(c => c.email.toLowerCase() === authEmail.toLowerCase());
      if (yaExiste) {
        setAuthError('El correo electrónico ya se encuentra inscrito en el Club.');
        return;
      }

      const nuevoSocio: ClientProfile = {
        name: authName,
        email: authEmail,
        phone: authPhone,
        avatarId: 'avatar-casual',
        points: 100, // Bono de bienvenida
        membership: 'Estandar'
      };

      setClients(prev => [...prev, nuevoSocio]);
      setActiveClientEmail(authEmail);
      setRole('cliente');
      setShowAuthModal(false);
      
      // Limpiar campos
      setAuthName('');
      setAuthEmail('');
      setAuthPhone('');
    } else {
      // Iniciar sesión
      if (!authEmail) {
        setAuthError('Por favor ingresa tu correo.');
        return;
      }
      const socio = clients.find(c => c.email.toLowerCase() === authEmail.toLowerCase());
      if (socio) {
        setActiveClientEmail(authEmail);
        setRole('cliente');
        setShowAuthModal(false);
        setAuthEmail('');
      } else {
        setAuthError('Correo no encontrado. Por favor registrarse como nuevo Socio.');
      }
    }
  };

  return (
    <div className="bg-[#0F0F10] text-[#F5F5F7] font-sans antialiased min-h-screen relative selection:bg-gold-premium selection:text-dark-premium">
      <div className="fixed inset-0 texture-overlay pointer-events-none z-0"></div>

      {/* Floating simulator widget for review */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, type: 'spring' }}
        className="fixed bottom-24 md:bottom-6 right-4 z-40 bg-zinc-950/95 border border-gold-premium/30 rounded-2xl p-4 shadow-2xl max-w-sm sm:max-w-md backdrop-blur-md"
      >
        <div className="flex items-center gap-1.5 text-gold-premium text-[11px] font-bold uppercase tracking-wider mb-2.5">
          <Layers className="w-3.5 h-3.5 animate-spin-slow" /> Simulador de Roles de Usuario
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRole('anonimo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'anonimo'
                ? 'bg-gold-premium text-dark-premium shadow-gold font-bold scale-105'
                : 'bg-zinc-900 text-text-muted hover:text-text-matte border border-zinc-800'
            }`}
          >
            Anónimo Lector
          </button>
          <button
            onClick={() => {
              setRole('cliente');
              setActiveClientEmail('samuel@ejemplo.com');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'cliente' && activeClient.email === 'samuel@ejemplo.com'
                ? 'bg-gold-premium text-dark-premium shadow-gold font-bold scale-105'
                : 'bg-zinc-900 text-text-muted hover:text-text-matte border border-zinc-800'
            }`}
          >
            Cliente (Samuel)
          </button>
          <button
            onClick={() => setRole('barbero')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'barbero'
                ? 'bg-gold-premium text-dark-premium shadow-gold font-bold scale-105'
                : 'bg-zinc-900 text-text-muted hover:text-text-matte border border-zinc-800'
            }`}
          >
            Barbero (Alejandro)
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-gold-premium text-dark-premium shadow-gold font-bold scale-105'
                : 'bg-zinc-900 text-text-muted hover:text-text-matte border border-zinc-800'
            }`}
          >
            Admin (Auditor)
          </button>
        </div>
        <p className="text-[9px] text-[#A1A1A6] mt-2">
          * Cambia de rol para auditar los diferentes paneles de la One-Page desde tu pantalla.
        </p>
      </motion.div>

      {/* Navegación premium flotante estilo App nativa de lujo */}
      <motion.nav 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 right-4 z-40 rounded-2xl obsidian-glass"
      >
        <div className="flex justify-between items-center w-full px-5 md:px-8 py-3.5 max-w-7xl mx-auto">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <span className="p-1.5 bg-gold-premium/10 border border-gold-premium/30 rounded-lg text-gold-premium font-serif font-bold text-lg tracking-wider group-hover:scale-105 transition-transform">
              BA
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-widest font-black text-text-matte uppercase leading-none group-hover:text-gold-premium transition-colors">
                AURA
              </span>
              <span className="text-[9px] text-gold-premium tracking-[0.25em] uppercase font-bold">
                Barbería Premium
              </span>
            </div>
          </a>

          {/* Menú tradicional */}
          <ul className="hidden md:flex gap-8 items-center text-xs font-semibold tracking-wider uppercase text-text-muted">
            <li className="relative group">
              <a href="#inicio" className="hover:text-gold-premium transition-colors py-1">Inicio</a>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-premium transition-all group-hover:w-full"></span>
            </li>
            <li className="relative group">
              <a href="#servicios" className="hover:text-gold-premium transition-colors py-1">Servicios</a>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-premium transition-all group-hover:w-full"></span>
            </li>
            <li className="relative group">
              <a href="#galeria" className="hover:text-gold-premium transition-colors py-1">Galería</a>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-premium transition-all group-hover:w-full"></span>
            </li>
            <li className="relative group">
              <a href="#experiencia" className="hover:text-gold-premium transition-colors py-1">Sobre Nosotros</a>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-premium transition-all group-hover:w-full"></span>
            </li>
            {role !== 'anonimo' && (
              <li>
                <a href="#dashboard" className="text-gold-premium border border-gold-premium/30 bg-gold-premium/5 p-1 px-3 rounded-full pb-0.5 font-bold flex items-center gap-1.5 shadow-gold hover:bg-gold-premium/15 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-premium animate-pulse"></span>
                  Panel {role === 'cliente' ? 'Socio' : role === 'barbero' ? 'Barbero' : 'Admin'}
                </a>
              </li>
            )}
          </ul>

          {/* Botón CTA tradicional */}
          <div className="flex items-center gap-3.5">
            {role === 'anonimo' ? (
              <button
                onClick={() => {
                  setAuthMode('registro');
                  setShowAuthModal(true);
                }}
                className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-premium hover:text-gold-hover border border-gold-premium/30 hover:border-gold-premium bg-gold-premium/5 p-2 px-3.5 rounded-lg transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Registrarse Club Aura
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-2 bg-zinc-950/80 p-1.5 pl-3 rounded-lg border border-zinc-800">
                <span className="text-[11px] text-text-matte font-medium truncate max-w-[110px]">
                  {role === 'cliente' ? activeClient.name : role === 'barbero' ? 'Alejandro Vidal' : 'Admin'}
                </span>
                <button
                  onClick={() => {
                    setRole('anonimo');
                  }}
                  title="Cerrar sesión"
                  className="p-1 px-2 bg-zinc-900 hover:bg-red-950/40 text-text-muted hover:text-red-400 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <a
              href="#reservar"
              className="bg-gold-premium hover:bg-gold-hover text-dark-premium font-bold px-4 py-2.5 text-xs uppercase tracking-wider rounded-lg transition-colors shadow-gold cursor-pointer"
            >
              Reservar Experiencia
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Header Spacer */}
      <div className="pt-28"></div>

      {/* HERO SECTION - REDISEÑO CINEMÁTICO CON ENTRADA STAGGERED */}
      <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center px-6 md:px-12 py-16 overflow-hidden">
        {/* Imagen de fondo premium sutil con sutil pulso */}
        <div className="absolute inset-0 bg-[#0F0F10] z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-color-dodge transition-all duration-1000"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-transparent to-transparent"></div>
          {/* Radial Gold Pulse Aura en el fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] hero-pulse-background pointer-events-none"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
            }}
            className="inline-block px-4 py-2 border border-gold-premium/40 bg-gold-premium/5 rounded-full text-xs font-semibold text-gold-premium tracking-widest uppercase text-gold-shadow"
          >
            ★ La Mejor Barbería en Soacha, Cundinamarca ★
          </motion.span>

          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="font-serif text-5xl sm:text-6.5xl md:text-7.5xl font-light text-text-matte uppercase tracking-tight leading-none"
          >
            Define tu <span className="font-bold text-gold-premium text-gold-shadow-heavy">Estilo</span>.<br />
            Dueño de tu <span className="font-bold border-b-2 border-gold-premium/50 text-gold-shadow">AURA</span>.
          </motion.h1>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="text-text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            Experimenta el verdadero arte del cuidado masculino. Cortes de cabello premium Soacha, perfilados de barba meticulosos y tratamientos de primer nivel cerca de San Mateo. Un espacio diseñado para tu distinción.
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
            }}
            className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a
              href="#reservar"
              className="w-full sm:w-auto bg-gold-premium hover:bg-gold-hover text-dark-premium font-black px-8 py-4.5 text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] text-center cursor-pointer"
            >
              Reservar Experiencia Aura
            </a>
            <a
              href="#servicios"
              className="w-full sm:w-auto border border-zinc-800 hover:border-gold-premium/50 bg-zinc-950/20 text-text-matte hover:text-gold-premium font-semibold px-8 py-4.5 text-xs uppercase tracking-widest rounded-xl transition-all text-center cursor-pointer hover:bg-zinc-950/60"
            >
              Explorar Servicios
            </a>
          </motion.div>
        </motion.div>

        {/* Floating details badge */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="hidden lg:flex absolute bottom-8 left-12 items-center gap-3 text-xs text-text-muted bg-black/40 p-2.5 px-4 rounded-xl border border-zinc-900/60 backdrop-blur"
        >
          <MapPin className="w-4 h-4 text-gold-premium animate-pulse" />
          <span className="font-medium text-text-matte">Carrera 7 # 12-34, San Mateo, Soacha</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="hidden lg:flex absolute bottom-8 right-12 items-center gap-3 text-xs text-text-muted bg-black/40 p-2.5 px-4 rounded-xl border border-zinc-900/60 backdrop-blur"
        >
          <Clock className="w-4 h-4 text-gold-premium" />
          <span className="font-medium text-text-matte">Lunes - Sáb: 9:00 AM - 9:00 PM</span>
        </motion.div>
      </section>

      {/* DASHBOARD PRIVADO DEPENDIENDO DEL ROL ACTIVO SIMULADO CON ANIMACIÓN FLUIDA */}
      <AnimatePresence mode="wait">
        {role !== 'anonimo' && (
          <motion.section 
            key={`dashboard-${role}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            id="dashboard" 
            className="py-16 px-6 md:px-12 bg-[#121214]/65 border-y border-zinc-900/80 scroll-mt-28 obsidian-glass relative overflow-hidden"
          >
            {/* Sutil resplandor de fondo radial */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] hero-pulse-background pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
              {role === 'cliente' && (
                <ClientePanel
                  client={activeClient}
                  onChangeAvatar={handleUpdateAvatar}
                  onChangeName={handleUpdateName}
                  onChangePhone={handleUpdatePhone}
                  citas={citas}
                />
              )}
              {role === 'barbero' && (
                <BarberoPanel
                  citas={citas}
                  onAcceptCita={handleAcceptCita}
                  onFinishCita={handleFinishCita}
                />
              )}
              {role === 'admin' && (
                <AdminPanel
                  citas={citas}
                  client={activeClient}
                  onModifyPoints={(delta) => setClients(prev => prev.map((c) => c.email.toLowerCase() === activeClient.email.toLowerCase() ? { ...c, points: c.points + delta } : c))}
                  allClients={clients}
                  onAddPointAudit={handleAddPointsAudit}
                />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* SECCIÓN SERVICIOS PREMIUM */}
      <section id="servicios" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center space-y-4 mb-16">
          <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase">
            Nuestra Selección
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-matte">
            Cortes de Cabello Premium en Soacha
          </h2>
          <div className="w-16 h-1 bg-gold-premium mx-auto"></div>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
            Tarifas transparentes en COP. Elige el tratamiento que mejor se acomode a tus necesidades y agéndalo en segundos.
          </p>
        </div>

        {/* Grid de Servicios con Animación Staggered Viewport */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SERVICIOS_HAURA.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
              }}
              whileHover={{ y: -8 }}
              className="bg-dark-card border border-zinc-900 rounded-2xl overflow-hidden shadow-gold-hover hover:border-gold-premium/40 transition-all duration-300 flex flex-col group animated-card-border"
            >
              {/* Image Container with overlay zoom */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent"></div>
                <span className="absolute top-4 right-4 bg-black/80 border border-gold-premium/40 text-gold-premium text-xs font-mono font-bold px-3 py-1.5 rounded">
                  {service.duration} mins
                </span>
                <span className="absolute bottom-4 left-4 bg-gold-premium text-dark-premium text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  {service.category}
                </span>
              </div>

              {/* Service details */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-serif text-lg font-bold text-text-matte group-hover:text-gold-premium transition-colors">
                    {service.name}
                  </h3>
                </div>
                <p className="text-text-muted text-xs leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                <div className="pt-4 border-t border-zinc-850 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase">Precio Único</span>
                    <span className="font-serif text-lg font-black text-text-matte">
                      ${service.price.toLocaleString('es-CO')} <span className="font-sans text-xs font-normal text-text-muted">COP</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleServiceAgendarClick(service)}
                    className="bg-zinc-900 hover:bg-gold-premium text-text-matte hover:text-dark-premium border border-zinc-800 hover:border-gold-premium font-semibold text-xs px-4 py-2.5 rounded transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* RECONSTRUCTED BOOKING WIZARD */}
      <section id="reservar" className="py-24 px-6 md:px-12 bg-zinc-950/40 border-y border-zinc-900 scroll-mt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-gold-premium text-xs font-bold tracking-widest uppercase">
              Asistente de Citas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-matte">
              Reserva tu Experiencia en San Mateo
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto">
              Asegura tu barbero favorito y olvídate de las filas. Sistema optimizado para visitas instantáneas.
            </p>
          </div>

          <BookingForm
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onBookingSuccess={handleBookingSuccess}
            currentUser={role === 'cliente' ? activeClient : null}
            onClickAuth={() => {
              setAuthMode('registro');
              setShowAuthModal(true);
            }}
          />
        </div>
      </section>

      {/* GALERÍA PREMIUM ASIMÉTRICA */}
      <section id="galeria" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase">
              Galería Premium
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-matte">
              Estilos y Cortes Realizados
            </h2>
            <div className="w-12 h-0.5 bg-gold-premium"></div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Cortes', 'Barba', 'Estilo'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGaleriaFilter(cat)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                  galeriaFilter === cat
                    ? 'bg-gold-premium text-dark-premium font-bold'
                    : 'bg-dark-card text-text-muted hover:text-text-matte border border-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout asimétrico moderno de Galería con Layout Animations de Motion */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {IMAGENES_GALERIA
              .filter((item) => galeriaFilter === 'Todos' || item.category === galeriaFilter)
              .map((item, index) => {
                // Simular alturas asimétricas elegantes para bento layout
                const heightClass = index % 3 === 0 ? 'h-96' : index % 3 === 1 ? 'h-[320px]' : 'h-80';
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    whileHover={{ y: -6 }}
                    className={`group relative overflow-hidden rounded-xl border border-zinc-900/60 bg-zinc-950 ${heightClass} shadow-md transition-all duration-300 hover:border-gold-premium/30 animated-card-border`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 space-y-1">
                      <span className="text-[10px] text-gold-premium uppercase font-bold tracking-widest">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-base font-bold text-text-matte">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-text-muted">Servicio Premium por Barbería Aura</p>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* LA EXPERIENCIA TRADICIONAL / SOBRE NOSOTROS */}
      <section id="experiencia" className="py-24 px-6 md:px-12 bg-dark-card border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-gold-premium text-xs font-semibold tracking-widest uppercase">
              Tradición en San Mateo
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-text-matte">
              La Barbería por Excelencia para el Caballero de Soacha
            </h2>
            <div className="w-16 h-1 bg-gold-premium"></div>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              En Barbería Aura nos enorgullece trascender el concepto tradicional de barbería antigua. Cada servicio es un ritual de asombro y precisión, fusionando las técnicas de la vieja escuela italiana con las influencias del freestyle moderno y el cuidado facial de vanguardia.
            </p>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Ubicados convenientemente en Soacha (San Mateo), te recibimos en un entorno texturizado, masculino y privado de primer nivel, donde cada detalle está curado para brindarte confort y alta distinción.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 text-text-matte">
              <div className="space-y-1">
                <p className="font-serif text-2xl font-bold text-gold-premium">180+</p>
                <p className="text-xs text-text-muted uppercase">Opiniones de 5 Estrellas</p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-2xl font-bold text-gold-premium">100%</p>
                <p className="text-xs text-text-muted uppercase">Socio de Satisfacción</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 lg:h-[480px] rounded-2xl overflow-hidden border border-zinc-900 group">
            <img
              src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=800&auto=format&fit=crop"
              alt="Interiores Barbería Aura"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-premium/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/75 backdrop-blur-sm rounded-lg border border-gold-premium/10 flex items-center gap-4">
              <div className="p-3 bg-gold-premium/10 rounded-full text-gold-premium">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Visítanos sin cita o agenda previa:</p>
                <p className="text-sm font-semibold text-text-matte">Carrera 7 # 12-34, San Mateo, Soacha, Colombia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA FLOTANTE OPTIMIZADO PARA MÓVILES */}
      <a
        href="https://wa.me/573100000000?text=Hola%20Barber%c3%ada%20Aura!%20Me%20gustar%c3%ada%20agendar%20un%20servicio."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-40 bg-zinc-950 hover:bg-gold-premium border border-zinc-850 hover:border-gold-premium p-3 rounded-full flex items-center justify-center text-gold-premium hover:text-dark-premium shadow-2xl scale-100 hover:scale-110 active:scale-95 transition-all outline-none md:bottom-28"
        title="Agenda por WhatsApp"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* POPUP AUTOMÁTICO DE CALIFICACIÓN DE ESTRELLAS */}
      {unratedCita && (
        <RatingModal
          cita={unratedCita}
          onSubmitRating={handleRateCita}
          onClose={() => setUnratedCita(null)}
        />
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR PARA MÓVILES - ESTILO APP NATIVA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/95 backdrop-blur-md border border-zinc-800/80 rounded-2xl py-2 px-4 flex justify-between items-center shadow-2xl">
        <a href="#inicio" className="flex flex-col items-center justify-center p-1 font-semibold text-text-muted hover:text-gold-premium transition-colors">
          <Home className="w-[18px] h-[18px]" />
          <span className="text-[9px] mt-1 font-medium select-none">Inicio</span>
        </a>

        <a href="#servicios" className="flex flex-col items-center justify-center p-1 font-semibold text-text-muted hover:text-gold-premium transition-colors">
          <Scissors className="w-[18px] h-[18px]" />
          <span className="text-[9px] mt-1 font-medium select-none">Cortes</span>
        </a>

        <a 
          href="#reservar" 
          className="relative -top-4 flex items-center justify-center bg-gold-premium text-dark-premium w-12 h-12 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-gold-hover transition-all border-4 border-[#0F0F10]"
          title="Agendar Cita ahora"
        >
          <Calendar className="w-5 h-5 font-black" />
        </a>

        <a href="#galeria" className="flex flex-col items-center justify-center p-1 font-semibold text-text-muted hover:text-gold-premium transition-colors">
          <Layers className="w-[18px] h-[18px]" />
          <span className="text-[9px] mt-1 font-medium select-none">Galería</span>
        </a>

        <button 
          onClick={() => {
            if (role === 'anonimo') {
              setAuthMode('registro');
              setShowAuthModal(true);
            } else {
              const dashboardSec = document.getElementById('dashboard');
              if (dashboardSec) {
                dashboardSec.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
          className="flex flex-col items-center justify-center p-1 font-semibold text-text-muted hover:text-gold-premium transition-colors cursor-pointer"
        >
          <Award className={`w-[18px] h-[18px] ${role !== 'anonimo' ? 'text-gold-premium animate-pulse' : ''}`} />
          <span className="text-[9px] mt-1 font-medium select-none">
            {role !== 'anonimo' ? 'Mi Club' : 'Únete VIP'}
          </span>
        </button>
      </div>

      {/* MODAL DE HISTORIA DE REGISTRO / INICIAR SESIÓN CLIENTE CON ANIMACIÓN SPRING */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, rotateX: 5 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.95, y: 20, rotateX: 5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="bg-dark-card border border-gold-premium/25 rounded-2xl w-full max-w-md p-6 relative overflow-hidden shadow-gold obsidian-glass"
            >
              {/* Brillo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-premium/10 rounded-full filter blur-2xl pointer-events-none"></div>
              
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 bg-zinc-900 border border-zinc-800 p-1.5 rounded-full text-text-muted hover:text-text-matte hover:border-zinc-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <span className="text-gold-premium text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Aura Loyalty Circle
                </span>
                <h3 className="font-serif text-2xl font-bold text-text-matte">
                  {authMode === 'registro' ? 'Inscríbete hoy al Club' : 'Ingresa al Portal VIP'}
                </h3>
                <p className="text-xs text-text-muted">
                  {authMode === 'registro' 
                    ? 'Recibe +100 puntos de bienvenida canjeables por servicios y café cortesía.'
                    : 'Ingresa con tu correo electrónico registrado para revisar tu tarjeta.'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authError && (
                  <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded text-center">
                    {authError}
                  </p>
                )}

                {authMode === 'registro' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-gold-premium" /> Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Ej. Samuel Restrepo"
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-2.5 text-sm text-text-matte placeholder-zinc-650 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gold-premium" /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Ej. samuel@ejemplo.com"
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-2.5 text-sm text-text-matte placeholder-zinc-650 focus:outline-none"
                  />
                </div>

                {authMode === 'registro' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold-premium" /> Celular o WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="Ej. 3123456789 (Soacha)"
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-gold-premium focus:ring-1 focus:ring-gold-premium rounded p-2.5 text-sm text-text-matte placeholder-zinc-650 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gold-premium hover:bg-gold-hover text-dark-premium hover:text-black font-bold py-3 rounded transition shadow-gold uppercase text-xs tracking-wider cursor-pointer mt-2"
                >
                  {authMode === 'registro' ? 'Unirse al Aura Club (+100 pts)' : 'Ingresar al Portal VIP'}
                </button>
              </form>

              <div className="border-t border-zinc-850 mt-6 pt-4 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'registro' ? 'login' : 'registro');
                    setAuthError('');
                  }}
                  className="text-xs text-gold-premium hover:underline cursor-pointer"
                >
                  {authMode === 'registro' 
                    ? '¿Ya tienes cuenta? Ingresa aquí' 
                    : '¿No estás registrado? Crea tu cuenta gratis'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#0b0b0c] border-t border-zinc-900 py-16 px-6 md:px-12 text-sm text-text-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-text-matte tracking-wide">
              BARBERÍA <span className="text-gold-premium">AURA</span>
            </h4>
            <p className="text-xs leading-relaxed max-w-xs">
              La barbería premium líder de Soacha, Cundinamarca. Diseñamos con el pulso y la precisión de la vieja escuela italiana fusionada con la moda urbana.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-gold-premium transition-colors" title="Instagram">
                <Instagram className="w-5 h-5 focus:outline-none" />
              </a>
              <a href="#" className="hover:text-gold-premium transition-colors" title="Facebook">
                <Facebook className="w-5 h-5 focus:outline-none" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-text-matte uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#inicio" className="hover:underline">Inicio</a></li>
              <li><a href="#servicios" className="hover:underline">Servicio de Barbería</a></li>
              <li><a href="#galeria" className="hover:underline">Galería de Estilos</a></li>
              <li><a href="#reservar" className="hover:underline">Contacto / Agendar</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-text-matte uppercase tracking-wider">Contacto & Horarios</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-premium" /> +57 310 000 0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-premium" /> Soacha, San Mateo Cundinamarca
              </li>
              <li className="pt-2">Lunes - Sábado: 9:00 AM - 9:00 PM</li>
              <li>Domingos: 10:00 AM - 6:00 PM</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-text-matte uppercase tracking-wider">Metodología de Reclamación</h4>
            <p className="text-xs leading-relaxed">
              Cumplimos estrictamente los estándares de bioseguridad del Ministerio de Salud. Registrados ante la Cámara de Comercio de Soacha.
            </p>
            <div className="flex items-center gap-1.5 text-gold-premium text-xs font-bold font-serif">
              <span>ESTRELLAS MEDIAS: 4.9</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((_s, index) => (
                  <Star key={index} className="w-3 h-3 fill-gold-premium text-none" />
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© 2026 Barbería Aura. Todos los derechos reservados. Diseñado bajo estándares de CRO y SEO Técnico.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Términos de servicio</a>
            <a href="#" className="hover:underline">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
