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
        "FREE DELIVERY FROM 5000DA",
        "NEW COLLECTION AVAILABLE",
        "SPECIAL OFFER: -20% ON ALL <a href=\"/parfums\">PARFUMS</a>",
    ],

    fr: [
        "LIVRAISON GRATUITE À PARTIR DE 5000DA",
        "NOUVELLE COLLECTION DISPONIBLE",
        "OFFRE SPÉCIALE: -20% SUR TOUS LES <a href=\"/parfums\">PARFUMS</a>",
    ],

    ar: [
        "توصيل مجاني للطلبات التي تزيد قيمتها عن 5000 دينار جزائري",
        "إضافة جديدة متاحة",
        "العرض الخاص: -20% على جميع <a href=\"/parfums\">العطور</a>",
    ],

}

export const promos: Readable<TPromotion> = derived<typeof language, TPromotion>(
    language,
    ($language: Language) => promotions[$language]
);
