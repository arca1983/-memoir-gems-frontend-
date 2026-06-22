import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  // surface the resolved locale on a header so the (locale-unaware) root
  // layout can set <html lang> correctly for SEO / accessibility.
  const match = request.nextUrl.pathname.match(/^\/(en|es)(?:\/|$)/);
  if (match) response.headers.set('x-locale', match[1]);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
