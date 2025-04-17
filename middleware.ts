import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n-config';

export default createMiddleware({
  // Usa le stesse impostazioni definite in i18n-config
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Match all paths except:
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match root path
    '/'
  ]
};