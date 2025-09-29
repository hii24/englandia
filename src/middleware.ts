import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Блокируем debug-роуты в production, если не включен флаг ENABLE_DEBUG
  if (pathname.startsWith('/api/debug')) {
    const isProd = process.env.NODE_ENV === 'production';
    const enableDebug = process.env.ENABLE_DEBUG === '1' || process.env.ENABLE_DEBUG === 'true';
    if (isProd && !enableDebug) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/debug/:path*'],
};