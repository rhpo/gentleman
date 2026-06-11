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
        "QUALITY WALLPAPERS FOR EVERY INTERIOR",
        "EXPLORE OUR CATALOG",
    ],

    fr: [
        "DÉCOUVREZ NOTRE NOUVELLE COLLECTION",
        "PAPIERS PEINTS DE QUALITÉ POUR TOUS LES INTÉRIEURS",
        "EXPLOREZ NOTRE CATALOGUE",
    ],

    ar: [
        "اكتشف مجموعتنا الجديدة",
        "ورق جدران عالي الجودة لجميع المساحات",
        "تصفح كتالوجنا",
    ],
};

export const promos: Readable<TPromotion> = derived<typeof language, TPromotion>(
    language,
    ($language: Language) => promotions[$language]
);
