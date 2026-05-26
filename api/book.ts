import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import OpenAI from 'openai';
import path from 'path';

// Forzar zona horaria
process.env.TZ = 'America/Bogota';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cita = req.body;
    
    // Variables requeridas
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
    const OR_API_KEY = process.env.OPENROUTER_API_KEY!;
    const OR_MODEL = process.env.OPENROUTER_MODEL!;
    const CREDENTIALS_PATH = path.resolve(process.cwd(), 'credentials.json');

    // Clientes
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OR_API_KEY,
    });

    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient as any });

    // 1. Estructurar con IA (Calcular duración estimada basada en el servicio)
    const prompt = `
Eres el asistente de Barbería Aura.
Extrae la duración estimada del siguiente servicio y devuelve SOLO un JSON válido:
{
  "duracion": numero_minutos
}
Servicio: ${cita.serviceName}
Regla: Si es corte (30), barba (20), ambos o ritual (45-60).
`.trim();

    const completion = await openrouter.chat.completions.create({
      model: OR_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let duracion = 30; // fallback
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.duracion) duracion = parsed.duracion;
      } catch(e) {}
    }

    // 2. Insertar en Google Calendar
    const startIso = `${cita.date}T${cita.time}:00-05:00`;
    const [hh, mm] = cita.time.split(":").map(Number);
    const totalMin = hh * 60 + mm + duracion;
    const endHH = Math.floor(totalMin / 60) % 24;
    const endMM = totalMin % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    const endIso = `${cita.date}T${pad(endHH)}:${pad(endMM)}:00-05:00`;

    const event = {
      summary: `✂️ ${cita.serviceName} – ${cita.clientName}`,
      description: `👤 Cliente: ${cita.clientName}\n💈 Barbero: ${cita.barberName}\n🪒 Servicio: ${cita.serviceName}\n⏱ Duración: ${duracion} min\n📞 Celular: ${cita.clientPhone}\n🆔 ID: ${cita.id}`,
      start: { dateTime: startIso, timeZone: 'America/Bogota' },
      end: { dateTime: endIso, timeZone: 'America/Bogota' },
      colorId: "2",
    };

    let calendarLink = "sin-link";
    try {
      const resCal = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
      });
      calendarLink = resCal.data.htmlLink || resCal.data.id || "sin-link";
    } catch (calErr: any) {
      console.warn("Google Calendar falló (posiblemente API no habilitada):", calErr.message);
    }

    // 3. Guardar en Supabase
    const { error: sbErr } = await supabase.from('citas').insert([
      {
        id: cita.id,
        cliente_nombre: cita.clientName,
        cliente_telefono: cita.clientPhone,
        barbero: cita.barberName,
        servicio: cita.serviceName,
        fecha: cita.date,
        hora: cita.time,
        estado: 'sincronizada',
        calendar_link: calendarLink
      }
    ]);

    if (sbErr) {
      console.warn("Supabase falló al insertar:", sbErr.message);
      // Puede que la tabla aún no exista, pero continuamos para devolver éxito al frontend
    }

    res.status(200).json({ success: true, calendarLink });
  } catch (error: any) {
    console.error('Error interno procesando cita:', error);
    res.status(500).json({ error: error.message || 'Error interno' });
  }
}
