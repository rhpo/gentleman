<!-- Product Detail Page -->
<script lang="ts">
  import type { PageData } from "./$types";
  import type { ProductVariant } from "$lib/types/entities";

  import { t } from "$lib/i18n/translations";
  import { goto } from "$app/navigation";
  import { addToCart } from "$lib/stores/cart";
  import { equalizeImage } from "$lib/utils/imageEqualizer";
  import { ShoppingCart, Zap } from "@lucide/svelte";

  import Button from "$lib/components/ui/Button.svelte";
  import MainPage from "$lib/components/ui/MainPage.svelte";
  import svelteTilt from "vanilla-tilt-svelte";
  import ProductsCarousel from "$lib/components/products/ProductsCarousel.svelte";

  let { data }: { data: PageData } = $props();

  let product = $derived(data.product);
  let recommendations = $derived(data.recommendations ?? []);
  let variants = $derived(
    (product?.variants ?? []).slice().sort((a, b) => a.size - b.size),
  );
  let hasVariants = $derived(variants.length > 0);

  let dominantColor = $derived(data.dominantColor || "transparent");

  let selectedVariant = $state<ProductVariant | null>(null);
  let added = $state(false);

  // Displayed price — variant price if selected, otherwise product base price
  let displayPrice = $derived(selectedVariant?.price ?? product?.price ?? 0);

  function selectVariant(v: ProductVariant) {
    selectedVariant = selectedVariant?.id === v.id ? null : v;
  }

  function handleAddToCart(): void {
    if (!product) return;
    if (hasVariants && !selectedVariant) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      price: displayPrice,
      image: product.image,
      size: selectedVariant?.size ?? (product.size || null),
    });
    added = true;
    setTimeout(() => {
      added = false;
    }, 2000);
  }

  function handleBuyNow(): void {
    if (!product) return;
    if (hasVariants && !selectedVariant) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      price: displayPrice,
      image: product.image,
      size: selectedVariant?.size ?? (product.size || null),
    });
    goto("/checkout");
  }

  let svelteTiltOptions = {
    max: 10,
    speed: 1000,
    perspective: 1000,
    scale: 1.1,
  } as any;
</script>

<MainPage
  title={product?.name || "Product"}
  description={product?.description || ""}
>
  <main>
    {#if dominantColor !== "transparent"}
      <div class="blur" style:--dominant={dominantColor}></div>
    {/if}

    <div class="product-detail">
      <!-- Left: Image -->
      <div class="product-image-section">
        <div class="product-image-container" use:svelteTilt={svelteTiltOptions}>
          {#if product?.image}
            <img
              src={product.image}
              alt={product.name}
              crossorigin="anonymous"
              class="product-image"
              use:equalizeImage
            />
          {:else}
            <div class="no-image">No image available</div>
          {/if}
        </div>
      </div>

      <!-- Right: Details -->
      <div class="product-details-section">
        <h1 class="product-name">{product?.name}</h1>

        {#if product?.brands?.name}
          <a
            href="/products?brand={encodeURIComponent(
              product.brands.name.trim(),
            )}"
            class="product-brand">{product.brands.name.trim()}</a
          >
        {/if}

        <div class="product-meta">
          <span class="badge type-badge">{product?.type}</span>
          {#if product?.gender}
            <span class="badge gender-badge">{product.gender}</span>
          {/if}
          {#if !hasVariants && product?.size}
            <span class="badge size-badge">{product.size}ml</span>
          {/if}
        </div>

        <!-- Size selector (only shown when product has variants) -->
        {#if hasVariants}
          <div class="size-selector">
            <p class="size-selector-label">Select Size</p>
            <div class="size-pills">
              {#each variants as variant}
                <button
                  type="button"
                  class="size-pill"
                  class:selected={selectedVariant?.id === variant.id}
                  onclick={() => selectVariant(variant)}
                >
                  {variant.size}ml
                  <span class="pill-price"
                    >{variant.price.toLocaleString()} DA</span
                  >
                </button>
              {/each}
            </div>
            {#if !selectedVariant}
              <p class="size-hint">Choose a size to continue</p>
            {/if}
          </div>
        {/if}

        <div class="product-price">
          {#if hasVariants && !selectedVariant}
            <p class="price from-price">
              from {Math.min(...variants.map((v) => v.price)).toLocaleString()} DA
            </p>
          {:else}
            <p class="price">{displayPrice.toLocaleString()} DA</p>
          {/if}
        </div>

        <div class="product-description">
          <h3>{$t.description}</h3>
          <p>{product?.description}</p>
        </div>

        {#if product?.category}
          <div class="product-info-row">
            <strong>Category</strong>
            <span>{product.category}</span>
          </div>
        {/if}

        {#if product?.scent_family}
          <div class="product-info-row">
            <strong>Scent Family</strong>
            <span>{product.scent_family}</span>
          </div>
        {/if}

        {#if product?.occasion}
          <div class="product-info-row">
            <strong>Occasion</strong>
            <span>{product.occasion}</span>
          </div>
        {/if}

        <div class="product-actions">
          <Button
            type="primary"
            onclick={handleAddToCart}
            Icon={ShoppingCart}
            fullWidth
            disabled={added || (hasVariants && !selectedVariant)}
          >
            {#if added}
              {$t.added}
            {:else if hasVariants && !selectedVariant}
              Select a Size
            {:else}
              {$t.addToCart}
            {/if}
          </Button>

          <Button
            type="secondary"
            onclick={handleBuyNow}
            Icon={Zap}
            fullWidth
            disabled={hasVariants && !selectedVariant}
          >
            {$t.buyNow}
          </Button>
        </div>
      </div>
    </div>

    <!-- Recommendations Slider -->
    {#if recommendations.length > 0}
      <section class="recommendations-section">
        <div class="recommendations-header">
          <h1 class="recommendations-title">
            {$t.recommended}
          </h1>
        </div>
        <ProductsCarousel products={recommendations} />
      </section>
    {/if}
  </main>
</MainPage>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem 0;
    gap: 3rem;
  }

  main > .blur {
    position: absolute;
    top: var(--navbar-height);
    right: 0;
    width: 50%;
    height: 40%;
    border-radius: 50%;
    background: radial-gradient(circle, var(--dominant) 0%, transparent 50%);
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.5;
    z-index: -1;

    animation: scale 5s ease-in-out infinite;
  }

  @keyframes scale {
    0% {
      width: 50%;
      height: 40%;
    }
    50% {
      width: 200%;
      height: 200%;
    }
    100% {
      width: 50%;
      height: 40%;
    }
  }

  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* gap: 12rem; */
    padding: 2rem;
  }

  .product-image-section {
    display: flex;
    /* align-items: center; */
    justify-content: center;
  }

  .product-image-container {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 3 / 4;
    /* background-color: var(--color-card-bg); */
    /* border: 1px solid var(--color-border); */
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    color: var(--color-text-secondary);
    font-size: 1rem;
    text-align: center;
  }

  .product-details-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    max-width: 800px;
  }

  .product-name {
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
  }

  .product-brand {
    font-size: 0.875rem;
    width: fit-content;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .badge {
    display: inline-block;
    padding: 0.375rem 1rem;
    background-color: var(--color-accent);
    color: var(--color-bg);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Size selector */
  .size-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .size-selector-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .size-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .size-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.6rem 1.2rem;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-card-bg);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    font-weight: 600;
    min-width: 80px;
  }

  .size-pill:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .size-pill.selected {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: var(--color-bg);
  }

  .pill-price {
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 0.8;
  }

  .size-pill.selected .pill-price {
    opacity: 0.85;
  }

  .size-hint {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
    font-style: italic;
  }

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent);
    margin: 0;
  }

  .from-price {
    font-size: 1.5rem;
    opacity: 0.8;
  }

  .product-description {
    padding: 1.5rem;
    background-color: var(--color-card-bg);
    border-radius: var(--radius-md);
  }

  .product-description h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
  }

  .product-description p {
    margin: 0;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .product-info-row {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--color-card-bg);
    border-radius: var(--radius-md);
  }

  .product-info-row strong {
    color: var(--color-text-primary);
  }
  .product-info-row span {
    color: var(--color-text-secondary);
  }

  .product-actions {
    margin-top: auto;
    padding-top: 1rem;

    display: flex;
    gap: 0.5rem;

    border-top: 1px solid var(--color-border);
  }

  /* Recommendations Section */
  .recommendations-section {
    width: 100%;
    padding: 0 1.5rem;
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow: hidden;
  }

  .recommendations-header {
    text-align: center;
    padding-bottom: 0.5rem;
  }

  .recommendations-title {
    font-family: var(--font-heading);
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .product-detail {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .product-name {
      font-size: 1.5rem;
    }
    .price {
      font-size: 1.5rem;
    }
    .from-price {
      font-size: 1.25rem;
    }

    .product-actions {
      flex-direction: column;
    }

    .recommendations-section {
      padding: 0 1rem;
      margin-top: 2.5rem;
    }
    .recommendations-title {
      font-size: 2rem;
      text-align: center;
    }
  }
</style>
