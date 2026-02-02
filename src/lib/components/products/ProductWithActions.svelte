<!-- Product Card with Action Buttons Component -->
<script lang="ts">
  import type { Product, ProductWithBrand } from "$lib/types/entities";
  import { onMount } from "svelte";

  interface ProductWithActionsProps {
    product: ProductWithBrand;
    children?: any;
  }

  let { product, children }: ProductWithActionsProps = $props();
</script>

{#if !product}
  <p>Cannot find product!</p>
{:else}
  <div class="product-with-actions">
    <a href="/products/{product.id}" class="product-image">
      <img src={product.image} alt={product.name} loading="lazy" />
    </a>
    <div class="product-info">
      {#if product.brand}
        <p class="product-brand text-uppercase">{product.brand}</p>
      {/if}
      <h3 class="product-name">{product.name} ({product.size}ml)</h3>
      <p class="product-price">{product.price.toFixed(2)} DA</p>
      <div class="actions-slot">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .product-with-actions {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    overflow: hidden;
    transition: all var(--transition-medium);
    display: flex;
    flex-direction: column;
  }

  .product-with-actions:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }

  .product-image {
    position: relative;
    width: 100%;
    padding-top: 133.33%; /* 3:4 aspect ratio */
    overflow: hidden;
    background-color: var(--color-border);
  }

  .product-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .product-with-actions:hover .product-image img {
    transform: scale(1.05);
  }

  .product-info {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
  }

  .product-brand {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    margin: 0;
  }

  .product-name {
    font-family: var(--font-body);
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .actions-slot {
    margin-top: auto;
  }

  :global(.actions-slot > *) {
    width: 100%;
  }
</style>
