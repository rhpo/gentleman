<script lang="ts">
  interface Props {
    id?: string;
    label?: string;
    value: string | number;
    options: { value: string | number; label: string }[];
    required?: boolean;
    disabled?: boolean;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    label,
    value = "",
    options = [],
    required = false,
    disabled = false,
    onchange,
  }: Props = $props();
</script>

<div class="select-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <select bind:value {id} {required} {disabled} {onchange}>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style>
  .select-group {
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
