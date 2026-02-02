import { writable, derived } from 'svelte/store';

export type Language = 'fr' | 'en' | 'ar';
export const languages: Language[] = ['en', 'fr', 'ar'];

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('language');
        if (stored === 'fr' || stored === 'en' || stored === 'ar') {
            return stored;
        }
    }
    return 'fr';
};

export const language = writable<Language>(getInitialLanguage());

if (typeof window !== 'undefined') {
    language.subscribe((lang: Language) => {
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    });
}

export function setLanguage(lang: Language): void {
    language.set(lang);
}

