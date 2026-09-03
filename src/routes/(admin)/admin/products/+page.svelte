<!-- Admin Products Management -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { listProducts, deleteExistingProduct } from "$lib/api/admin/products";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ProductWithActions from "$lib/components/products/ProductWithActions.svelte";

  import { filterAndRankProducts } from "$lib/utils/search";
  import type { ProductWithBrand } from "$lib/types/entities";

  let { data }: { data: PageData } = $props();

  let products = $derived<ProductWithBrand[]>(data.products || []);
  let error = $derived(data.error || "");
  let searchQuery = $state("");

  const BATCH_SIZE = 16;
  let visibleCount = $state(BATCH_SIZE);
  let sentinelEl = $state<HTMLElement | null>(null);

  const filteredProducts = $derived.by(() => {
    return filterAndRankProducts(products, searchQuery);
  });

  let visibleProducts = $derived(filteredProducts.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < filteredProducts.length);

  $effect(() => {
    filteredProducts;
    visibleCount = BATCH_SIZE;
  });

  function loadMore(): void {
    if (hasMore) {
      visibleCount += BATCH_SIZE;
    }
  }

  $effect(() => {
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          visibleCount += BATCH_SIZE;
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(sentinelEl);
    return () => observer.disconnect();
  });

  async function loadProducts(): Promise<void> {
    try {
      products = await listProducts();
    } catch (err) {
      console.error("Error loading products:", err);
      error = err instanceof Error ? err.message : "Failed to load products";
    }
  }

  async function handleDelete(id: number): Promise<void> {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteExistingProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  function handleEdit(id: number): void {
    goto(`/admin/products/${id}`);
  }

  function handleCreate(): void {
    goto("/admin/products/new");
  }
</script>

<AdminPage title="Manage Products" description="Manage your product inventory">
  <section>
    <div class="search-container">
      <input
        type="text"
        placeholder="Search by name, type, or brand..."
        bind:value={searchQuery}
        class="search-input"
      />

      {#if searchQuery}
        <span class="search-results">
          {filteredProducts.length} of {products.length} products
        </span>
      {/if}
    </div>

    <Button type="primary" onclick={handleCreate}>+ Create Product</Button>
  </section>

  <main>
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {:else if products.length === 0}
      <div class="empty-state">
        <p>No products found. Create your first product!</p>
      </div>
    {:else if filteredProducts.length === 0}
      <div class="empty-state">
        <p>No products match your search. Try a different query.</p>
      </div>
    {:else}
      <div class="products-grid">
        {#each visibleProducts as product (product.id)}
          <ProductWithActions {product}>
            <div class="admin-actions">
              <Button type="secondary" onclick={() => handleEdit(product.id)}>
                Edit
              </Button>
              <Button type="error" onclick={() => handleDelete(product.id)}>
                Delete
              </Button>
            </div>
          </ProductWithActions>
        {/each}
      </div>

      {#if hasMore}
        <div class="lazy-load-container" bind:this={sentinelEl}>
          <div class="spinner"></div>
          <button class="load-more-btn" onclick={loadMore}>
            Load More ({filteredProducts.length - visibleCount} remaining)
          </button>
        </div>
      {/if}
    {/if}
  </main>
</AdminPage>

<style>
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    gap: var(--spacing-sm);
  }

  .search-container {
    display: flex;
    flex: 1;

    align-items: center;
    gap: var(--spacing-sm);
  }

  .search-input {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-sm);
    font-size: 1rem;
    border: 2px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    transition: all var(--transition-fast);
  }

  .search-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  .search-results {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .error-message,
  .empty-state {
    padding: var(--spacing-lg);
    text-align: center;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }

  .admin-actions {
    display: flex;
    gap: var(--spacing-xs);
    margin-top: auto;
  }

  .admin-actions > :global(button) {
    flex: 1;
    font-size: 0.875rem;
    padding: var(--spacing-sm);
  }

  .lazy-load-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl) 0;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .load-more-btn {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .load-more-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 768px) {
    section {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .products-grid {
      grid-template-columns: 1fr;
    }

    .search-container {
      flex-direction: column;
    }

    .search-results {
      align-self: flex-start;
    }
  }
</style>
