import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export async function GET(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !adminClient) {
    return NextResponse.json(
      { error: 'Falta configurar las variables de entorno de Supabase.' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    if (!since) {
      return NextResponse.json(
        { error: 'Parámetro "since" requerido' },
        { status: 400 }
      );
    }

    const sinceDate = new Date(since);

    // Obtener alertas creadas después de la fecha especificada
    const { data: alerts, error } = await adminClient
      .from('alerts')
      .select('id, user_id, location_text, created_at')
      .eq('is_active', true)
      .gt('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error obteniendo alertas:', error);
      return NextResponse.json(
        { error: 'Error al obtener alertas' },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: alerts || [] });
  } catch (error: any) {
    console.error('Error en GET /api/alerts/check:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud: ' + error.message },
      { status: 500 }
    );
  }
}

