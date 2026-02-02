<script lang="ts">
  let {
    children,
    margin = "0",
    padding = "var(--spacing-md)",
    minWidth = "0",
    maxWidth = "var(--view-width)",
  } = $props();
</script>

<div
  style="margin: {margin}; padding: {padding}; min-width: {minWidth}; max-width: {maxWidth}"
>
  {@render children?.()}
</div>

<style>
  div {
    border: 1px solid var(--color-border);
    background-color: var(--color-card-bg);
    width: 100%;
    border-radius: var(--radius-sm);
  }
</style>
