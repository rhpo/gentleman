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

  function updateFilter(key: string, value: string): void {
    const params = new URLSearchParams($page.url.searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    goto(`/products?${params.toString()}`);
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
          {#if data.filters?.gender === "Men"}
            <h1 class="text-center">{$t.forMen}</h1>
          {:else if data.filters?.gender === "Women"}
            <h1 class="text-center">{$t.forWomen}</h1>
          {:else if data.filters?.gender === "Unisex"}
            <h1 class="text-center">{$t.forMixture}</h1>
          {/if}
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
          {#each data.products as product (product.id)}
            <ProductCard {product} />
          {/each}
        </div>
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
