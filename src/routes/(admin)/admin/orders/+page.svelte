<!-- Admin Orders Management -->
<script lang="ts">
  import { onMount } from "svelte";
  import { listOrders } from "$lib/api/admin/orders";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  import type { Order, OrderStatus } from "$lib/types/entities";

  let orders = $state<Order[]>([]);
  let isLoading = $state(true);

  const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bgColor: string }
  > = {
    pending: { label: "Pending", color: "#f59e0b", bgColor: "#fef3c7" },
    shipped: { label: "Shipped", color: "#3b82f6", bgColor: "#dbeafe" },
    completed: { label: "Completed", color: "#10b981", bgColor: "#d1fae5" },
    canceled: { label: "Canceled", color: "#ef4444", bgColor: "#fee2e2" },
  };

  onMount(async () => {
    await loadOrders();
  });

  async function loadOrders(): Promise<void> {
    try {
      isLoading = true;
      orders = await listOrders();
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      isLoading = false;
    }
  }

  function getOrdersByStatus(status: OrderStatus): Order[] {
    return orders.filter((order) => order.status === status);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<AdminPage title="Manage Orders" description="View and manage customer orders">
  {#if isLoading}
    <div class="loading">Loading orders...</div>
  {:else if orders.length === 0}
    <div class="empty-state">
      <p>No orders found.</p>
    </div>
  {:else}
    <div class="orders-container">
      {#each ["pending", "shipped", "completed", "canceled"] as status}
        {@const statusOrders = getOrdersByStatus(status as OrderStatus)}
        <div class="status-section">
          <h2 class="status-title">
            <span
              class="status-badge"
              style="background-color: {STATUS_CONFIG[status as OrderStatus]
                .bgColor}; color: {STATUS_CONFIG[status as OrderStatus].color};"
            >
              {STATUS_CONFIG[status as OrderStatus].label}
            </span>
            <span class="order-count">({statusOrders.length})</span>
          </h2>

          {#if statusOrders.length === 0}
            <div class="no-orders">
              <p>No {status} orders</p>
            </div>
          {:else}
            <div class="orders-grid">
              {#each statusOrders as order}
                <div class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Order #{order.id} ({order.status})</h3>
                      <p class="customer-name">{order.customer_name}</p>
                      <p class="customer-phone">{order.phone_number}</p>
                    </div>
                    <div class="order-date">
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  <div class="order-body">
                    <p class="product-count">
                      {order.items.length}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div class="order-footer">
                    <a href="/admin/orders/{order.id}" class="view-details-btn">
                      <Button variant="primary">View Details</Button>
                    </a>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</AdminPage>

<style>
  .loading,
  .empty-state {
    padding: var(--spacing-lg);
    text-align: center;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .orders-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .status-section {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--spacing-lg);
  }

  .status-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1.25rem;
    font-weight: 600;
    flex-wrap: wrap;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .order-count {
    color: var(--color-text-muted);
    font-size: 1rem;
    font-weight: normal;
  }

  .no-orders {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--color-text-muted);
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: var(--radius-sm);
  }

  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-md);
  }

  .order-card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--spacing-md);
    transition: all 0.2s ease;
  }

  .order-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .order-header {
    margin-bottom: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .order-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    word-break: break-word;
  }

  .customer-name {
    margin: 0;
    font-weight: 500;
    color: var(--color-text);
    word-break: break-word;
  }

  .customer-phone {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    word-break: break-word;
  }

  .order-date {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .order-body {
    flex: 1;
    margin-bottom: var(--spacing-md);
  }

  .product-count {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .order-footer {
    display: flex;
    gap: var(--spacing-sm);
  }

  .view-details-btn {
    flex: 1;
    text-decoration: none;
  }

  .view-details-btn :global(button) {
    width: 100%;
  }

  /* Tablet adjustments */
  @media (max-width: 768px) {
    .status-section {
      padding: var(--spacing-md);
    }

    .status-title {
      font-size: 1.1rem;
    }

    .orders-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-sm);
    }

    .order-card {
      padding: var(--spacing-sm);
    }

    .order-info h3 {
      font-size: 1rem;
    }

    .order-date {
      font-size: 0.75rem;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .status-section {
      padding: var(--spacing-md);
    }

    .status-title {
      font-size: 1rem;
    }

    .status-badge {
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
    }

    .order-count {
      font-size: 0.875rem;
    }

    .orders-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-sm);
    }

    .order-card {
      padding: var(--spacing-sm);
    }

    .order-header {
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .order-info h3 {
      font-size: 0.95rem;
    }

    .customer-name {
      font-size: 0.9rem;
    }

    .customer-phone {
      font-size: 0.8rem;
    }

    .order-date {
      font-size: 0.75rem;
      align-self: flex-start;
    }

    .product-count {
      font-size: 0.8rem;
    }
  }
</style>
