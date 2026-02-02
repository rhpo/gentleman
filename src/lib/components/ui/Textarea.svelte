<script lang="ts">
  interface Props {
    id?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    label,
    placeholder,
    value = "",
    required = false,
    disabled = false,
    rows = 4,
    onchange,
  }: Props = $props();
</script>

<div class="textarea-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <textarea
    {id}
    {placeholder}
    bind:value
    {required}
    {disabled}
    {rows}
    {onchange}
  ></textarea>
</div>

<style>
  .textarea-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
  }

  textarea:hover {
    border-color: var(--border-hover);
  }

  textarea:focus {
    outline: none;
    border-color: var(--primary);
  }
</style>
