<!-- Order Detail Page -->
<script lang="ts">
  import { onMount } from "svelte";
  import AdminPage from "$lib/components/AdminPage.svelte";

  import type {
    Order,
    OrderStatus,
    ProductWithBrand,
  } from "$lib/types/entities";
  import { goto } from "$app/navigation";
  import {
    deleteExistingOrder,
    updateExistingOrder,
  } from "$lib/api/admin/orders";

  interface Props {
    data: { order: Order };
  }

  const { data }: Props = $props();

  let order = $state<Order>(data.order);
  let products = $state<ProductWithBrand[]>([]);
  let isLoading = $state(false);
  let isSaving = $state(false);
  let isDeleting = $state(false);
  let error = $state<string | null>(null);
  let showDeleteConfirm = $state(false);

  const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; bgColor: string; textColor: string; hoverBg: string }
  > = {
    pending: {
      label: "Pending",
      bgColor: "#FEF3C7",
      textColor: "#92400E",
      hoverBg: "#FCD34D",
    },
    shipped: {
      label: "Shipped",
      bgColor: "#DBEAFE",
      textColor: "#1E40AF",
      hoverBg: "#BFDBFE",
    },
    completed: {
      label: "Completed",
      bgColor: "#D1FAE5",
      textColor: "#065F46",
      hoverBg: "#A7F3D0",
    },
    canceled: {
      label: "Canceled",
      bgColor: "#FEE2E2",
      textColor: "#7F1D1D",
      hoverBg: "#FECACA",
    },
  };

  const statuses: OrderStatus[] = [
    "pending",
    "shipped",
    "completed",
    "canceled",
  ];

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts(): Promise<void> {
    try {
      isLoading = true;
      error = null;

      const response = await fetch(
        "/api/admin/orders/" + order.id + "/products",
      );
      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      products = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load products";
      console.error("Error loading products:", err);
    } finally {
      isLoading = false;
    }
  }

  async function setStatus(newStatus: OrderStatus): Promise<void> {
    if (newStatus === order.status || isSaving) return;

    try {
      isSaving = true;
      error = null;

      const updated = await updateExistingOrder(order.id, {
        status: newStatus,
      });
      order = updated;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to update status";
      console.error("Error updating status:", err);
    } finally {
      isSaving = false;
    }
  }

  async function deleteOrder(): Promise<void> {
    try {
      isDeleting = true;
      error = null;

      await deleteExistingOrder(order.id);
      goto("/admin/orders");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to delete order";
      console.error("Error deleting order:", err);
      isDeleting = false;
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function goBack(): void {
    goto("/admin/orders");
  }

  function calculateTotal(): number {
    return order.items.reduce((sum, item) => {
      // If unit_price is available on item, use it! Prefer captured price.
      // Otherwise fall back to current product price (for legacy or if missing)
      if (item.unit_price !== undefined) {
        return sum + item.unit_price * item.quantity;
      }
      const product = products.find((p) => p.id === item.product_id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  }

  function getTotalItems(): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getProductDisplay(productId: number) {
    return products.find((p) => p.id === productId);
  }
</script>

<svelte:head>
  <title>Order #{order.id} - Admin</title>
</svelte:head>

<AdminPage
  title={`Order #${order.id}`}
  description={formatDate(order.created_at)}
>
  <div class="dashboard">
    {#if error}
      <div class="error-banner">
        <p>{error}</p>
      </div>
    {/if}

    <!-- Header with Back Button -->
    <div class="header">
      <button class="back-btn" onclick={goBack} disabled={isDeleting}>
        <span>←</span> Back
      </button>
      <button
        class="delete-btn"
        onclick={() => (showDeleteConfirm = true)}
        disabled={isDeleting}
      >
        <span>🗑</span> Delete
      </button>
    </div>

    <!-- Top Info Bar -->
    <div class="info-bar">
      <div class="info-item">
        <span class="label">Customer</span>
        <span class="value">{order.customer_name}</span>
      </div>
      <div class="separator"></div>
      <div class="info-item">
        <span class="label">Phone</span>
        <span class="value">{order.phone_number}</span>
      </div>
      <div class="separator"></div>
      <div class="info-item">
        <span class="label">Items</span>
        <span class="value">{getTotalItems()}</span>
      </div>
      <div class="separator"></div>
      <div class="info-item">
        <span class="label">Total</span>
        <span class="value">{calculateTotal().toLocaleString()} DA</span>
      </div>
    </div>

    <!-- Status Control -->
    <div class="status-section">
      <h3>Update Status</h3>
      <div class="status-buttons">
        {#each statuses as status}
          <button
            class="status-btn {order.status === status ? 'active' : ''}"
            style="
              background-color: {STATUS_CONFIG[status].bgColor};
              color: {STATUS_CONFIG[status].textColor};
            "
            onclick={() => setStatus(status)}
            disabled={isSaving}
            onmouseenter={(e) => {
              if (order.status !== status && !isSaving) {
                e.currentTarget.style.backgroundColor =
                  STATUS_CONFIG[status].hoverBg;
              }
            }}
            onmouseleave={(e) => {
              e.currentTarget.style.backgroundColor =
                STATUS_CONFIG[status].bgColor;
            }}
          >
            {STATUS_CONFIG[status].label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Products Section -->
    <div class="products-section">
      <h3>Order Items</h3>

      {#if isLoading}
        <div class="loading">Loading products...</div>
      {:else if products.length === 0}
        <div class="empty">No products in this order</div>
      {:else}
        <div class="products-table">
          <div class="table-header">
            <div class="col-image">Image</div>
            <div class="col-name">Product</div>
            <div class="col-qty">Qty</div>
            <div class="col-price">Price</div>
            <div class="col-total">Total</div>
          </div>

          {#each order.items as item}
            {@const product = products.find((p) => p.id === item.product_id)}
            <div class="table-row {!product ? 'product-not-found' : ''}">
              {#if product}
                <div class="col-image">
                  {#if product.image}
                    <img src={product.image} alt={product.name} />
                  {:else}
                    <div class="no-image">-</div>
                  {/if}
                </div>
                <div class="col-name">
                  <div class="name">{product.name}</div>
                  {#if product.brand && typeof product.brand !== "string"}
                    <div class="brand">{product.brand.name}</div>
                  {/if}
                </div>
                <div class="col-qty">{item.quantity}</div>
                <div class="col-price">
                  {product.price.toLocaleString()} DA
                </div>
                <div class="col-total">
                  {(product.price * item.quantity).toLocaleString()} DA
                </div>
              {:else}
                <div class="col-image">
                  <div class="no-image">N/A</div>
                </div>
                <div class="col-name">
                  <div class="name not-found">Product Not Found</div>
                  <div class="brand">ID: {item.product_id}</div>
                </div>
                <div class="col-qty">{item.quantity}</div>
                <div class="col-price">-</div>
                <div class="col-total">-</div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Address Info -->
    <div class="address-section">
      <h3>Delivery Address</h3>
      <div class="address-info">
        <p>{order.address}</p>
        <p class="wilaya">Wilaya: {order.wilaya}</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    {#if showDeleteConfirm}
      <div
        class="modal-overlay"
        onclick={(e) => {
          if (e.target === e.currentTarget && !isDeleting)
            showDeleteConfirm = false;
        }}
      >
        <div class="modal">
          <h3>Delete Order?</h3>
          <p>
            Are you sure you want to delete Order #{order.id}? This action
            cannot be undone.
          </p>
          <div class="modal-actions">
            <button
              class="modal-cancel"
              onclick={() => (showDeleteConfirm = false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              class="modal-delete"
              onclick={deleteOrder}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Order"}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</AdminPage>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-banner {
    padding: 0.75rem 1rem;
    background-color: #fee2e2;
    border-left: 4px solid #dc2626;
    color: #991b1b;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .error-banner p {
    margin: 0;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background-color: var(--color-bg);
    border-color: var(--color-accent);
  }

  .back-btn span {
    font-size: 1rem;
  }

  .delete-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #fee2e2;
    border: 1px solid #fca5a5;
    border-radius: 0.375rem;
    color: #991b1b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .delete-btn:hover:not(:disabled) {
    background-color: #fecaca;
    border-color: #dc2626;
  }

  .delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .delete-btn span {
    font-size: 1rem;
  }

  /* Info Bar */
  .info-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item .label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
  }

  .info-item .value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .separator {
    height: 1px;
    background-color: var(--color-border);
    grid-column: 1 / -1;
  }

  /* Status Section */
  .status-section {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .status-section h3 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text);
  }

  .status-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .status-btn {
    padding: 0.75rem 1rem;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: capitalize;
  }

  .status-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-btn.active {
    border-color: currentColor;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .status-btn:not(:disabled):active {
    transform: scale(0.95);
  }

  /* Products Section */
  .products-section {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .products-section h3 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text);
  }

  .loading,
  .empty {
    padding: 2rem;
    text-align: center;
    color: var(--color-text-muted);
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .products-table {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: 60px 1fr 60px 90px 100px;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid var(--color-border);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
  }

  .table-row {
    display: grid;
    grid-template-columns: 60px 1fr 60px 90px 100px;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    align-items: center;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .col-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .col-image img {
    width: 100%;
    height: 50px;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  .col-image .no-image {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-border);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }

  .col-name {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .col-name .name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .col-name .brand {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .col-qty,
  .col-price,
  .col-total {
    text-align: right;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .col-total {
    font-weight: 700;
    color: var(--color-accent);
  }

  .table-row.product-not-found {
    background-color: #fef3c7;
    opacity: 0.8;
  }

  .col-name .name.not-found {
    color: #92400e;
    font-style: italic;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .modal h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .modal p {
    margin: 0 0 1.5rem 0;
    font-size: 0.95rem;
    color: var(--color-text);
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .modal-cancel,
  .modal-delete {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .modal-cancel {
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }

  .modal-cancel:hover:not(:disabled) {
    background-color: var(--color-border);
  }

  .modal-delete {
    background-color: #dc2626;
    color: white;
  }

  .modal-delete:hover:not(:disabled) {
    background-color: #b91c1c;
  }

  .modal-cancel:disabled,
  .modal-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Address Section */
  .address-section {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .address-section h3 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text);
  }

  .address-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .address-info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text);
    line-height: 1.5;
  }

  .address-info .wilaya {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .dashboard {
      gap: 1rem;
    }

    .info-bar {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      padding: 0.75rem;
    }

    .separator {
      grid-column: auto;
      display: none;
    }

    .info-item .label {
      font-size: 0.65rem;
    }

    .info-item .value {
      font-size: 0.9rem;
    }

    .status-section {
      padding: 1rem;
    }

    .status-section h3 {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .status-buttons {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .status-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }

    .products-section {
      padding: 1rem;
    }

    .products-section h3 {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .table-header,
    .table-row {
      grid-template-columns: 50px 1fr 50px 70px 80px;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .col-image img {
      height: 45px;
    }

    .col-image .no-image {
      height: 45px;
    }

    .col-name .name {
      font-size: 0.8rem;
    }

    .col-name .brand {
      font-size: 0.7rem;
    }

    .col-qty,
    .col-price,
    .col-total {
      font-size: 0.75rem;
    }

    .address-section {
      padding: 1rem;
    }

    .address-section h3 {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .address-info p {
      font-size: 0.8rem;
    }

    .back-btn {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
    }

    .back-btn span {
      font-size: 0.9rem;
    }

    .delete-btn {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
    }

    .delete-btn span {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .dashboard {
      gap: 0.75rem;
    }

    .header {
      margin-bottom: 0.5rem;
      gap: 0.5rem;
    }

    .back-btn {
      padding: 0.35rem 0.6rem;
      font-size: 0.7rem;
      border-radius: 0.25rem;
      flex: 1;
    }

    .back-btn span {
      font-size: 0.85rem;
    }

    .delete-btn {
      padding: 0.35rem 0.6rem;
      font-size: 0.7rem;
      border-radius: 0.25rem;
      flex: 1;
    }

    .delete-btn span {
      font-size: 0.85rem;
    }

    .info-bar {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .info-item {
      gap: 0.15rem;
    }

    .info-item .label {
      font-size: 0.6rem;
      letter-spacing: 0.3px;
    }

    .info-item .value {
      font-size: 0.85rem;
      word-break: break-word;
    }

    .status-section {
      padding: 0.75rem;
    }

    .status-section h3 {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .status-buttons {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.4rem;
    }

    .status-btn {
      padding: 0.4rem 0.5rem;
      font-size: 0.7rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .products-section {
      padding: 0.75rem;
    }

    .products-section h3 {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .loading,
    .empty {
      padding: 1rem;
      font-size: 0.8rem;
    }

    .table-header {
      display: none;
    }

    .table-row {
      display: flex;
      flex-direction: column;
      grid-template-columns: unset;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 0.3rem;
      margin-bottom: 0.5rem;
    }

    .table-row:last-child {
      margin-bottom: 0;
    }

    .col-image,
    .col-name,
    .col-qty,
    .col-price,
    .col-total {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .col-image {
      gap: 0.5rem;
    }

    .col-image::before {
      content: "Image";
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.6rem;
      color: var(--color-text-muted);
      min-width: 45px;
    }

    .col-image img {
      width: 45px;
      height: 45px;
      object-fit: cover;
    }

    .col-image .no-image {
      width: 45px;
      height: 45px;
    }

    .col-name {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .col-name::before {
      content: "Product";
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.6rem;
      color: var(--color-text-muted);
      width: 100%;
      margin-bottom: 0.25rem;
    }

    .col-name .name {
      font-size: 0.75rem;
      line-height: 1.2;
    }

    .col-name .brand {
      font-size: 0.65rem;
    }

    .col-qty::before,
    .col-price::before,
    .col-total::before {
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.6rem;
      color: var(--color-text-muted);
    }

    .col-qty::before {
      content: "Qty";
    }

    .col-price::before {
      content: "Price";
    }

    .col-total::before {
      content: "Total";
    }

    .col-qty,
    .col-price,
    .col-total {
      font-size: 0.75rem;
      gap: 0.5rem;
    }

    .address-section {
      padding: 0.75rem;
    }

    .address-section h3 {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .address-info p {
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .address-info .wilaya {
      font-size: 0.7rem;
    }

    .error-banner {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      border-left-width: 3px;
    }

    .error-banner p {
      margin: 0;
    }

    .modal {
      padding: 1.5rem;
      max-width: 90%;
    }

    .modal h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .modal p {
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .modal-actions {
      flex-direction: column-reverse;
      gap: 0.75rem;
    }

    .modal-cancel,
    .modal-delete {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      width: 100%;
    }
  }
</style>
