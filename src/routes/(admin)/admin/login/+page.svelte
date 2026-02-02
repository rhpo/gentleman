<!-- Admin Login Page -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import MainPage from "$lib/components/ui/MainPage.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import { LockIcon } from "@lucide/svelte";
  import { brands } from "$lib/i18n/brand";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let isLoading = $state(false);

  async function handleLogin(event: Event): Promise<void> {
    event.preventDefault();
    error = "";
    isLoading = true;

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      goto("/admin");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to login";
    } finally {
      isLoading = false;
    }
  }
</script>

<MainPage title="Admin Login" description="Login to your admin account">
  <main>
    <Container margin="2rem" maxWidth="500px">
      <h1>{$brands.name}</h1>

      <form onsubmit={handleLogin}>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            autocomplete="current-password"
          />
        </div>

        {#if error}
          <div class="error-message">
            <p>{error}</p>
          </div>
        {/if}

        <Button
          type="primary"
          disabled={isLoading}
          fullWidth
          Icon={LockIcon}
          iconPosition="right"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Container>
  </main>
</MainPage>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg);
  }

  main h1 {
    font-family: var(--font-brand);
    margin-bottom: var(--spacing-md);
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
  }

  .form-group input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
  }

  .error-message {
    padding: var(--spacing-sm);
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
  }

  .error-message p {
    color: red;
    margin: 0;
  }
</style>
