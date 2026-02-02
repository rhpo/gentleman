import type { Readable } from "svelte/store";
import type { Language } from "$lib/i18n";

import { language } from "$lib/i18n";
import { derived } from "svelte/store";
import { brands } from "../brand";

export interface Translation {
    hero_small_title: string;
    hero_title: string;
    hero_button: string;

    slides: {
        title: string;
        description?: string;
        image: string;
        button?: string;
    }[];
}

const data: Readable<Record<Language, Translation>> =
    derived(brands, ($brands) => ({
        en: {
            hero_small_title: $brands.name + " Addict",
            hero_title: 'New collection of gourmet and colored perfumes',
            hero_button: 'Discover our perfumes',

            slides: [
                {
                    title: 'Elegance is not loud.',
                    description: '“Perfume is like a signature; it tells the world who you are without saying a word.” — Christian Dior',
                    image: "/media/hero2.jpg",
                },

                {
                    title: 'A perfume for every season.',
                    description: 'Discover our new collection of perfumes that adapt to your mood and style throughout the year.',
                    image: '/media/seasons.jpg',
                    button: 'Explore the collection',
                }
            ]
        },
        fr: {
            hero_small_title: $brands.name + " Addict",
            hero_title: 'Une nouvelle collection de parfums gourmands et colorés',
            hero_button: 'Découvrez nos parfums',

            slides: [

                {
                    title: "L'élégance n'est pas bruyante.",
                    description: '« Le parfum est comme une signature ; il dit au monde qui vous êtes sans dire un mot. » — Christian Dior',
                    image: "/media/hero2.jpg",
                },

                {
                    title: 'Un parfum pour chaque saison.',
                    description: 'Découvrez notre nouvelle collection de parfums qui s\'adaptent à votre humeur et à votre style tout au long de l\'année.',
                    image: '/media/seasons.jpg',
                    button: 'Explorer la collection',
                }
            ]
        },
        ar: {
            hero_small_title: $brands.name + " اديكت",
            hero_title: 'مجموعة جديدة من العطور الملونة والكهة',
            hero_button: 'اكتشف عطورنا',

            slides: [

                {
                    title: 'الأناقة ليست صاخبة.',
                    description: '“العطر مثل التوقيع؛ يخبر العالم من أنت دون أن تقول كلمة.” — كريستيان ديور',
                    image: "/media/hero2.jpg",
                },

                {
                    title: 'عطر لكل موسم.',
                    description: 'اكتشف مجموعتنا الجديدة من العطور التي تتكيف مع مزاجك وأسلوبك طوال العام.',
                    image: '/media/seasons.jpg',
                    button: 'استكشف المجموعة',
                }
            ]
        },
    }));

// Derived store for current translations
export const homepage: Readable<Translation> = derived(
    [language, data],
    ([$language, $data]) => $data[$language]
);
