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

  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Ingresa un correo válido.' },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Verificar que el usuario exista en la tabla public.users
  const { data: userInDb, error: dbError } = await adminClient
    .from('users')
    .select('id, email, full_name')
    .eq('email', normalizedEmail)
    .single();

  if (dbError || !userInDb) {
    return NextResponse.json(
      { error: 'Este correo no tiene acceso. Contacta al administrador.' },
      { status: 401 }
    );
  }

  // Si el correo existe, establecer una cookie de sesión simple
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true, email: normalizedEmail });
  
  // Establecer cookie de sesión (válida por 30 días)
  response.cookies.set('user_email', normalizedEmail, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: '/',
  });

  return response;
}

