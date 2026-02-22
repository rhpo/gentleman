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
        button_href?: string;
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
                    title: 'A perfume for every season.',
                    description: 'Discover our new collection of perfumes that adapt to your mood and style throughout the year.',
                    image: '/media/seasons.jpg',
                    button: 'Explore the collection',
                    button_href: '/products?category=parfum',
                },
                {
                    title: 'Perfumes for Men',
                    description: 'Elegance and strength in every bottle.',
                    image: '/media/men.jpg',
                    button: 'Shop for Men',
                    button_href: '/products?gender=Men',
                },
                {
                    title: 'Perfumes for Women',
                    description: 'Sophistication and grace for the modern woman.',
                    image: '/media/women.jpg',
                    button: 'Shop for Women',
                    button_href: '/products?gender=Women',
                },
                {
                    title: 'Elegance is not loud.',
                    description: '“Perfume is like a signature; it tells the world who you are without saying a word.” — Christian Dior',
                    image: "/media/hero2.jpg",
                },
            ]
        },
        fr: {
            hero_small_title: $brands.name + " Addict",
            hero_title: 'Une nouvelle collection de parfums gourmands et colorés',
            hero_button: 'Découvrez nos parfums',

            slides: [
                {
                    title: 'Un parfum pour chaque saison.',
                    description: 'Découvrez notre nouvelle collection de parfums qui s\'adaptent à votre humeur et à votre style tout au long de l\'année.',
                    image: '/media/seasons.jpg',
                    button: 'Explorer la collection',
                    button_href: '/products?category=parfum',
                },
                {
                    title: 'Parfums pour Homme',
                    description: "L'élégance et la force dans chaque flacon.",
                    image: '/media/men-perfume.jpg',
                    button: 'Acheter pour Homme',
                    button_href: '/products?gender=Men',
                },
                {
                    title: 'Parfums pour Femme',
                    description: 'Sophistication et grâce pour la femme moderne.',
                    image: '/media/women-perfume.jpg',
                    button: 'Acheter pour Femme',
                    button_href: '/products?gender=Women',
                },
                {
                    title: "L'élégance n'est pas bruyante.",
                    description: '« Le parfum est comme une signature ; il dit au monde qui vous êtes sans dire un mot. » — Christian Dior',
                    image: "/media/hero2.jpg",
                },
            ]
        },
        ar: {
            hero_small_title: $brands.name + " " + "عاشق",
            hero_title: 'مجموعة جديدة من العطور الملونة والفاكهة',
            hero_button: 'اكتشف عطورنا',

            slides: [
                {
                    title: 'عطر لكل موسم.',
                    description: 'اكتشف مجموعتنا الجديدة من العطور التي تتكيف مع مزاجك وأسلوبك طوال العام.',
                    image: '/media/seasons.jpg',
                    button: 'استكشف المجموعة',
                    button_href: '/products?category=parfum',
                },
                {
                    title: 'عطور للرجال',
                    description: 'الأناقة والقوة في كل زجاجة.',
                    image: '/media/men-perfume.jpg',
                    button: 'تسوق للرجال',
                    button_href: '/products?gender=Men',
                },
                {
                    title: 'عطور للنساء',
                    description: 'الرقي والجمال للمرأة العصرية.',
                    image: '/media/women-perfume.jpg',
                    button: 'تسوق للنساء',
                    button_href: '/products?gender=Women',
                },
                {
                    title: 'الأناقة ليست صاخبة.',
                    description: '“العطر مثل التوقيع؛ يخبر العالم من أنت دون أن تقول كلمة.” — كريستيان ديور',
                    image: "/media/hero2.jpg",
                },
            ]
        },
    }));

// Derived store for current translations
export const homepage: Readable<Translation> = derived(
    [language, data],
    ([$language, $data]) => $data[$language]
);
