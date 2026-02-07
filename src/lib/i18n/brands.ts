import type { Readable } from "svelte/store";
import type { Language } from "$lib/i18n";

import { language } from "$lib/i18n";
import { derived } from "svelte/store";

export interface TData {
    [key: string]: string;
}

export const DATA: Record<Language, TData> = {

    en: {
        title: "Our Brands",
        description: "Discover our major brands, world-class perfumes."
    },

    fr: {
        title: "Nos marques",
        description: "Découvrez nos marques majeures, des parfums de première classe."
    },

    ar: {
        title: "علاماتنا التجارية",
        description: "اكتشفوا علاماتنا التجارية الرائدة، وعطورنا من الدرجة الأولى.",
    },
}

// Derived store for current translations
export const brandSection: Readable<TData> = derived<typeof language, TData>(
    language,
    ($language: Language) => DATA[$language]
);
