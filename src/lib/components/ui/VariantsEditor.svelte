<!-- Ergonomic size-variant editor for the admin product forms -->
<script lang="ts">
  import { Plus, Trash2 } from "@lucide/svelte";
  import type { ProductVariantInput } from "$lib/types/entities";

  interface Props {
    variants: ProductVariantInput[];
    onchange: (variants: ProductVariantInput[]) => void;
  }

  let { variants, onchange }: Props = $props();

  let newSize = $state<number | "">("");
  let newPrice = $state<number | "">(0);
  let sizeError = $state("");

  function sorted(vs: ProductVariantInput[]) {
    return [...vs].sort((a, b) => a.size - b.size);
  }

  function add() {
    sizeError = "";
    if (!newSize || Number(newSize) <= 0) {
      sizeError = "Enter a valid size";
      return;
    }
    if (variants.some((v) => v.size === Number(newSize))) {
      sizeError = "This size already exists";
      return;
    }
    onchange(sorted([...variants, { size: Number(newSize), price: Number(newPrice) || 0 }]));
    newSize = "";
    newPrice = 0;
  }

  function remove(index: number) {
    onchange(variants.filter((_, i) => i !== index));
  }

  function updateSize(index: number, value: string) {
    const size = parseInt(value, 10);
    if (isNaN(size) || size <= 0) return;
    const updated = variants.map((v, i) => (i === index ? { ...v, size } : v));
    onchange(sorted(updated));
  }

  function updatePrice(index: number, value: string) {
    const price = parseFloat(value);
    onchange(variants.map((v, i) => (i === index ? { ...v, price: isNaN(price) ? 0 : price } : v)));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  }
</script>

<div class="variants-editor">
  {#if variants.length > 0}
    <div class="variants-list">
      {#each variants as variant, i}
        <div class="variant-row">
          <div class="variant-size">
            <input
              type="number"
              min="1"
              value={variant.size}
              onchange={(e) => updateSize(i, (e.target as HTMLInputElement).value)}
              class="size-input"
            />
            <span class="unit">ml</span>
          </div>
          <div class="variant-price">
            <input
              type="number"
              min="0"
              step="0.01"
              value={variant.price}
              onchange={(e) => updatePrice(i, (e.target as HTMLInputElement).value)}
              class="price-input"
            />
            <span class="unit">DA</span>
          </div>
          <button type="button" class="remove-btn" onclick={() => remove(i)} title="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <p class="empty-hint">No sizes yet — add one below.</p>
  {/if}

  <div class="add-row" onkeydown={handleKeydown}>
    <div class="add-size">
      <input
        type="number"
        min="1"
        placeholder="100"
        bind:value={newSize}
        class="size-input"
        class:error={!!sizeError}
      />
      <span class="unit">ml</span>
    </div>
    <div class="add-price">
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="0"
        bind:value={newPrice}
        class="price-input"
      />
      <span class="unit">DA</span>
    </div>
    <button type="button" class="add-btn" onclick={add} title="Add size">
      <Plus size={14} />
      Add
    </button>
  </div>

  {#if sizeError}
    <p class="error-msg">{sizeError}</p>
  {/if}
</div>

<style>
  .variants-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.5rem);
  }

  .variants-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .variant-row,
  .add-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
  }

  .variant-size,
  .variant-price,
  .add-size,
  .add-price {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm, 4px);
    padding: 0 0.6rem;
  }

  .variant-size:focus-within,
  .variant-price:focus-within,
  .add-size:focus-within,
  .add-price:focus-within {
    border-color: var(--color-accent);
  }

  .add-size.error .size-input,
  .add-size.error {
    border-color: var(--color-error);
  }

  .size-input,
  .price-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: 0.875rem;
    padding: 0.5rem 0;
    min-width: 0;
    outline: none;
  }

  .unit {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: var(--color-error, #dc2626);
    border-color: var(--color-error, #dc2626);
    color: white;
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0 0.75rem;
    height: 34px;
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-accent);
    color: var(--color-bg);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .add-btn:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  .empty-hint {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin: 0;
    font-style: italic;
  }

  .error-msg {
    font-size: 0.75rem;
    color: var(--color-error, #dc2626);
    margin: 0;
  }

  /* Add row separator */
  .add-row {
    padding-top: 0.4rem;
    border-top: 1px dashed var(--color-border);
    margin-top: 0.2rem;
  }
</style>
