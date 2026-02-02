import { derived } from "svelte/store";
import { language } from ".";

// Translations for French, English, and Arabic
export type Language = 'fr' | 'en' | 'ar';

export interface Translations {
    // Navigation
    home: string;
    products: string;
    cart: string;
    admin: string;
    search: string;

    // Product types
    parfum: string;
    montre: string;
    lunettes: string;

    // Categories
    eauDeParfum: string;
    eauDeToilette: string;
    cologne: string;
    bodyMist: string;

    // Gender
    men: string;
    women: string;
    unisex: string;

    // Scent families
    floral: string;
    fruity: string;
    woody: string;
    oriental: string;
    fresh: string;
    gourmand: string;

    // Occasions
    everyday: string;
    evening: string;
    romantic: string;
    sport: string;
    luxury: string;

    // Sizes
    sample: string;
    standard: string;
    large: string;

    // Actions
    addToCart: string;
    checkout: string;
    apply: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    create: string;

    // Cart
    yourCart: string;
    emptyCart: string;
    subtotal: string;
    total: string;
    couponCode: string;

    // Checkout
    customerName: string;
    phoneNumber: string;
    address: string;
    wilaya: string;
    placeOrder: string;

    // Admin
    dashboard: string;
    manageProducts: string;
    manageBrands: string;
    manageOrders: string;
    manageCoupons: string;

    // Order status
    pending: string;
    shipped: string;
    completed: string;
    canceled: string;

    // Common
    price: string;
    description: string;
    brand: string;
    name: string;
    type: string;
    category: string;
    gender: string;
    size: string;

    // Cookie consent
    cookieMessage: string;
    accept: string;
    decline: string;

    // Footer
    slogan: string;
    location: string;
    email: string;

    // Filters
    filterBy: string;
    allProducts: string;

    allRightsReserved: string;
    categories: string;

    contact: string;
}

export const t = derived<typeof language, Translations>(
    language,
    ($language: Language) => translations[$language]
);

export const translations: Record<Language, Translations> = {

    fr: {
        contact: 'Contact',
        categories: 'Catégories',
        home: 'Accueil',
        products: 'Produits',
        cart: 'Panier',
        admin: 'Admin',
        search: 'Rechercher',

        parfum: 'Parfum',
        montre: 'Montre',
        lunettes: 'Lunettes',

        eauDeParfum: 'Eau de Parfum',
        eauDeToilette: 'Eau de Toilette',
        cologne: 'Cologne',
        bodyMist: 'Body Mist',

        men: 'Homme',
        women: 'Femme',
        unisex: 'Unisexe',

        floral: 'Floral',
        fruity: 'Fruité',
        woody: 'Boisé',
        oriental: 'Oriental',
        fresh: 'Frais',
        gourmand: 'Gourmand',

        everyday: 'Quotidien',
        evening: 'Soirée',
        romantic: 'Romantique',
        sport: 'Sport',
        luxury: 'Luxe',

        sample: 'Échantillon',
        standard: 'Standard',
        large: 'Grand',

        addToCart: 'Ajouter au panier',
        checkout: 'Commander',
        apply: 'Appliquer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        create: 'Créer',

        yourCart: 'Votre panier',
        emptyCart: 'Votre panier est vide',
        subtotal: 'Sous-total',
        total: 'Total',
        couponCode: 'Code promo',

        customerName: 'Nom complet',
        phoneNumber: 'Téléphone',
        address: 'Adresse',
        wilaya: 'Wilaya',
        placeOrder: 'Passer la commande',

        dashboard: 'Tableau de bord',
        manageProducts: 'Gérer les produits',
        manageBrands: 'Gérer les marques',
        manageOrders: 'Gérer les commandes',
        manageCoupons: 'Gérer les coupons',

        pending: 'En attente',
        shipped: 'Expédié',
        completed: 'Terminé',
        canceled: 'Annulé',

        price: 'Prix',
        description: 'Description',
        brand: 'Marque',
        name: 'Nom',
        type: 'Type',
        category: 'Catégorie',
        gender: 'Genre',
        size: 'Taille',

        cookieMessage: 'Nous utilisons des cookies pour améliorer votre expérience.',
        accept: 'Accepter',
        decline: 'Refuser',

        slogan: 'Elegance is not loud.',
        location: 'Bab Ezzouar, Alger',
        email: 'contact.gentlemann@gmail.com',

        filterBy: 'Filtrer par',
        allProducts: 'Tous les produits',
        allRightsReserved: 'Tous droits réservés'
    },
    en: {
        contact: 'Contact',
        categories: 'Categories',
        home: 'Home',
        products: 'Products',
        cart: 'Cart',
        admin: 'Admin',
        search: 'Search',

        parfum: 'Perfume',
        montre: 'Watch',
        lunettes: 'Sunglasses',

        eauDeParfum: 'Eau de Parfum',
        eauDeToilette: 'Eau de Toilette',
        cologne: 'Cologne',
        bodyMist: 'Body Mist',

        men: 'Men',
        women: 'Women',
        unisex: 'Unisex',

        floral: 'Floral',
        fruity: 'Fruity',
        woody: 'Woody',
        oriental: 'Oriental',
        fresh: 'Fresh',
        gourmand: 'Gourmand',

        everyday: 'Everyday',
        evening: 'Evening',
        romantic: 'Romantic',
        sport: 'Sport',
        luxury: 'Luxury',

        sample: 'Sample',
        standard: 'Standard',
        large: 'Large',

        addToCart: 'Add to cart',
        checkout: 'Checkout',
        apply: 'Apply',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',

        yourCart: 'Your cart',
        emptyCart: 'Your cart is empty',
        subtotal: 'Subtotal',
        total: 'Total',
        couponCode: 'Coupon code',

        customerName: 'Full name',
        phoneNumber: 'Phone',
        address: 'Address',
        wilaya: 'Wilaya',
        placeOrder: 'Place order',

        dashboard: 'Dashboard',
        manageProducts: 'Manage products',
        manageBrands: 'Manage brands',
        manageOrders: 'Manage orders',
        manageCoupons: 'Manage coupons',

        pending: 'Pending',
        shipped: 'Shipped',
        completed: 'Completed',
        canceled: 'Canceled',

        price: 'Price',
        description: 'Description',
        brand: 'Brand',
        name: 'Name',
        type: 'Type',
        category: 'Category',
        gender: 'Gender',
        size: 'Size',

        cookieMessage: 'We use cookies to improve your experience.',
        accept: 'Accept',
        decline: 'Decline',

        slogan: 'Elegance is not loud.',
        location: 'Bab Ezzouar, Algiers',
        email: 'contact.gentlemann@gmail.com',

        filterBy: 'Filter by',
        allProducts: 'All products',

        allRightsReserved: 'All rights reserved',
    },
    ar: {
        contact: 'اتصل بنا',
        categories: 'التصنيفات',
        home: 'الرئيسية',
        products: 'المنتجات',
        cart: 'السلة',
        admin: 'الإدارة',
        search: 'بحث',

        parfum: 'عطر',
        montre: 'ساعة',
        lunettes: 'نظارات',

        eauDeParfum: 'عطر مركز',
        eauDeToilette: 'عطر خفيف',
        cologne: 'كولونيا',
        bodyMist: 'رذاذ الجسم',

        men: 'رجال',
        women: 'نساء',
        unisex: 'للجنسين',

        floral: 'زهري',
        fruity: 'فاكهي',
        woody: 'خشبي',
        oriental: 'شرقي',
        fresh: 'منعش',
        gourmand: 'حلو',

        everyday: 'يومي',
        evening: 'مسائي',
        romantic: 'رومانسي',
        sport: 'رياضي',
        luxury: 'فاخر',

        sample: 'عينة',
        standard: 'قياسي',
        large: 'كبير',

        addToCart: 'أضف إلى السلة',
        checkout: 'إتمام الطلب',
        apply: 'تطبيق',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        create: 'إنشاء',

        yourCart: 'سلتك',
        emptyCart: 'سلتك فارغة',
        subtotal: 'المجموع الفرعي',
        total: 'المجموع',
        couponCode: 'رمز الخصم',

        customerName: 'الاسم الكامل',
        phoneNumber: 'الهاتف',
        address: 'العنوان',
        wilaya: 'الولاية',
        placeOrder: 'تأكيد الطلب',

        dashboard: 'لوحة التحكم',
        manageProducts: 'إدارة المنتجات',
        manageBrands: 'إدارة العلامات',
        manageOrders: 'إدارة الطلبات',
        manageCoupons: 'إدارة الكوبونات',

        pending: 'قيد الانتظار',
        shipped: 'تم الشحن',
        completed: 'مكتمل',
        canceled: 'ملغي',

        price: 'السعر',
        description: 'الوصف',
        brand: 'العلامة',
        name: 'الاسم',
        type: 'النوع',
        category: 'الفئة',
        gender: 'الجنس',
        size: 'الحجم',

        cookieMessage: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك.',
        accept: 'قبول',
        decline: 'رفض',

        slogan: 'الأناقة ليست صاخبة.',
        location: 'باب الزوار، الجزائر',
        email: 'contact.gentlemann@gmail.com',

        filterBy: 'تصفية حسب',
        allProducts: 'جميع المنتجات',
        allRightsReserved: 'جميع الحقوق محفوظة'
    }
};

