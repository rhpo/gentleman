<!-- Product Card with Action Buttons Component -->
<script lang="ts">
  import type { Product, ProductWithBrand } from "$lib/types/entities";
  import { onMount } from "svelte";

  import { Heart, Mars, Venus } from "@lucide/svelte";
  import { wishlist, toggleWishlist, isInWishlist } from "$lib/stores/wishlist";
  import { t } from "$lib/i18n/translations";

  interface ProductWithActionsProps {
    product: ProductWithBrand;
    children?: any;
  }

  let { product, children }: ProductWithActionsProps = $props();
</script>

{#if !product}
  <div class="product-error">
    <p>Cannot find product!</p>
  </div>
{:else}
  <div class="product-card-premium">
    <div class="image-container">
      <a href="/products/{product.id}" class="image-link">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          class="main-image"
        />
        <div class="image-overlay"></div>
      </a>

      {#if product.gender}
        <span class="category-badge">
          {#if product.gender === "Men"}
            <Mars size={16} />
          {:else}
            <Venus size={16} />
          {/if}

          {product.gender === "Men" ? $t.men : $t.women}
        </span>
      {/if}

      <button
        class="wishlist-btn"
        class:is-liked={isInWishlist(product.id, $wishlist)}
        onclick={() => toggleWishlist(product.id)}
        aria-label="Add to wishlist"
      >
        <Heart
          size={20}
          fill={isInWishlist(product.id, $wishlist) ? "currentColor" : "none"}
        />
      </button>
    </div>

    <div class="product-details">
      <div class="brand-name-wrapper">
        {#if product.brand}
          <span class="brand-label">{product.brand}</span>
        {/if}

        <h3 class="product-title">
          <a href="/products/{product.id}">{product.name}</a>
        </h3>
      </div>

      <div class="product-info-grid">
        <div class="price-tag">
          <span class="currency">DA</span>
          <span class="amount">{product.price.toLocaleString()}</span>
        </div>
        {#if product.size}
          <div class="size-info">{product.size}ml</div>
        {/if}
      </div>

      <div class="actions-container">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .product-card-premium {
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    position: relative;
    transition: all var(--transition-medium);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .product-card-premium:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-lg);
  }

  /* Image Section */
  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 6 / 7;
    overflow: hidden;
    background-color: var(--color-card-bg);
  }

  .image-link {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .product-card-premium:hover .main-image {
    transform: scale(1.08);
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 60%,
      rgba(0, 0, 0, 0.05)
    );
    opacity: 0;
    transition: opacity var(--transition-medium);
  }

  .product-card-premium:hover .image-overlay {
    opacity: 1;
  }

  .category-badge {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    color: var(--color-black);
    padding: 0.25rem 0.75rem;
    font-family: var(--font-brand);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 400;
    z-index: 2;
    border: 1px solid rgba(0, 0, 0, 0.05);

    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .wishlist-btn {
    position: absolute;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-black);
    opacity: 0;
    transform: translateY(10px);
    transition: all var(--transition-medium);
    box-shadow: var(--shadow-sm);
    z-index: 2;
  }

  .product-card-premium:hover .wishlist-btn {
    opacity: 1;
    transform: translateY(0);
  }

  .wishlist-btn:hover,
  .wishlist-btn.is-liked {
    background: var(--color-black);
    color: white;
  }

  .wishlist-btn.is-liked {
    opacity: 1;
    transform: translateY(0);
    color: #ff4444;
  }

  .wishlist-btn.is-liked:hover {
    color: #ff6666;
  }

  :global([data-theme="dark"]) .category-badge {
    background: rgba(0, 0, 0, 0.6);
    color: var(--color-white);
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global([data-theme="dark"]) .wishlist-btn {
    background: var(--color-card-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  /* Details Section */
  .product-details {
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: var(--spacing-xs);
  }

  .brand-name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .brand-label {
    font-family: var(--font-body);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .product-title {
    font-family: var(--font-heading);
    direction: ltr !important;
    font-size: 1.15rem;
    line-height: 1.2;
    margin: 0;
    font-weight: 400;
  }

  .product-title a {
    text-decoration: none;
    color: var(--color-text);
  }

  .product-title a:hover {
    color: var(--color-text-secondary);
  }

  .product-info-grid {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: auto;
    padding-top: var(--spacing-xs);
  }

  .price-tag {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    color: var(--color-text);
  }

  .currency {
    font-size: 0.875rem;
    font-weight: 300;
  }

  .amount {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .size-info {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-weight: 300;
  }

  .actions-container {
    margin-top: var(--spacing-sm);
  }

  :global(.actions-container > *) {
    width: 100%;
  }

  /* Error State */
  .product-error {
    padding: var(--spacing-md);
    text-align: center;
    border: 1px dashed var(--color-border);
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .product-details {
      padding: var(--spacing-sm);
    }

    .product-title {
      font-size: 1.1rem;
    }

    .amount {
      font-size: 1.1rem;
    }

    .wishlist-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
