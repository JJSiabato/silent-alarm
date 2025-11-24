import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Eliminar la cookie de sesión
  response.cookies.set('user_email', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Eliminar inmediatamente
    path: '/',
  });

  return response;
}

