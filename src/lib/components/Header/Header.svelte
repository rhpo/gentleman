<!-- Header Component -->
<script lang="ts">
    import PromotionBar from "./PromotionBar.svelte";
    import NavigationBar from "./NavigationBar.svelte";

    import { promos } from "$lib/i18n/promotions";
</script>

<header>
    <PromotionBar promos={[...$promos]} />
    <NavigationBar />
</header>

<style>
    header {
        position: sticky;
        top: calc(-1 * var(--promo-height));
        z-index: 100;
    }
</style>
