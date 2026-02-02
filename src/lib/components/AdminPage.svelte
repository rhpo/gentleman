<!-- Admin Page Layout Component -->
<script lang="ts">
  import Container from "./ui/Container.svelte";
  import View from "./ui/View.svelte";

  interface AdminPageProps {
    title: string;
    description?: string;
  }

  let {
    title,
    description,
    children,
    actions,
  }: AdminPageProps & { children?: any; actions?: any } = $props();
</script>

<View>
  <main>
    <div class="header">
      <div class="info">
        <h1>{title}</h1>
        {#if description}
          <p class="description">{description}</p>
        {/if}
      </div>

      <div class="actions">
        {@render actions?.()}
      </div>
    </div>

    <div class="content">
      {@render children?.()}
    </div>
  </main>
</View>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    justify-content: center;
    align-items: center;
  }

  .info {
    max-width: var(--view-width);
    width: 100%;
  }

  .info h1 {
    font-family: var(--font-brand);
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    margin: 0;
    color: var(--color-text);
  }

  .info .description {
    margin: var(--spacing-sm) 0 0 0;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
  }

  .actions {
    width: 100%;

    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
    align-items: center;
  }

  .content {
    flex: 1;
    max-width: var(--view-width);
    width: 100%;
  }

  @media (max-width: 768px) {
  }
</style>
