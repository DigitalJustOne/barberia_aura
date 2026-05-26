import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import path from 'path';

// Forzar zona horaria en el entorno serverless
process.env.TZ = 'America/Bogota';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date } = req.query; // Formato: YYYY-MM-DD
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  try {
    const CREDENTIALS_PATH = path.resolve(process.cwd(), 'credentials.json');
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

    if (!CALENDAR_ID) {
      throw new Error('Falta GOOGLE_CALENDAR_ID en variables de entorno.');
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Rango de tiempo para el día completo en la zona de Bogotá
    const timeMin = `${date}T00:00:00-05:00`;
    const timeMax = `${date}T23:59:59-05:00`;

    const eventsRes = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/Bogota'
    });

    const events = eventsRes.data.items || [];
    
    // Extraer horas ocupadas (formato HH:MM)
    const busySlots = events.map(e => {
      const start = e.start?.dateTime;
      if (start) {
        const dateObj = new Date(start);
        // Formatear la hora en la zona de Bogotá
        const timeString = dateObj.toLocaleTimeString('en-US', {
          timeZone: 'America/Bogota',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        return timeString; // "09:00", "14:30", etc.
      }
      return null;
    }).filter(Boolean);

    res.status(200).json({ busySlots });
  } catch (error: any) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({ error: 'No se pudo verificar la disponibilidad' });
  }
}
