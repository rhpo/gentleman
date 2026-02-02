<script lang="ts">
  import type { Brand } from "$lib/types/entities";

  interface Props {
    id?: string;
    label?: string;
    brands: Brand[];
    value: number | null;
    required?: boolean;
    disabled?: boolean;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    label,
    brands = [],
    value = $bindable(null),
    required = false,
    disabled = false,
    onchange,
  }: Props = $props();
</script>

<div class="brand-selector-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <select {id} bind:value {required} {disabled} {onchange}>
    <option value={null}>Select a brand</option>
    {#each brands as brand (brand.id)}
      <option value={brand.id}>{brand.name}</option>
    {/each}
  </select>
</div>

<style>
  .brand-selector-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  select {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    transition: border-color 0.2s;
  }

  select:hover {
    border-color: var(--border-hover);
  }

  select:focus {
    outline: none;
    border-color: var(--primary);
  }
</style>
