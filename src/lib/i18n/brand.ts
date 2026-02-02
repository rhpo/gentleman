import type { Readable } from "svelte/store";
import type { Language } from "$lib/i18n";

import { language } from "$lib/i18n";
import { derived } from "svelte/store";

export interface TBrand {
    name: string;
    slogan: string;
    email: string;
    location: string;
}

export const BRAND: Record<Language, TBrand> = {

    en: {
        name: "Gentleman",
        slogan: "Elegance is not loud.",
        email: "contact.gentlemann@gmail.com",
        location: "Bab Ezzouar, Algiers, Algeria"
    },

    fr: {
        name: "Gentleman",
        slogan: "L'élégance n'est pas bruyante.",
        email: "contact.gentlemann@gmail.com",
        location: "Bab Ezzouar, Alger, Algérie"
    },

    ar: {
        name: "جنتلمن",
        slogan: "الأناقة ليست صاخبة.",
        email: "contact.gentlemann@gmail.com",
        location: "البب الزوار، الجزائر، الجزائر"
    },
}

// Derived store for current translations
export const brands: Readable<TBrand> = derived<typeof language, TBrand>(
    language,
    ($language: Language) => BRAND[$language]
);
