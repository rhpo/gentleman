import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['country-flag-icons/unicode', '@lucide/svelte', 'phosphor-svelte']
	},
	ssr: {
		noExternal: ['embla-carousel-wheel-gestures', 'embla-carousel-autoplay', 'wheel-gestures']
	}
});
