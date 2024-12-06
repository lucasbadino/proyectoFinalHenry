// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Establecer los encabezados CORS
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar las solicitudes OPTIONS (pre-flight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  return response;
}

// Configura el middleware para que se aplique solo a las rutas de la API
export const config = {
  matcher: ['/api/:path*'],  // Esta es la forma correcta de aplicar a todas las rutas bajo /api
};
