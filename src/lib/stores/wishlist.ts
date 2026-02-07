import { writable } from 'svelte/store';

// Set to keep track of liked product IDs
const getInitialWishlist = (): number[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch {
                return [];
            }
        }
    }
    return [];
};

export const wishlist = writable<number[]>(getInitialWishlist());

if (typeof window !== 'undefined') {
    wishlist.subscribe((current: number[]) => {
        localStorage.setItem('wishlist', JSON.stringify(current));
    });
}

export function toggleWishlist(productId: number): void {
    wishlist.update((current) => {
        if (current.includes(productId)) {
            return current.filter((id) => id !== productId);
        } else {
            return [...current, productId];
        }
    });
}

export function isInWishlist(productId: number, currentWishlist: number[]): boolean {
    return currentWishlist.includes(productId);
}
