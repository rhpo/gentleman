export interface Option {
    value: string;
    label: string;
    i18nKey: string;
}

export const TYPE_OPTIONS: Option[] = [
    { value: "parfum", label: "Parfum", i18nKey: "parfum" },
    { value: "montre", label: "Montre", i18nKey: "montre" },
    { value: "lunettes", label: "Lunettes", i18nKey: "lunettes" },
];

export const CATEGORY_OPTIONS: Option[] = [
    { value: "Eau de Parfum", label: "Eau de Parfum", i18nKey: "eauDeParfum" },
    { value: "Eau de Toilette", label: "Eau de Toilette", i18nKey: "eauDeToilette" },
    { value: "Cologne", label: "Cologne", i18nKey: "cologne" },
    { value: "Body Mist", label: "Body Mist", i18nKey: "bodyMist" },
];

export const GENDER_OPTIONS: Option[] = [
    { value: "Men", label: "Men", i18nKey: "men" },
    { value: "Women", label: "Women", i18nKey: "women" },
    { value: "Unisex", label: "Unisex", i18nKey: "unisex" },
];

export const SCENT_FAMILY_OPTIONS: Option[] = [
    { value: "Floral", label: "Floral", i18nKey: "floral" },
    { value: "Fruity", label: "Fruity", i18nKey: "fruity" },
    { value: "Woody", label: "Woody", i18nKey: "woody" },
    { value: "Oriental", label: "Oriental", i18nKey: "oriental" },
    { value: "Fresh", label: "Fresh", i18nKey: "fresh" },
    { value: "Gourmand", label: "Gourmand", i18nKey: "gourmand" },
];

export const OCCASION_OPTIONS: Option[] = [
    { value: "Everyday", label: "Everyday", i18nKey: "everyday" },
    { value: "Evening", label: "Evening", i18nKey: "evening" },
    { value: "Romantic", label: "Romantic", i18nKey: "romantic" },
    { value: "Sport", label: "Sport", i18nKey: "sport" },
    { value: "Luxury", label: "Luxury", i18nKey: "luxury" },
];

export const SIZE_OPTIONS: Option[] = [
    { value: "50", label: "Sample", i18nKey: "sample" },
    { value: "100", label: "Standard", i18nKey: "standard" },
    { value: "200", label: "Large", i18nKey: "large" },
];
