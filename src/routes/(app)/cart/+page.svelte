<!-- Cart Page -->
<script lang="ts">
  import {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } from "$lib/stores/cart";

  import Button from "$lib/components/ui/Button.svelte";

  import { t } from "$lib/i18n/translations";
  import { goto } from "$app/navigation";
  import { brands } from "$lib/i18n/brand";

  function handleCheckout(): void {
    if ($cartTotal.itemCount > 0) {
      goto("/checkout");
    }
  }
</script>

<svelte:head>
  <title>{$t.cart} - {$brands.name}</title>
</svelte:head>

<div class="cart-page">
  <div class="container">
    <h1 class="page-title">{$t.yourCart}</h1>

    {#if $cartTotal.itemCount === 0}
      <div class="empty-cart">
        <p>{$t.emptyCart}</p>
        <Button type="primary" onclick={() => goto("/products")}>
          {$t.products}
        </Button>
      </div>
    {:else}
      <div class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items">
          {#each $cart.items as item}
            <div class="cart-item">
              <img src={item.image} alt={item.name} class="item-image" />
              <div class="item-info">
                <h3>{item.name}</h3>
                <p class="item-price">
                  {item.price.toFixed(2)} DA
                </p>
              </div>
              <div class="item-quantity">
                <button
                  onclick={() =>
                    updateQuantity(item.productId, item.quantity - 1)}
                  class="quantity-btn"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onclick={() =>
                    updateQuantity(item.productId, item.quantity + 1)}
                  class="quantity-btn"
                >
                  +
                </button>
              </div>
              <div class="item-total">
                <p>
                  {(item.price * item.quantity).toFixed(2)} DA
                </p>
              </div>
              <button
                onclick={() => removeFromCart(item.productId)}
                class="remove-btn"
              >
                ×
              </button>
            </div>
          {/each}
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <h3>{$t.total}</h3>

          <div class="summary-row">
            <span>{$t.subtotal}</span>
            <span>{$cartTotal.subtotal.toFixed(2)} DA</span>
          </div>

          {#if $cart.discount > 0}
            <div class="summary-row discount">
              <span>Discount ({$cart.discount}%)</span>
              <span
                >-{(($cartTotal.subtotal * $cart.discount) / 100).toFixed(2)} DA</span
              >
            </div>
          {/if}

          <div class="summary-row total">
            <span>{$t.total}</span>
            <span>{$cartTotal.total.toFixed(2)} DA</span>
          </div>

          <Button type="primary" onclick={handleCheckout}>
            {$t.checkout}
          </Button>

          <button class="clear-cart-btn" onclick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .cart-page {
    padding: var(--spacing-xl) 0;
    min-height: 60vh;
  }

  .page-title {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    font-family: var(--font-heading);
    letter-spacing: 0.2em;
  }

  /* Empty Cart */
  .empty-cart {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .empty-cart p {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }

  /* Cart Content */
  .cart-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: var(--spacing-lg);
  }

  /* Cart Items */
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto;
    gap: var(--spacing-md);
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .item-image {
    width: 100px;
    height: 133px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }

  .item-info h3 {
    font-size: 1.125rem;
    margin-bottom: var(--spacing-xs);
  }

  .item-price {
    color: var(--color-text-secondary);
  }

  .item-quantity {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  .quantity-btn:hover {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  .item-total {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: 2rem;
    transition: color var(--transition-fast);
  }

  .remove-btn:hover {
    color: var(--color-text);
  }

  /* Cart Summary */
  .cart-summary {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    height: fit-content;
    position: sticky;
    top: 100px;
  }

  .cart-summary h3 {
    margin-bottom: var(--spacing-md);
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .summary-row.discount {
    color: green;
  }

  .summary-row.total {
    font-weight: 600;
    font-size: 1.25rem;
    border-bottom: none;
    margin-bottom: var(--spacing-md);
  }

  .clear-cart-btn {
    width: 100%;
    padding: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.875rem;
    transition: all var(--transition-fast);
  }

  .clear-cart-btn:hover {
    border-color: var(--color-text);
    color: var(--color-text);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .cart-content {
      grid-template-columns: 1fr;
    }

    .cart-summary {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .cart-item {
      grid-template-columns: 80px 1fr;
      gap: var(--spacing-sm);
    }

    .item-image {
      width: 80px;
      height: 107px;
    }

    .item-quantity,
    .item-total {
      grid-column: 2;
    }

    .remove-btn {
      grid-column: 2;
      justify-self: end;
    }
  }
</style>
