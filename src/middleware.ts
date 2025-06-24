import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Базовый middleware — не проверяет авторизацию, просто пропускает все запросы
export function middleware(request: NextRequest) {
  // Можно добавить другие проверки или редиректы, если потребуется
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Оставляем шаблон для будущих целей (например, локализация, A/B тесты и т.д.)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 