import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Временно отключен для тестирования
export function middleware(request: NextRequest) {
  console.log('Middleware called:', {
    url: request.url,
    method: request.method,
    pathname: request.nextUrl.pathname
  });

  // Просто пропускаем все запросы
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Временно отключаем все матчеры
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 