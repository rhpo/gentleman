<!-- Admin Brands Management -->
<script lang="ts">
  import { onMount } from "svelte";
  import { listBrands, deleteExistingBrand } from "$lib/api/admin/brands";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import BrandCard from "$lib/components/BrandCard.svelte";

  import type { Brand } from "$lib/types/entities";
  import { Plus } from "@lucide/svelte";

  let brands = $state<Brand[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    await loadBrands();
  });

  async function loadBrands(): Promise<void> {
    try {
      isLoading = true;
      brands = await listBrands();
    } catch (err) {
      console.error("Error loading brands:", err);
    } finally {
      isLoading = false;
    }
  }

  async function handleDelete(brandId: number): Promise<void> {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await deleteExistingBrand(brandId);
      await loadBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  }
</script>

<AdminPage title="Manage Brands" description="Manage your brand information">
  {#snippet actions()}
    <Button Icon={Plus} type="primary" href="/admin/brands/new"
      >Create Brand</Button
    >
  {/snippet}

  {#if isLoading}
    <div class="loading">Loading brands...</div>
  {:else if brands.length === 0}
    <div class="empty-state">
      <p>No brands found.</p>
    </div>
  {:else}
    <div class="brands-grid">
      {#each brands as brand (brand.id)}
        <BrandCard {brand} onDelete={handleDelete} />
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

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }
</style>
