<script lang="ts">
  import type { ProductWithBrand } from "$lib/types/entities";
  import { Crown, Heart, Mars, Venus } from "@lucide/svelte";
  import { wishlist, toggleWishlist, isInWishlist } from "$lib/stores/wishlist";
  import { t } from "$lib/i18n/translations";

  import { extractColors } from "extract-colors";

  interface ProductWithActionsProps {
    product: ProductWithBrand;
    children?: any;
  }

  let { product, children }: ProductWithActionsProps = $props();

  let dominantColor = $state("rgba(0,0,0,0.15)");

  function getGenderLabel(gender: string) {
    if (gender === "Men") return $t.men;
    if (gender === "Women") return $t.women;
    return $t.unisex;
  }

  async function handleColorExtract(img: HTMLImageElement) {
    try {
      // use extract‑colors library on proxied image src
      const colors = await extractColors(img.src, {
        // filter out near‑white
        colorValidator: (
          r: number,
          g: number,
          b: number,
          alpha: number = 255,
        ) => alpha > 250 && !(r > 220 && g > 220 && b > 220),
        distance: 0.2,
      });

      // pick the first/extracted dominant
      if (colors && colors.length > 0) {
        const c = colors[0];
        dominantColor = `rgba(${c.red},${c.green},${c.blue},0.5)`;
      }
    } catch (err) {
      console.error("Color extraction failed:", err);
    }
  }
</script>

{#if !product}
  <div class="product-error">Cannot find product!</div>
{:else}
  <div class="product-card-premium" style={`--dominant:${dominantColor}`}>
    <div class="image-container">
      <a href="/products/{product.id}" class="image-link">
        <img
          src={`/api/image?url=${encodeURIComponent(product.image)}`}
          alt={product.name}
          loading="lazy"
          class="main-image"
          onload={(e) =>
            handleColorExtract(e.currentTarget as HTMLImageElement)}
        />
        <div class="image-overlay"></div>
      </a>

      {#if product.gender}
        <span class="category-badge">
          {#if product.gender === "Men"}<Mars
              size={12}
            />{:else if product.gender === "Women"}<Venus
              size={12}
            />{:else}<Crown size={12} />{/if}
          {getGenderLabel(product.gender)}
        </span>
      {/if}

      <div class="top-left-badges">
        {#if product.occasion}
          <span class="etiquette">
            {product.occasion}
          </span>
        {/if}
        {#if product.scent_family}
          <span class="etiquette">
            {product.scent_family}
          </span>
        {/if}
      </div>

      <button
        class="wishlist-btn"
        class:is-liked={isInWishlist(product.id, $wishlist)}
        onclick={() => toggleWishlist(product.id)}
      >
        <Heart
          size={18}
          fill={isInWishlist(product.id, $wishlist) ? "currentColor" : "none"}
        />
      </button>
    </div>

    <div class="product-details">
      <div class="details-header">
        {#if product.brand}<div class="brand-label">{product.brand}</div>{/if}
        {#if product.size}<div class="size-badge">{product.size}ml</div>{/if}
      </div>

      <h3 class="product-title">
        <a href="/products/{product.id}">{product.name}</a>
      </h3>

      {#if product.description}
        <p class="description-preview">
          {product.description}
        </p>
      {/if}

      <div class="product-info-grid">
        <div class="price-tag">{product.price.toLocaleString()} DA</div>
      </div>
      <div class="actions-container">
        {#if children}{@render children()}{/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .product-card-premium {
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* soft fading gradient glow */
  .product-card-premium::after {
    content: "";
    position: absolute;
    bottom: -25%;
    right: -25%;
    width: 150%;
    height: 150%;
    border-radius: 50%;
    background: radial-gradient(circle, var(--dominant) 0%, transparent 50%);
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
  }

  .product-card-premium > * {
    position: relative;
    z-index: 1;
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
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--color-black);
    padding: 0.35rem 0.75rem;
    font-family: var(--font-brand);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 100px;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .top-left-badges {
    position: absolute;
    top: var(--spacing-sm);
    left: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    z-index: 2;
  }

  .etiquette {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: white;
    padding: 0.25rem 0.65rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: 500;
    width: fit-content;
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

  .product-details {
    padding: 1.2rem 1.3rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.4rem;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }

  .brand-label {
    font-family: var(--font-body);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-secondary);
    font-weight: 600;
  }

  .size-badge {
    font-size: 0.7rem;
    background: var(--color-card-bg);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .product-title {
    font-family: var(--font-heading);
    direction: ltr !important;
    font-size: 1.25rem;
    margin: 0;
    font-weight: 500;
    line-height: 1.2;
  }

  .product-title a {
    text-decoration: none;
    color: var(--color-text);
  }

  .description-preview {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0.2rem 0;
    line-height: 1.4;
  }

  .product-info-grid {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  .price-tag {
    display: flex;
    color: var(--color-accent);
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: -0.01em;
  }

  .actions-container {
    margin-top: var(--spacing-sm);
  }

  .product-error {
    padding: var(--spacing-md);
    text-align: center;
    border: 1px dashed var(--color-border);
    color: var(--color-text-secondary);
  }

  :global([data-theme="dark"]) .category-badge {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global([data-theme="dark"]) .wishlist-btn {
    background: var(--color-card-bg);
    color: white;
  }
</style>
