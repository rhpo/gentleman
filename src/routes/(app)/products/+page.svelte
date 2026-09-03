<!-- Products Page -->
<script lang="ts">
  import { t } from "$lib/i18n/translations";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { brands } from "$lib/i18n/brand";
  import type { PageData } from "./$types";
  import {
    TYPE_OPTIONS,
    GENDER_OPTIONS,
    SCENT_FAMILY_OPTIONS,
    OCCASION_OPTIONS,
    SIZE_OPTIONS,
  } from "$lib/constants/productOptions";
  import {
    Search,
    User,
    Layers,
    Maximize,
    Filter,
    X,
    LayoutGrid,
  } from "@lucide/svelte";

  import ProductCard from "$lib/components/products/ProductCard.svelte";
  import MainPage from "$lib/components/ui/MainPage.svelte";
  import BrandSelector from "$lib/components/ui/BrandSelector.svelte";
  import SearchInput from "$lib/components/ui/SearchInput.svelte";
  import GenderSelector from "$lib/components/ui/GenderSelector.svelte";

  let { data }: { data: PageData } = $props();

  const BATCH_SIZE = 16;
  let visibleCount = $state(BATCH_SIZE);
  let sentinelEl = $state<HTMLElement | null>(null);

  let visibleProducts = $derived(data.products.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < data.products.length);

  // Reset batch count when filter/products change
  $effect(() => {
    data.products;
    visibleCount = BATCH_SIZE;
  });

  function loadMore(): void {
    if (hasMore) {
      visibleCount += BATCH_SIZE;
    }
  }

  // Auto load next 16 products as user scrolls near bottom
  $effect(() => {
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          visibleCount += BATCH_SIZE;
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  });

  function updateFilter(key: string, value: string): void {
    const params = new URLSearchParams($page.url.searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "brand") {
      params.delete("query");
    }

    goto(`/products?${params.toString()}`, { replaceState: true });
  }
</script>

<MainPage
  title={$t.products + " | " + $brands.name}
  description={$t.description}
>
  <div class="products-page">
    <div class="container">
      <!-- Search & Filters -->

      {#if data.filters?.gender}
        <div class="title-wrapper">
          <h1 class="text-center">
            {#if data.filters?.gender === "Men"}
              {$t.forMen}
            {:else if data.filters?.gender === "Women"}
              {$t.forWomen}
            {:else if data.filters?.gender === "Unisex"}
              {$t.forMixture}
            {/if}

            {#if data.filters?.occasion}
              {data.filters?.occasion}
            {/if}
          </h1>
        </div>
      {/if}

      <div class="filters-row">
        <div class="filter-group">
          <label for="occasion"><Layers size={14} /> {$t.category}</label>
          <select
            id="occasion"
            value={data.filters?.occasion}
            onchange={(e) => updateFilter("occasion", e.currentTarget.value)}
          >
            <option value="">{$t.allProducts}</option>
            {#each OCCASION_OPTIONS as option}
              <option value={option.value}
                >{$t[option.i18nKey as keyof typeof $t]}</option
              >
            {/each}
          </select>
        </div>

        <div class="filter-group">
          <BrandSelector
            label={$t.brand}
            brands={data.brands || []}
            value={data.filters?.brand || null}
            onchange={(val) => updateFilter("brand", val)}
          />
        </div>

        <div class="filter-group">
          <label for="size"><Maximize size={14} /> {$t.size}</label>
          <select
            id="size"
            value={data.filters?.size}
            onchange={(e) => updateFilter("size", e.currentTarget.value)}
          >
            <option value="">{$t.allProducts}</option>
            {#each SIZE_OPTIONS as option}
              <option value={option.value}
                >{$t[option.i18nKey as keyof typeof $t]}</option
              >
            {/each}
          </select>
        </div>

        <div class="filter-group">
          <label for="gender"><User size={14} /> {$t.gender}</label>
          <GenderSelector
            value={data.filters?.gender}
            onchange={(val: string) => updateFilter("gender", val)}
          />
        </div>
      </div>

      <div class="filters-header">
        <div class="product-search">
          <SearchInput
            placeholder={$t.searchProducts}
            onSearch={(value: string) => updateFilter("query", value)}
            value={data.filters?.query}
          />
        </div>
      </div>

      <!-- Products Grid -->
      {#if data.error}
        <div class="error-message">
          <p>{data.error}</p>
        </div>
      {:else if data.products.length === 0}
        <div class="empty-state">
          <p>{$t.noProductsFound}.</p>
        </div>
      {:else}
        <div class="products-grid">
          {#each visibleProducts as product (product.id)}
            <ProductCard {product} />
          {/each}
        </div>

        {#if hasMore}
          <div class="lazy-load-container" bind:this={sentinelEl}>
            <div class="spinner"></div>
            <button class="load-more-btn" onclick={loadMore}>
              Load More ({data.products.length - visibleCount} remaining)
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</MainPage>

<style>
  .title-wrapper {
    margin-bottom: var(--spacing-md);
  }

  .products-page {
    padding: var(--spacing-md) 0;
    min-height: 60vh;
  }

  /* Filters Header */
  .filters-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: calc((var(--spacing-md) + var(--spacing-lg)) / 2);
  }

  /* Filters Row */
  .filters-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-sm);
    align-items: end;
    margin-bottom: calc((var(--spacing-sm) + var(--spacing-md)) / 2);
    padding: 0;
  }

  .product-search {
    flex: 1;
    width: 100%;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .filter-group label {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-group select {
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
    height: 40px;
    padding: 0 var(--spacing-sm) !important;
  }

  /* Products Grid */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-sm);
  }

  /* Error and Empty States */
  .error-message,
  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .error-message p,
  .empty-state p {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  /* Lazy Load Controls */
  .lazy-load-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl) 0;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .load-more-btn {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .load-more-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .filters-header {
      flex-direction: column;
      align-items: stretch;
    }

    .filters-row {
      grid-template-columns: 1fr;
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }
  }
</style>
