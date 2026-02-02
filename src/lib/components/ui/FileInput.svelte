<script lang="ts">
  interface Props {
    id?: string;
    label?: string;
    accept?: string;
    required?: boolean;
    disabled?: boolean;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    label,
    accept,
    required = false,
    disabled = false,
    onchange,
  }: Props = $props();
</script>

<div class="file-input-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input {id} type="file" {accept} {required} {disabled} {onchange} />
</div>

<style>
  .file-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  input[type="file"] {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    transition: border-color 0.2s;
  }

  input[type="file"]:hover {
    border-color: var(--border-hover);
  }

  input[type="file"]:focus {
    outline: none;
    border-color: var(--primary);
  }
</style>
