<!-- Products Page -->
<script lang="ts">
  import { t } from "$lib/i18n/translations";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { brands } from "$lib/i18n/brand";
  import type { PageData } from "./$types";

  import ProductCard from "$lib/components/products/ProductCard.svelte";

  let { data }: { data: PageData } = $props();

  // Filter options
  const typeOptions = ["parfum", "montre", "lunettes"];
  const genderOptions = ["Men", "Women", "Unisex"];
  const scentFamilyOptions = [
    "Floral",
    "Fruity",
    "Woody",
    "Oriental",
    "Fresh",
    "Gourmand",
  ];
  const occasionOptions = [
    "Everyday",
    "Evening",
    "Romantic",
    "Sport",
    "Luxury",
  ];
  const sizeOptions = ["Sample", "Standard", "Large"];

  function updateFilter(key: string, value: string): void {
    const params = new URLSearchParams($page.url.searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    goto(`/products?${params.toString()}`);
  }

  function clearFilters(): void {
    goto("/products");
  }
</script>

<svelte:head>
  <title>{$t.products} - {$brands.name}</title>
  <meta
    name="description"
    content="Browse our luxury collection of perfumes, watches, and sunglasses"
  />
</svelte:head>

<div class="products-page">
  <div class="container">
    <h1 class="page-title">{$t.products}</h1>

    <!-- Filters -->
    <div class="filters">
      <h3 class="text-uppercase">{$t.filterBy}</h3>

      <div class="filter-group">
        <label for="type">{$t.type}</label>
        <select
          id="type"
          value={data.filters?.type}
          onchange={(e) => updateFilter("type", e.currentTarget.value)}
        >
          <option value="">{$t.allProducts}</option>
          {#each typeOptions as option}
            <option value={option}>{$t[option as keyof typeof $t]}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="gender">{$t.gender}</label>
        <select
          id="gender"
          value={data.filters?.gender}
          onchange={(e) => updateFilter("gender", e.currentTarget.value)}
        >
          <option value="">{$t.allProducts}</option>
          {#each genderOptions as option}
            <option value={option}
              >{$t[option.toLowerCase() as keyof typeof $t]}</option
            >
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="scent_family">{$t.category}</label>
        <select
          id="scent_family"
          value={data.filters?.scentFamily}
          onchange={(e) => updateFilter("scent_family", e.currentTarget.value)}
        >
          <option value="">{$t.allProducts}</option>
          {#each scentFamilyOptions as option}
            <option value={option}
              >{$t[option.toLowerCase() as keyof typeof $t]}</option
            >
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="occasion">{$t.category}</label>
        <select
          id="occasion"
          value={data.filters?.occasion}
          onchange={(e) => updateFilter("occasion", e.currentTarget.value)}
        >
          <option value="">{$t.allProducts}</option>
          {#each occasionOptions as option}
            <option value={option}
              >{$t[option.toLowerCase() as keyof typeof $t]}</option
            >
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="size">{$t.size}</label>
        <select
          id="size"
          value={data.filters?.size}
          onchange={(e) => updateFilter("size", e.currentTarget.value)}
        >
          <option value="">{$t.allProducts}</option>
          {#each sizeOptions as option}
            <option value={option}
              >{$t[option.toLowerCase() as keyof typeof $t]}</option
            >
          {/each}
        </select>
      </div>

      <button class="clear-filters" onclick={clearFilters}>
        Clear Filters
      </button>
    </div>

    <!-- Products Grid -->
    {#if data.error}
      <div class="error-message">
        <p>{data.error}</p>
      </div>
    {:else if data.products.length === 0}
      <div class="empty-state">
        <p>No products found</p>
      </div>
    {:else}
      <div class="products-grid">
        {#each data.products as product}
          <ProductCard {product} key={product.id} />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .products-page {
    padding: var(--spacing-xl) 0;
    min-height: 60vh;
  }

  .page-title {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    font-family: var(--font-heading);
    letter-spacing: 0.2em;
  }

  /* Filters */
  .filters {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    align-items: end;
  }

  .filters h3 {
    grid-column: 1 / -1;
    margin-bottom: var(--spacing-sm);
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
  }

  .filter-group select {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
  }

  .clear-filters {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-accent);
    color: var(--color-bg);
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.875rem;
    transition: all var(--transition-fast);
  }

  .clear-filters:hover {
    background-color: var(--color-hover);
  }

  /* Products Grid */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
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
    .filters {
      grid-template-columns: 1fr;
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }
  }
</style>
