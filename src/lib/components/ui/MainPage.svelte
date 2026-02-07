<script>
    import { brands } from "$lib/i18n/brand";

    let { title, description, children } = $props();
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>
        {title
            ? title + ` - ${$brands.name}`
            : `${$brands.name} - Elegance is not loud`}
    </title>

    <meta
        name="description"
        content={description ||
            `${$brands.name} - Luxury perfumes, watches, and sunglasses in Algeria`}
    />

    <meta
        property="og:title"
        content={title
            ? title + ` - ${$brands.name}`
            : `${$brands.name} - Elegance is not loud`}
    />

    <meta
        property="og:description"
        content="Luxury perfumes, watches, and sunglasses"
    />

    <meta property="og:type" content="website" />

    <link rel="canonical" href="https://gentleman.dz" />
</svelte:head>

{@render children?.()}
