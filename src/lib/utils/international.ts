
import type { Language } from "$lib/i18n";
import emojiFromCC from "country-flag-icons/unicode";

const languageNames: Record<Language, string> = {
    en: "English",
    fr: "Français",
    ar: "العربية",
};

export function languageToCountryCode(lang: Language) {
    const map = { fr: "FR", en: "GB", ar: "DZ" };
    return map[lang];
}

export function CountryCodeToEmoji(cc: string) {
    return emojiFromCC(cc);
}

export function languageToEmoji(lang: Language) {
    return CountryCodeToEmoji(languageToCountryCode(lang));
}

export function languageName(lang: Language) {
    return languageNames[lang];
}
