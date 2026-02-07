<script lang="ts">
    import { onMount } from "svelte";
    import { wishlist } from "$lib/stores/wishlist";
    import { getProductsByIds } from "$lib/api/products";
    import type { ProductWithBrand } from "$lib/api/products";
    import ProductCard from "$lib/components/products/ProductCard.svelte";
    import MainPage from "$lib/components/ui/MainPage.svelte";
    import { t } from "$lib/i18n/translations";
    import { brands } from "$lib/i18n/brand";
    import Button from "$lib/components/ui/Button.svelte";
    import { goto } from "$app/navigation";
    import { ShoppingCart } from "@lucide/svelte";

    let products: ProductWithBrand[] = $state([]);
    let loading = $state(true);

    async function loadProducts(ids: number[]) {
        if (ids.length === 0) {
            products = [];
            loading = false;
            return;
        }

        try {
            loading = true;
            products = await getProductsByIds(ids);
        } catch (error) {
            console.error("Error loading wishlist products:", error);
        } finally {
            loading = false;
        }
    }

    // Reload products when wishlist store changes
    $effect(() => {
        loadProducts($wishlist);
    });
</script>

<MainPage
    title={$t.wishlist + " | " + $brands.name}
    description={$t.yourWishlist}
>
    <div class="wishlist-page">
        <div class="container">
            <h1 class="page-title">{$t.yourWishlist}</h1>

            {#if loading && products.length === 0}
                <div class="loading-state">
                    <div class="spinner"></div>
                </div>
            {:else if products.length === 0}
                <div class="empty-wishlist">
                    <p>{$t.emptyWishlist}</p>
                    <Button
                        type="primary"
                        onclick={() => goto("/products")}
                        Icon={ShoppingCart}
                    >
                        {$t.discover}
                        {$t.products}
                    </Button>
                </div>
            {:else}
                <div class="products-grid">
                    {#each products as product (product.id)}
                        <ProductCard {product} />
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</MainPage>

<style>
    .wishlist-page {
        padding: var(--spacing-xl) 0;
        min-height: 60vh;
    }

    .page-title {
        text-align: center;
        margin-bottom: var(--spacing-lg);
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .empty-wishlist {
        text-align: center;
        padding: var(--spacing-xl);
        background-color: var(--color-card-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
    }

    .empty-wishlist p {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 350px));
        justify-content: center;
        gap: var(--spacing-md);
    }

    .loading-state {
        display: flex;
        justify-content: center;
        padding: var(--spacing-xl);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--spacing-sm);
        }
    }
</style>
