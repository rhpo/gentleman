<!-- Order Success Page -->
<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n/translations";
  import Button from "$lib/components/ui/Button.svelte";
  import { goto } from "$app/navigation";
  import { brands } from "$lib/i18n/brand";

  const orderId = $page.url.searchParams.get("id");
</script>

<svelte:head>
  <title>Order Confirmed - {$brands.name}</title>
</svelte:head>

<div class="success-page">
  <div class="container">
    <div class="success-content">
      <svg
        class="success-icon"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>

      <h1>Order Confirmed!</h1>
      <p>Thank you for your order.</p>

      {#if orderId}
        <p class="order-id">Order ID: #{orderId}</p>
      {/if}

      <p class="order-message">
        We will contact you shortly to confirm your order and arrange delivery.
      </p>

      <div class="actions">
        <Button type="primary" onclick={() => goto("/products")}>
          Continue Shopping
        </Button>
        <Button type="secondary" onclick={() => goto("/")}>Back to Home</Button>
      </div>
    </div>
  </div>
</div>

<style>
  .success-page {
    padding: var(--spacing-xl) 0;
    min-height: 60vh;
    display: flex;
    align-items: center;
  }

  .success-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .success-icon {
    color: green;
    margin-bottom: var(--spacing-md);
  }

  .success-content h1 {
    font-family: var(--font-heading);
    margin-bottom: var(--spacing-sm);
  }

  .order-id {
    font-weight: 600;
    font-size: 1.125rem;
    margin: var(--spacing-md) 0;
  }

  .order-message {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
