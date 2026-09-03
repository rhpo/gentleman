
import type { Language } from "$lib/i18n";

const languageNames: Record<Language, string> = {
    en: "English",
    fr: "Français",
    ar: "العربية",
};

const languageFlagImages: Record<Language, string> = {
    ar: "/emojis/algeria.png",
    en: "/emojis/uk.png",
    fr: "/emojis/france.png",
};

export function languageToFlagImage(lang: Language) {
    return languageFlagImages[lang] || languageFlagImages.fr;
}

export function languageName(lang: Language) {
    return languageNames[lang];
}
