<!-- Product Detail Page -->
<script lang="ts">
  import { addToCart } from "$lib/stores/cart";
  import { t } from "$lib/i18n/translations";
  import Button from "$lib/components/ui/Button.svelte";
  import MainPage from "$lib/components/ui/MainPage.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let product = $derived(data.product);

  function handleAddToCart(): void {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  }
</script>

<MainPage
  title={product?.name || "Product"}
  description={product?.description || ""}
>
  <Container>
    <div class="product-detail">
      <!-- Left: Image -->
      <div class="product-image-section">
        <div class="product-image-container">
          {#if product?.image}
            <img src={product.image} alt={product.name} class="product-image" />
          {:else}
            <div class="no-image">No image available</div>
          {/if}
        </div>
      </div>

      <!-- Right: Details -->
      <div class="product-details-section">
        <h1 class="product-name">{product?.name}</h1>

        {#if product?.brands?.name}
          <p class="product-brand">{product.brands.name}</p>
        {/if}

        <div class="product-meta">
          <span class="badge type-badge">{product?.type}</span>
          {#if product?.gender}
            <span class="badge gender-badge">{product.gender}</span>
          {/if}
          {#if product?.size}
            <span class="badge size-badge">{product.size}</span>
          {/if}
        </div>

        <div class="product-price">
          <p class="price">{product?.price.toFixed(2)} DA</p>
        </div>

        <div class="product-description">
          <h3>{$t.description}</h3>
          <p>{product?.description}</p>
        </div>

        {#if product?.category}
          <div class="product-info-row">
            <strong>Category:</strong>
            <span>{product.category}</span>
          </div>
        {/if}

        {#if product?.scent_family}
          <div class="product-info-row">
            <strong>Scent Family:</strong>
            <span>{product.scent_family}</span>
          </div>
        {/if}

        {#if product?.occasion}
          <div class="product-info-row">
            <strong>Occasion:</strong>
            <span>{product.occasion}</span>
          </div>
        {/if}

        <div class="product-actions">
          <Button
            type="primary"
            onclick={handleAddToCart}
            class="add-to-cart-btn"
          >
            {$t.addToCart}
          </Button>
        </div>
      </div>
    </div>
  </Container>
</MainPage>

<style>
  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 2rem 0;
  }

  .product-image-section {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-image-container {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 3 / 4;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
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
  }

  .product-name {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }

  .product-brand {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
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

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent);
    margin: 0;
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
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  :global(.add-to-cart-btn) {
    width: 100%;
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
  }
</style>
