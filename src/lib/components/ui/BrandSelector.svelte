<script lang="ts">
  import type { Brand } from "$lib/types/entities";
  import Modal from "./Modal.svelte";
  import { t } from "$lib/i18n/translations";
  import {
    LayoutGrid,
    ChevronRight,
    Search,
    X,
    Pointer,
    BadgeQuestionMark,
    Verified,
  } from "@lucide/svelte";

  interface Props {
    id?: string;
    label?: string;
    brands: Brand[];
    value: string | undefined | null;
    onchange?: (value: string) => void;
  }

  let {
    id,
    label,
    brands = [],
    value = $bindable(null),
    onchange,
  }: Props = $props();

  let isModalOpen = $state(false);
  let searchQuery = $state("");

  function selectBrand(brandName: string | null) {
    value = brandName;
    isModalOpen = false;
    searchQuery = ""; // Reset search
    if (onchange) onchange(brandName || "");
  }

  const selectedBrand = $derived(brands.find((b) => b.name === value));

  const filteredBrands = $derived(
    brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );
</script>

<div class="brand-selector-wrapper">
  {#if label}
    <div class="label-wrapper">
      <LayoutGrid size={18} />
      <span class="label-text">{label}</span>
    </div>
  {/if}

  <button
    type="button"
    class="selector-trigger"
    onclick={() => (isModalOpen = true)}
  >
    <div class="trigger-content">
      {#if selectedBrand}
        <img
          class="brand-logo-small"
          src={selectedBrand?.logo}
          alt={selectedBrand?.name}
        />
      {:else}
        <div class="empty-logo">
          <Verified />
        </div>
      {/if}
      <span class="current-value">
        {selectedBrand ? selectedBrand.name : $t.selectBrand}
      </span>
    </div>
    <div class="chevron-wrapper">
      <ChevronRight size={18} class="chevron" />
    </div>
  </button>

  <Modal
    isOpen={isModalOpen}
    onClose={() => (isModalOpen = false)}
    title={$t.selectBrand}
  >
    <div class="modal-search">
      <div class="search-input-wrapper">
        <div class="search-icon-wrapper">
          <Search size={18} class="search-icon" />
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={$t.search + "..."}
          class="brand-search-input"
        />
        {#if searchQuery}
          <button
            class="clear-search"
            onclick={() => (searchQuery = "")}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        {/if}
      </div>
    </div>

    <div class="brands-grid">
      <button
        class="brand-card all-brands"
        class:active={!value}
        onclick={() => selectBrand(null)}
      >
        <div class="brand-logo-placeholder">
          <LayoutGrid size={32} color="var(--color-accent)" />
        </div>

        <div class="brand-info">
          <span class="brand-name">{$t.allBrands}</span>
        </div>
      </button>

      {#each filteredBrands as brand (brand.id)}
        <button
          class="brand-card"
          class:active={value === brand.name}
          onclick={() => selectBrand(brand.name)}
        >
          <div class="brand-logo-container">
            <img src={brand.logo} alt={brand.name} class="brand-logo" />
          </div>
          <div class="brand-info">
            <span class="brand-name">{brand.name}</span>
            <span class="product-count">
              {brand.products_count || 0}
              {$t.products}
            </span>
          </div>
        </button>
      {/each}

      {#if filteredBrands.length === 0 && searchQuery}
        <div class="no-results">
          <p>{$t.noBrandsFoundFor} "{searchQuery}"</p>
        </div>
      {/if}
    </div>
  </Modal>
</div>

<style>
  .label-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    color: gray;
  }

  .brand-logo-small {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .brand-selector-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .label-text {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
  }

  .selector-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-fast);
    width: 100%;
    text-align: left;
    height: 40px;
  }

  .selector-trigger:hover {
    border-color: var(--color-accent);
    background-color: var(--color-card-bg);
  }

  .trigger-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .current-value {
    font-weight: 500;
  }

  .chevron-wrapper {
    color: var(--color-text-secondary);
    transition: transform var(--transition-fast);
    display: flex;
    align-items: center;
  }

  .selector-trigger:hover .chevron-wrapper {
    transform: translateX(4px);
    color: var(--color-accent);
  }

  .modal-search {
    margin-bottom: 1.5rem;
    background-color: var(--color-bg);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon-wrapper {
    position: absolute;
    left: var(--spacing-sm);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
  }

  .brand-search-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 3rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-card-bg);
    color: var(--color-text);
    font-size: 1rem;
    transition: all var(--transition-fast);
  }

  .brand-search-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background-color: var(--color-bg);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }

  .clear-search {
    position: absolute;
    right: var(--spacing-sm);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
  }

  .clear-search:hover {
    background-color: var(--color-border);
    color: var(--color-text);
  }

  .no-results {
    grid-column: 1 / -1;
    padding: var(--spacing-xl) var(--spacing-md);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
    min-width: 300px;
    max-width: 800px;
  }

  .brand-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    transition: all var(--transition-medium);
    cursor: pointer;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .brand-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .brand-card.active {
    border-color: var(--color-accent);
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  .brand-logo-container,
  .brand-logo-placeholder {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .brand-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .brand-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-name {
    font-weight: 600;
    font-size: 1rem;
    font-family: var(--font-brand);
  }

  .product-count {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .brand-card.active .product-count,
  .brand-card.active .brand-name {
    color: var(--color-bg);
  }

  :global([data-theme="dark"]) .brand-logo-container {
    background-color: #fff; /* Keep logos on white for better visibility if they are dark */
    padding: 10px;
  }

  @media (max-width: 640px) {
    .brands-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-sm);
    }

    .brand-card {
      padding: var(--spacing-sm);
    }

    .brand-logo-container {
      width: 60px;
      height: 60px;
    }
  }
</style>
