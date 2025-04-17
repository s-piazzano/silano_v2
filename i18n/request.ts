import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../i18n-config';

export default getRequestConfig(async ({ locale = 'it' }) => {
    // Validazione del locale
    if (!locale || !locales.includes(locale as any)) {
        console.error(`Locale non supportato: ${locale}`);
        notFound();
    }

    try {
        // Import dinamico delle traduzioni
        const messages = (await import(`../locales/${locale}.json`)).default;

        return {
            messages,
            locale
        };
    } catch (error) {
        console.error(`Errore nel caricamento delle traduzioni per ${locale}:`, error);
        notFound();
    }
});