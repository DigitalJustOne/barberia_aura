/**
 * Barbería Aura – Scheduler Service
 * -----------------------------------
 * 1. Escucha inserciones en tiempo real en la tabla `citas` (Supabase Realtime)
 * 2. Procesa el texto libre del cliente con OpenRouter AI para estructurar los datos
 * 3. Inserta el evento en Google Calendar usando una cuenta de servicio
 * Zona horaria: America/Bogota (GMT-05:00)
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import OpenAI from "openai";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.resolve(__dirname, "../../credentials.json");
const TZ = process.env.TZ ?? "America/Bogota";

// ─── Validar variables de entorno ──────────────────────────────────────────────
const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "GOOGLE_CALENDAR_ID",
  "OPENROUTER_API_KEY",
  "OPENROUTER_MODEL",
] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Variable de entorno faltante: ${key}`);
    process.exit(1);
  }
}

const SUPABASE_URL      = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const CALENDAR_ID       = process.env.GOOGLE_CALENDAR_ID!;
const OR_API_KEY        = process.env.OPENROUTER_API_KEY!;
const OR_MODEL          = process.env.OPENROUTER_MODEL!;

// ─── Clientes ──────────────────────────────────────────────────────────────────

/** Supabase */
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** OpenRouter (API compatible con OpenAI) */
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OR_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://barberia-aura.local",
    "X-Title": "Barbería Aura Scheduler",
  },
});

/** Google Calendar – cuenta de servicio */
async function buildCalendarClient() {
  console.log("buildCalendarClient: starting");
  console.log("CREDENTIALS_PATH:", CREDENTIALS_PATH);
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  console.log("buildCalendarClient: auth created, calling getClient()...");
  const authClient = await auth.getClient();
  console.log("buildCalendarClient: getClient() returned");
  return google.calendar({ version: "v3", auth: authClient as any });
}

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface CitaRow {
  id: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  barbero?: string;
  servicio?: string;
  fecha?: string;      // YYYY-MM-DD
  hora?: string;       // HH:MM
  duracion_min?: number;
  notas?: string;
  texto_libre?: string; // mensaje sin estructura del cliente
  estado?: string;
}

interface CitaEstructurada {
  cliente: string;
  barbero: string;
  servicio: string;
  fecha: string;    // YYYY-MM-DD
  hora: string;     // HH:MM
  duracion: number; // minutos
  notas: string;
}

// ─── Procesamiento IA ──────────────────────────────────────────────────────────
async function estructurarCitaConIA(cita: CitaRow): Promise<CitaEstructurada> {
  const hoy = new Date().toLocaleDateString("es-CO", { timeZone: TZ });

  const prompt = `
Eres el asistente de agendamiento de "Barbería Aura" en Soacha, Colombia.
Hoy es ${hoy}. Zona horaria: ${TZ}.

Extrae los datos de agendamiento del siguiente registro y devuelve SÓLO un objeto JSON válido con esta estructura exacta:
{
  "cliente": "nombre del cliente",
  "barbero": "nombre del barbero (si no se menciona usa 'Por asignar')",
  "servicio": "tipo de servicio (corte, barba, corte+barba, etc.)",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM",
  "duracion": número_de_minutos_estimado,
  "notas": "observaciones adicionales"
}

Datos del registro:
- cliente_nombre: ${cita.cliente_nombre ?? ""}
- barbero: ${cita.barbero ?? ""}
- servicio: ${cita.servicio ?? ""}
- fecha: ${cita.fecha ?? ""}
- hora: ${cita.hora ?? ""}
- notas: ${cita.notas ?? ""}
- texto_libre: ${cita.texto_libre ?? ""}

Reglas:
- Si la duración no se menciona, estima según el servicio (corte=30min, barba=20min, corte+barba=45min).
- Si la fecha es relativa ("mañana", "el viernes"), calcula desde hoy (${hoy}).
- Devuelve SOLO el JSON, sin markdown ni texto adicional.
`.trim();

  const completion = await openrouter.chat.completions.create({
    model: OR_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 400,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";

  // Extraer JSON si viene envuelto en markdown
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`IA no devolvió JSON válido: ${raw}`);

  const parsed = JSON.parse(jsonMatch[0]) as CitaEstructurada;

  // Fallbacks seguros
  parsed.cliente  ??= cita.cliente_nombre ?? "Cliente";
  parsed.barbero  ??= cita.barbero ?? "Por asignar";
  parsed.servicio ??= cita.servicio ?? "Servicio";
  parsed.duracion ??= 30;

  return parsed;
}

// ─── Google Calendar ───────────────────────────────────────────────────────────
async function insertarEnCalendario(
  calendar: ReturnType<typeof google.calendar>,
  cita: CitaEstructurada,
  citaId: string
): Promise<string> {
  // Construir fechas ISO con offset de Bogotá (-05:00)
  const startIso = `${cita.fecha}T${cita.hora}:00-05:00`;
  const endDate  = calcularFin(cita.fecha, cita.hora, cita.duracion);
  const endIso   = `${endDate}-05:00`;

  const event = {
    summary: `✂️ ${cita.servicio} – ${cita.cliente}`,
    description: [
      `👤 Cliente: ${cita.cliente}`,
      `💈 Barbero: ${cita.barbero}`,
      `🪒 Servicio: ${cita.servicio}`,
      `⏱ Duración: ${cita.duracion} min`,
      cita.notas ? `📝 Notas: ${cita.notas}` : "",
      `🆔 Cita ID: ${citaId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: startIso, timeZone: TZ },
    end:   { dateTime: endIso,   timeZone: TZ },
    colorId: "2", // sage green para citas
  };

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
  });

  return res.data.htmlLink ?? res.data.id ?? "sin-link";
}

function calcularFin(fecha: string, hora: string, duracionMin: number): string {
  const [hh, mm] = hora.split(":").map(Number);
  const totalMin = hh * 60 + mm + duracionMin;
  const endHH    = Math.floor(totalMin / 60) % 24;
  const endMM    = totalMin % 60;
  const pad      = (n: number) => String(n).padStart(2, "0");
  return `${fecha}T${pad(endHH)}:${pad(endMM)}:00`;
}

// ─── Pipeline principal ────────────────────────────────────────────────────────
async function procesarCita(cita: CitaRow, calendar: ReturnType<typeof google.calendar>) {
  console.log(`\n📥 Nueva cita recibida [ID: ${cita.id}]`);
  console.log("   Datos raw:", JSON.stringify(cita, null, 2));

  try {
    // 1. Estructurar con IA
    console.log(`\n🤖 Procesando con OpenRouter (${OR_MODEL})…`);
    const estructurada = await estructurarCitaConIA(cita);
    console.log("   ✅ Datos estructurados:", JSON.stringify(estructurada, null, 2));

    // 2. Insertar en Google Calendar
    console.log("\n📅 Insertando en Google Calendar…");
    const link = await insertarEnCalendario(calendar, estructurada, cita.id);
    console.log(`   ✅ Evento creado: ${link}`);

    // 3. Actualizar estado en Supabase
    const { error } = await supabase
      .from("citas")
      .update({ estado: "sincronizada", calendar_link: link })
      .eq("id", cita.id);

    if (error) {
      console.warn("   ⚠️  No se pudo actualizar el estado en Supabase:", error.message);
    } else {
      console.log("   ✅ Estado actualizado en Supabase → 'sincronizada'");
    }
  } catch (err) {
    console.error(`   ❌ Error procesando cita ${cita.id}:`, err);
  }
}

// ─── Pruebas de conexión ────────────────────────────────────────────────────────
async function probarConexiones(calendar: ReturnType<typeof google.calendar>) {
  console.log("\n═══════════════════════════════════════════");
  console.log("   BARBERÍA AURA – Scheduler Service");
  console.log("═══════════════════════════════════════════");
  console.log(`⏰ TZ activa: ${TZ}`);
  console.log(`🕐 Hora local: ${new Date().toLocaleString("es-CO", { timeZone: TZ })}`);

  // Supabase ping
  console.log("\n🔌 [1/3] Probando conexión a Supabase…");
  const { data, error: sbErr } = await supabase.from("citas").select("count").limit(1);
  if (sbErr) {
    console.error("   ❌ Supabase:", sbErr.message);
  } else {
    console.log("   ✅ Supabase conectado →", SUPABASE_URL);
  }

  // OpenRouter ping
  console.log("\n🤖 [2/3] Probando conexión a OpenRouter…");
  try {
    const ping = await openrouter.chat.completions.create({
      model: OR_MODEL,
      messages: [{ role: "user", content: "Responde solo: OK" }],
      max_tokens: 10,
    });
    const resp = ping.choices[0]?.message?.content?.trim();
    console.log(`   ✅ OpenRouter conectado (${OR_MODEL}) → "${resp}"`);
  } catch (orErr: any) {
    console.error("   ❌ OpenRouter:", orErr?.message ?? orErr);
  }

  // Google Calendar ping
  console.log("\n📅 [3/3] Probando conexión a Google Calendar…");
  try {
    const calInfo = await calendar.calendars.get({ calendarId: CALENDAR_ID });
    console.log(`   ✅ Google Calendar conectado → "${calInfo.data.summary}"`);
  } catch (gcErr: any) {
    console.error("   ❌ Google Calendar:", gcErr?.message ?? gcErr);
  }

  console.log("\n═══════════════════════════════════════════\n");
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function main() {
  console.log("main: Starting up...");
  process.env.TZ = TZ; // forzar zona horaria del proceso

  console.log("main: calling buildCalendarClient");
  const calendar = await buildCalendarClient();
  console.log("main: buildCalendarClient done");

  // Pruebas de conexión iniciales
  console.log("main: calling probarConexiones");
  await probarConexiones(calendar);
  console.log("main: probarConexiones done");

  // Suscripción Realtime de Supabase
  console.log("👂 Escuchando inserciones en tabla `citas` (Supabase Realtime)…");
  console.log("   (Presiona Ctrl+C para detener)\n");

  const channel = supabase
    .channel("citas-scheduler")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "citas" },
      async (payload) => {
        const nuevaCita = payload.new as CitaRow;
        await procesarCita(nuevaCita, calendar);
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("✅ Canal Realtime activo – esperando nuevas citas…\n");
      } else if (status === "CHANNEL_ERROR") {
        console.error("❌ Error en canal Realtime de Supabase");
      }
    });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n\n🛑 Deteniendo scheduler…");
    await supabase.removeChannel(channel);
    console.log("✅ Canal Realtime cerrado. Hasta pronto.");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("💥 Error fatal:", err);
  process.exit(1);
});
