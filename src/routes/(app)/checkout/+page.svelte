<!-- Checkout Page -->
<script lang="ts">
  import { cart, cartTotal, clearCart, applyCoupon } from "$lib/stores/cart";
  import { t } from "$lib/i18n/translations";
  import Button from "$lib/components/ui/Button.svelte";
  import { goto } from "$app/navigation";
  import type { Json } from "$lib/types/database";
  import { createOrder } from "$lib/api/orders";
  import { brands } from "$lib/i18n/brand";

  let customerName = $state("");
  let phoneNumber = $state("");
  let address = $state("");
  let wilaya = $state(1);
  let couponCode = $state("");
  let couponError = $state("");
  let couponSuccess = $state(false);
  let isSubmitting = $state(false);
  let orderError = $state("");

  // Wilaya options (1-69)
  const wilayaOptions = Array.from({ length: 69 }, (_, i) => i + 1);

  async function handleApplyCoupon(): Promise<void> {
    if (!couponCode.trim()) {
      couponError = "Please enter a coupon code";
      return;
    }

    try {
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        couponError = data.error || "Invalid coupon";
        couponSuccess = false;
        return;
      }

      applyCoupon(couponCode, data.discount);
      couponSuccess = true;
      couponError = "";
    } catch (err) {
      console.error("Error applying coupon:", err);
      couponError = "Failed to apply coupon";
      couponSuccess = false;
    }
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if ($cartTotal.itemCount === 0) {
      orderError = "Cart is empty";
      return;
    }

    if (!customerName || !phoneNumber || !address) {
      orderError = "Please fill all required fields";
      return;
    }

    isSubmitting = true;
    orderError = "";

    try {
      // Prepare order data
      const orderData = {
        customer_name: customerName,
        phone_number: phoneNumber,
        address: address,
        wilaya: wilaya,
        products: $cart.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })) as unknown as Json,
        status: "pending" as const,
      };

      const data = await createOrder(orderData);

      // Clear cart and redirect
      clearCart();
      goto(`/order-success?id=${data.id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      orderError = err instanceof Error ? err.message : "Failed to place order";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>{$t.checkout} - {$brands.name}</title>
</svelte:head>

<div class="checkout-page">
  <div class="container">
    <h1 class="page-title">{$t.checkout}</h1>

    {#if $cartTotal.itemCount === 0}
      <div class="empty-cart">
        <p>{$t.emptyCart}</p>
        <Button type="primary" onclick={() => goto("/products")}>
          {$t.products}
        </Button>
      </div>
    {:else}
      <div class="checkout-content">
        <!-- Checkout Form -->
        <form class="checkout-form" onsubmit={handleSubmit}>
          <h2>Shipping Information</h2>

          <div class="form-group">
            <label for="name">{$t.customerName} *</label>
            <input id="name" type="text" bind:value={customerName} required />
          </div>

          <div class="form-group">
            <label for="phone">{$t.phoneNumber} *</label>
            <input id="phone" type="tel" bind:value={phoneNumber} required />
          </div>

          <div class="form-group">
            <label for="address">{$t.address} *</label>
            <textarea id="address" bind:value={address} rows="3" required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="wilaya">{$t.wilaya} *</label>
            <select id="wilaya" bind:value={wilaya} required>
              {#each wilayaOptions as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </div>

          {#if orderError}
            <div class="error-message">
              <p>{orderError}</p>
            </div>
          {/if}

          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : $t.placeOrder}
          </Button>
        </form>

        <!-- Order Summary -->
        <div class="order-summary">
          <h2>Order Summary</h2>

          <div class="summary-items">
            {#each $cart.items as item}
              <div class="summary-item">
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} DA</span>
              </div>
            {/each}
          </div>

          <div class="coupon-section">
            <h3>{$t.couponCode}</h3>
            <div class="coupon-input">
              <input
                type="text"
                bind:value={couponCode}
                placeholder="Enter code"
              />
              <Button type="secondary" onclick={handleApplyCoupon}>
                {$t.apply}
              </Button>
            </div>
            {#if couponError}
              <p class="coupon-error">{couponError}</p>
            {/if}
            {#if couponSuccess}
              <p class="coupon-success">Coupon applied successfully!</p>
            {/if}
          </div>

          <div class="summary-totals">
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
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .checkout-page {
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

  /* Checkout Content */
  .checkout-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: var(--spacing-lg);
  }

  /* Checkout Form */
  .checkout-form {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
  }

  .checkout-form h2 {
    margin-bottom: var(--spacing-md);
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
  }

  .error-message {
    padding: var(--spacing-sm);
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
  }

  .error-message p {
    color: red;
    margin: 0;
  }

  /* Order Summary */
  .order-summary {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    height: fit-content;
    position: sticky;
    top: 100px;
  }

  .order-summary h2 {
    margin-bottom: var(--spacing-md);
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
  }

  .summary-items {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
    font-size: 0.875rem;
  }

  .coupon-section {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }

  .coupon-section h3 {
    margin-bottom: var(--spacing-sm);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .coupon-input {
    display: flex;
    gap: var(--spacing-xs);
  }

  .coupon-input input {
    flex: 1;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .coupon-error {
    color: red;
    font-size: 0.875rem;
    margin-top: var(--spacing-xs);
  }

  .coupon-success {
    color: green;
    font-size: 0.875rem;
    margin-top: var(--spacing-xs);
  }

  .summary-totals {
    margin-bottom: var(--spacing-md);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
  }

  .summary-row.discount {
    color: green;
  }

  .summary-row.total {
    font-weight: 600;
    font-size: 1.25rem;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .checkout-content {
      grid-template-columns: 1fr;
    }

    .order-summary {
      position: static;
    }
  }
</style>
