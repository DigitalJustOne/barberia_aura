import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo se necesita GET o POST
  
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: 'Supabase credentials missing' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Consulta ligera para mantener viva la base de datos de Supabase
    // Intentamos con la tabla 'citas' que sabemos que existe en el proyecto
    const { data, error } = await supabase
      .from('citas')
      .select('id')
      .limit(1);

    if (error) {
      console.warn("Error en la consulta keep-alive a Supabase (quizás la tabla no existe o permisos):", error.message);
      // Retornar 200 de todos modos para que el cron job no falle constantemente si solo está inactiva por diseño,
      // pero el request a supabase ya despierta la DB que es el objetivo.
      return res.status(200).json({ status: 'pinged', warning: error.message });
    }

    return res.status(200).json({ status: 'alive', data: data ? 'ok' : 'empty' });
  } catch (error: any) {
    console.error('Error en keep-alive cron job:', error);
    return res.status(500).json({ error: error.message || 'Error interno' });
  }
}
