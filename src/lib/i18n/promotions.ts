import type { Readable } from "svelte/store";
import type { Language } from "$lib/i18n";

import { language } from "$lib/i18n/index";
import { derived } from "svelte/store";

export type TPromotion = string[];

// "LIVRAISON GRATUITE À PARTIR DE 5000DA",
// "NOUVELLE COLLECTION DISPONIBLE",
// "OFFRE SPÉCIALE: -20% SUR TOUS LES PARFUMS",

export const promotions: Record<Language, TPromotion> = {
    en: [
        "DISCOVER OUR LATEST COLLECTION",
        "STORE AT BAB EZZOUAR, ALGIERS!",
        "EXPLORE OUR CATALOG",
    ],

    fr: [
        "DÉCOUVREZ NOTRE NOUVELLE COLLECTION",
        "TROUVEZ NOTRE MAGASIN À BAB EZZOUAR, ALGER!",
        "EXPLOREZ NOTRE CATALOGUE",
    ],

    ar: [
        "اكتشف مجموعتنا الجديدة",
        "تجدون متجرنا في باب الزوار، الجزائر!",
        "تصفح كتالوجنا",
    ],
};

export const promos: Readable<TPromotion> = derived<typeof language, TPromotion>(
    language,
    ($language: Language) => promotions[$language]
);
