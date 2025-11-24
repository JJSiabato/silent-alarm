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

export async function GET() {
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

  // Obtener el usuario de la base de datos usando el email
  const { data: user, error } = await adminClient
    .from('users')
    .select('id, email, full_name')
    .eq('email', userEmail.toLowerCase())
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

