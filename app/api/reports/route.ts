import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !adminClient) {
    return NextResponse.json(
      { error: 'Falta configurar las variables de entorno de Supabase.' },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const userEmail = cookieStore.get('user_email')?.value;

  if (!userEmail) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { category, description, latitude, longitude, location_text } = body;

    if (!category) {
      return NextResponse.json(
        { error: 'La categoría es requerida' },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitud y longitud son requeridas' },
        { status: 400 }
      );
    }

    // Obtener el usuario de la base de datos usando el email
    const { data: user, error: userError } = await adminClient
      .from('users')
      .select('id')
      .eq('email', userEmail.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Insertar el reporte usando el admin client (bypass RLS)
    const { data: report, error: insertError } = await adminClient
      .from('suspicious_reports')
      .insert({
        user_id: user.id,
        category,
        description: description || null,
        latitude: latitude,
        longitude: longitude,
        location_text: location_text || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error insertando reporte:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar el reporte: ' + insertError.message },
        { status: 500 }
      );
    }

    // Emitir evento Socket.IO para notificar a todos los clientes
    // En Vercel, global.io puede no estar disponible, así que lo hacemos opcional
    try {
      if (global.io) {
        const reportData = {
          id: report.id,
          user_id: user.id,
          category: category,
          description: description || null,
          latitude: latitude,
          longitude: longitude,
          location_text: location_text,
          created_at: report.created_at,
        };
        console.log('Emitting new_report event:', reportData);
        global.io.emit('new_report', reportData);
      } else {
        console.log('Socket.IO no disponible (modo serverless), los clientes usarán polling');
      }
    } catch (error) {
      console.warn('Error emitiendo evento Socket.IO:', error);
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Error en POST /api/reports:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud: ' + error.message },
      { status: 500 }
    );
  }
}

