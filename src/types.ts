export type UserRole = 'anonimo' | 'cliente' | 'barbero' | 'admin';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number; // en pesos colombianos (COP)
  duration: number; // en minutos
  category: 'Cortes' | 'Barba' | 'Estilo';
  image: string;
}

export interface Cita {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string; // Celular o WhatsApp en Colombia
  clientAvatar: string; // SVG predefinido en string o ID de avatar
  barberName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: 'pendiente' | 'aceptada' | 'finalizada';
  rating?: number; // Calificación opcional de 1 a 5 estrellas
  comment?: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  servicesThisMonth: number;
  specialty: string;
}

export interface ClientProfile {
  name: string;
  email: string;
  phone: string; // Celular o WhatsApp para el Club
  avatarId: string;
  points: number;
  membership: 'Estandar' | 'Gold' | 'VIP';
}
