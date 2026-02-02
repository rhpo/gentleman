<!-- Admin Navigation Bar -->
<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { brands } from "$lib/i18n/brand";
  import { supabase } from "$lib/supabase";
  import { ADMIN_NAVIGATION } from "$lib/admin/constants/navigation";
  import { LogOut, Moon, Sun } from "@lucide/svelte";
  import { theme, toggleTheme } from "$lib/stores/theme";

  import View from "./ui/View.svelte";
  import IconButton from "$lib/components/ui/IconButton.svelte";

  function isActive(href: string): boolean {
    return (
      page.url.pathname === href || page.url.pathname.startsWith(href + "/")
    );
  }

  async function handleLogout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      goto("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }
</script>

<nav>
  <View>
    <div class="nav-container">
      <div class="nav-brand">
        <h2>{$brands.name}</h2>
      </div>

      <ul class="nav-links">
        {#each ADMIN_NAVIGATION as item}
          <li>
            <a
              href={item.href}
              class="nav-link"
              class:active={isActive(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.title}
            </a>
          </li>
        {/each}
      </ul>

      <div class="nav-actions">
        <IconButton
          Icon={$theme === "dark" ? Sun : Moon}
          onClick={toggleTheme}
        />

        <IconButton Icon={LogOut} color="red" onClick={handleLogout} />
      </div>
    </div>
  </View>
</nav>

<style>
  nav {
    background-color: var(--color-card-bg);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .nav-brand h2 {
    margin: 0;
    font-family: var(--font-brand);
    font-size: 1.5rem;
    color: var(--color-text);
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--spacing-md);
    flex: 1;
    justify-content: center;
  }

  .nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    font-weight: 500;
    position: relative;
  }

  .nav-link:hover {
    color: var(--color-text);
    background-color: rgba(var(--color-accent-rgb), 0.08);
  }

  .nav-link.active {
    color: var(--color-accent);
    background-color: rgba(var(--color-accent-rgb), 0.12);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-left: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    .nav-container {
      height: 60px;
    }

    .nav-brand h2 {
      font-size: 1.25rem;
    }

    .nav-links {
      gap: var(--spacing-sm);
      justify-content: flex-start;
      flex: 0;
      overflow-x: auto;
      padding: 0 var(--spacing-md);

      /* Hide scrollbar but keep scrollable */
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .nav-links::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .nav-actions {
      margin-left: var(--spacing-sm);
    }
  }
</style>
