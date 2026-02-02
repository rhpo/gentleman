// Cart store with localStorage persistence
import { writable, derived } from 'svelte/store';

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Cart {
    items: CartItem[];
    couponCode: string | null;
    discount: number;
}

// Get initial cart from localStorage
const getInitialCart = (): Cart => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Ensure items is an array
                if (!parsed || !Array.isArray(parsed.items)) {
                    return { items: [], couponCode: null, discount: 0 };
                }
                return parsed;
            } catch {
                return { items: [], couponCode: null, discount: 0 };
            }
        }
    }
    return { items: [], couponCode: null, discount: 0 };
};

// Cart store
export const cart = writable<Cart>(getInitialCart());

// Subscribe to cart changes and persist to localStorage
if (typeof window !== 'undefined') {
    cart.subscribe((currentCart: Cart) => {
        localStorage.setItem('cart', JSON.stringify(currentCart));
    });
}

// Derived store for cart total
export const cartTotal = derived(cart, ($cart: Cart) => {
    const items = $cart?.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - (subtotal * ($cart?.discount || 0)) / 100;
    return { subtotal, total, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
});

// Helper functions
export function addToCart(item: Omit<CartItem, 'quantity'>): void {
    cart.update((currentCart: Cart) => {
        const existingItem = currentCart.items.find((i) => i.productId === item.productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            currentCart.items.push({ ...item, quantity: 1 });
        }
        return currentCart;
    });
}

export function removeFromCart(productId: number): void {
    cart.update((currentCart: Cart) => {
        currentCart.items = currentCart.items.filter((item) => item.productId !== productId);
        return currentCart;
    });
}

export function updateQuantity(productId: number, quantity: number): void {
    cart.update((currentCart: Cart) => {
        const item = currentCart.items.find((i) => i.productId === productId);
        if (item) {
            if (quantity <= 0) {
                currentCart.items = currentCart.items.filter((i) => i.productId !== productId);
            } else {
                item.quantity = quantity;
            }
        }
        return currentCart;
    });
}

export function applyCoupon(code: string, discount: number): void {
    cart.update((currentCart: Cart) => {
        currentCart.couponCode = code;
        currentCart.discount = discount;
        return currentCart;
    });
}

export function clearCart(): void {
    cart.set({ items: [], couponCode: null, discount: 0 });
}
