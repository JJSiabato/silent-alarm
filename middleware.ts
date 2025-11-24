import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const userEmail = request.cookies.get('user_email')?.value;

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isPublicApi =
    request.nextUrl.pathname.startsWith('/api/login') ||
    request.nextUrl.pathname.startsWith('/api/logout');

  // Proteger rutas que requieren autenticación
  if (!userEmail && !isAuthRoute && !isPublicApi) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Si el usuario está autenticado y está en /auth, redirigir a home
  if (userEmail && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|json)$).*)',
  ],
};

