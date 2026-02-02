<script>
  import { t } from "$lib/i18n/translations";
  import { menuOpen } from "$lib/stores/menu";
  import { Home, ShoppingBag, User, SprayCan, Moon, Sun } from "@lucide/svelte";
  import { onMount } from "svelte";
  import IconButton from "../ui/IconButton.svelte";
  import { theme, toggleTheme } from "$lib/stores/theme";
  import { language } from "$lib/i18n";
  import LanguageSelector from "../ui/LanguageSelector.svelte";
  import { onNavigate } from "$app/navigation";

  onMount(() => {
    menuOpen.subscribe((value) => {
      if (!value) {
        document.body.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
      }
    });

    onNavigate(() => {
      menuOpen.set(false);
    });
  });

  let links = $derived([
    { Icon: Home, href: "/", label: $t.home },
    { Icon: SprayCan, href: "/products", label: $t.products },
    { Icon: ShoppingBag, href: "/cart", label: $t.cart },
  ]);
</script>

<menu class:closed={!$menuOpen}>
  <span class="spaceholder"></span>

  <div class="links">
    {#each links as Link}
      <div class="link">
        <div class="icon">
          <Link.Icon strokeWidth={1.5} />
        </div>
        <a href={Link.href}>{Link.label}</a>
      </div>
    {/each}
  </div>

  <div class="actions">
    <div class="theme-switcher">
      <IconButton
        Icon={$theme === "light" ? Moon : Sun}
        onClick={toggleTheme}
      />
    </div>

    <div class="language-selector">
      <LanguageSelector bind:language={$language} />
    </div>
  </div>
</menu>

<style>
  menu {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow: hidden;

    z-index: 100;

    background-color: var(--color-bg);
    transition: all var(--transition-fast);
  }

  menu.closed {
    width: 0;
    padding: 0;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .links .link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .link .icon {
    width: 2rem;
    height: 2rem;

    display: grid;
    place-items: center;

    transition: all var(--transition-medium);
  }

  .link a {
    width: fit-content;
    padding: 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-decoration: none;
  }

  .link:hover a {
    text-decoration: underline;
    font-weight: 500;
  }

  .link:hover .icon {
    transform: rotate(-10deg) translateY(-5px) scale(1.2);
  }

  :global([dir="rtl"]) .link:hover .icon {
    transform: rotate(10deg) translateY(-5px) scale(1.2);
  }

  :global([dir="rtl"]) .link a {
    letter-spacing: 0;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .theme-switcher,
  .language-selector {
    display: none;
  }

  @media screen and (max-width: 768px) {
    .theme-switcher,
    .language-selector {
      display: block;
    }
  }
</style>
