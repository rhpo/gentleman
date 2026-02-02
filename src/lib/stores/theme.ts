// Theme store for dark/light mode
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

// Get initial theme from localStorage or default to light
const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    }
    return 'light';
};

// Theme store
export const theme = writable<Theme>(getInitialTheme());

// Subscribe to theme changes and persist to localStorage
if (typeof window !== 'undefined') {
    theme.subscribe((currentTheme: Theme) => {
        localStorage.setItem('theme', currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    });
}

// Helper function to toggle theme
export function toggleTheme(): void {
    theme.update((current: Theme) => (current === 'light' ? 'dark' : 'light'));
}
