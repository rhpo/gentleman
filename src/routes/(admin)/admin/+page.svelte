<!-- Admin Dashboard -->
<script lang="ts">
  import Container from "$lib/components/ui/Container.svelte";
  import AdminPage from "$lib/components/AdminPage.svelte";

  import { ADMIN_NAVIGATION } from "$lib/admin/constants/navigation";
</script>

<AdminPage title="Admin Dashboard" description="Welcome to your admin panel">
  <div class="navigations">
    {#each ADMIN_NAVIGATION as item}
      <a class="navigation" href={item.href}>
        <item.Icon size="32" />
        <span>{item.title}</span>
      </a>
    {/each}
  </div>

  <Container>
    <div class="welcome">
      <h3>Welcome to the Admin Dashboard</h3>
      <p>Select a section from the navigation above to manage your store.</p>
    </div>
  </Container>
</AdminPage>

<style>
  .navigations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .navigation {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--color-text);
    transition: all var(--transition-fast);
  }

  .navigation:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-accent);
  }

  .navigation span {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .welcome {
    text-align: center;
  }

  .welcome h3 {
    font-family: var(--font-heading);
    margin-bottom: var(--spacing-sm);
  }

  .welcome p {
    color: var(--color-text-secondary);
  }
</style>
