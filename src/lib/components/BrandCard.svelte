<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { theme } from "$lib/stores/theme";
  import type { Brand } from "$lib/types/entities";

  let { brand, onDelete }: { brand: Brand; onDelete: (id: number) => void } =
    $props();
</script>

<div class="brand-card">
  <div class="brand-logo-container">
    {#if brand.logo}
      <img
        src={brand.logo}
        alt={brand.name}
        class="brand-logo"
        class:inverted={$theme === "dark"}
      />
    {:else}
      <div class="brand-logo-placeholder">No Logo</div>
    {/if}
  </div>
  <div class="brand-info">
    <h3>{brand.name}</h3>
    <p>{brand.short_description}</p>
    <div class="card-actions">
      <Button type="secondary" href="/admin/brands/{brand.id}">Edit</Button>
      <Button type="secondary" onclick={() => onDelete(brand.id)}>
        Delete
      </Button>
    </div>
  </div>
</div>

<style>
  .brand-card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    height: 100%;
  }

  .brand-logo-container {
    width: 100%;
    height: 200px;
    background-color: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
  }

  .brand-logo.inverted {
    filter: invert(1) hue-rotate(180deg);
  }

  .brand-logo-placeholder {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .brand-info {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .brand-info h3 {
    margin: 0 0 var(--spacing-xs) 0;
  }

  .brand-info p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0 0 auto 0;
    padding-bottom: var(--spacing-md);
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
  }
</style>
