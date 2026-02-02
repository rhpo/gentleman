<script lang="ts">
  interface Props {
    id?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    value?: string | number;
    required?: boolean;
    disabled?: boolean;
    step?: string;
    min?: string | number;
    max?: string | number;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    type = "text",
    label,
    placeholder,
    value = "",
    required = false,
    disabled = false,
    step,
    min,
    max,
    onchange,
  }: Props = $props();
</script>

<div class="input-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input
    {id}
    {type}
    {placeholder}
    bind:value
    {required}
    {disabled}
    {step}
    {min}
    {max}
    {onchange}
  />
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: border-color 0.2s;

    border: 1px solid var(--color-border);
  }

  input:hover {
    border-color: var(--border-hover);
  }

  input:focus {
    outline: none;
    border-color: var(--primary);
  }
</style>
