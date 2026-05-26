import { Service, Barber, Cita } from './types';

export const SERVICIOS_HAURA: Service[] = [
  {
    id: 's1',
    name: 'Corte Aura Premium',
    description: 'Asesoría de estilo, lavado clásico, corte personalizado y peinado con cera orgánica premium.',
    price: 35000,
    duration: 40,
    category: 'Cortes',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'Perfilado de Barba Imperial',
    description: 'Ritual clásico de toalla caliente, aceites esenciales de bergamota, perfilado con navaja libre y bálsamo.',
    price: 25000,
    duration: 30,
    category: 'Barba',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Combo Aura Máximo',
    description: 'El servicio insignia. Corte premium, ritual de barba imperial y masaje facial relajante de ozono.',
    price: 55000,
    duration: 75,
    category: 'Estilo',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's4',
    name: 'Corte Degradado (Fade)',
    description: 'Técnica pulida máquina sobre peine que logra una transición inmaculada desde la piel.',
    price: 30000,
    duration: 35,
    category: 'Cortes',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's5',
    name: 'Camuflaje de Canas Activo',
    description: 'Coloración discreta y rápida para matizar sutilmente las canas sin perder tu esencia natural.',
    price: 45000,
    duration: 30,
    category: 'Estilo',
    image: 'https://images.unsplash.com/photo-1605497746444-17df585f1488?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's6',
    name: 'Facial Exfoliante Energizante',
    description: 'Vapor de ozono, exfoliación con durazno, mascarilla negra de carbón y tónico refrescante.',
    price: 20000,
    duration: 25,
    category: 'Estilo',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop'
  }
];

export const BARBEROS_AURA: Barber[] = [
  {
    id: 'b1',
    name: 'Alejandro Vidal',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop',
    rating: 4.9,
    servicesThisMonth: 124,
    specialty: 'Cortes de época y Tijeras'
  },
  {
    id: 'b2',
    name: 'Mateo "Street" Reyes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    rating: 4.8,
    servicesThisMonth: 145,
    specialty: 'Degradados y Freestyle Art'
  },
  {
    id: 'b3',
    name: 'Daniel Silva',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
    rating: 5.0,
    servicesThisMonth: 98,
    specialty: 'Rituales de Barba tradicionales'
  }
];

// Citas iniciales para la simulación
export const CITAS_INICIALES: Cita[] = [
  {
    id: 'c1',
    clientName: 'Samuel Restrepo',
    clientEmail: 'samuel@ejemplo.com',
    clientPhone: '+573123456789',
    clientAvatar: 'avatar-gentleman',
    barberName: 'Alejandro Vidal',
    serviceName: 'Combo Aura Máximo',
    price: 55000,
    date: '2026-05-26',
    time: '14:30',
    status: 'finalizada' // Esta activará el popup para calificar si inicia como cliente Samuel
  },
  {
    id: 'c2',
    clientName: 'Andrés Mendoza',
    clientEmail: 'andres@ejemplo.com',
    clientPhone: '+573159998877',
    clientAvatar: 'avatar-hipster',
    barberName: 'Alejandro Vidal',
    serviceName: 'Corte Aura Premium',
    price: 35000,
    date: '2026-05-26',
    time: '16:00',
    status: 'aceptada'
  },
  {
    id: 'c3',
    clientName: 'Juan Carlos Gómez',
    clientEmail: 'juan@ejemplo.com',
    clientPhone: '+573215554433',
    clientAvatar: 'avatar-casual',
    barberName: 'Mateo "Street" Reyes',
    serviceName: 'Corte Degradado (Fade)',
    price: 30000,
    date: '2026-05-26',
    time: '17:30',
    status: 'pendiente'
  },
  {
    id: 'c4',
    clientName: 'Sebastián Ortiz',
    clientEmail: 'sebastian@ejemplo.com',
    clientPhone: '+573004445555',
    clientAvatar: 'avatar-cool',
    barberName: 'Daniel Silva',
    serviceName: 'Perfilado de Barba Imperial',
    price: 25000,
    date: '2026-05-26',
    time: '10:00',
    status: 'finalizada',
    rating: 5
  },
  {
    id: 'c5',
    clientName: 'Nicolás Peña',
    clientEmail: 'nicolas@ejemplo.com',
    clientPhone: '+573187776655',
    clientAvatar: 'avatar-gentleman',
    barberName: 'Mateo "Street" Reyes',
    serviceName: 'Combo Aura Máximo',
    price: 55000,
    date: '2026-05-26',
    time: '11:15',
    status: 'aceptada'
  }
];

export const IMAGENES_GALERIA = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop',
    title: 'Estilo Pompadour Premium',
    category: 'Cortes'
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop',
    title: 'Perfilado a Cuchilla Clásica',
    category: 'Barba'
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=600&auto=format&fit=crop',
    title: 'Exfoliación de Carbón Activo',
    category: 'Estilo'
  },
  {
    id: 'g4',
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop',
    title: 'Alineación de Barba Imperial',
    category: 'Barba'
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop',
    title: 'High Skin Fade con Línea',
    category: 'Cortes'
  },
  {
    id: 'g6',
    src: 'https://images.unsplash.com/photo-1605497746444-17df585f1488?q=80&w=600&auto=format&fit=crop',
    title: 'Estilo Clásico Gentleman',
    category: 'Estilo'
  }
];

export const PREDEFINED_AVATARS = [
  {
    id: 'avatar-gentleman',
    name: 'Modern Gentleman',
    svgColor: '#D4AF37'
  },
  {
    id: 'avatar-hipster',
    name: 'Classic Hipster',
    svgColor: '#4A90E2'
  },
  {
    id: 'avatar-casual',
    name: 'Casual Look',
    svgColor: '#50E3C2'
  },
  {
    id: 'avatar-cool',
    name: 'Cool Urban',
    svgColor: '#B8E986'
  }
];
