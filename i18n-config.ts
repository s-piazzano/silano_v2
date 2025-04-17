export const locales = ['it', 'en'] as const;
export const defaultLocale = 'it';
export type Locale = typeof locales[number];    