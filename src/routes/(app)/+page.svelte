<!-- Homepage -->
<script lang="ts">
    import { brands } from "$lib/i18n/brand.js";

    import MainPage from "$lib/components/ui/MainPage.svelte";
    import HomePage from "$lib/components/Pages/Homepage/HomePage.svelte";

    let { data } = $props();
</script>

<MainPage
    title="{$brands.name} &bull; {$brands.slogan}"
    description="Luxury perfumes, watches, and sunglasses in Algeria"
>
    <HomePage {data} />
</MainPage>
