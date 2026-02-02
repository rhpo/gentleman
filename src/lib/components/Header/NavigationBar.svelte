<script lang="ts">
  import { slide } from "svelte/transition";
  import { brands } from "$lib/i18n/brand";
  import { onMount } from "svelte";
  import { menuOpen } from "$lib/stores/menu";
  import { language } from "$lib/i18n";

  import { theme, toggleTheme } from "$lib/stores/theme";
  import { Moon, Search, ShoppingBag, Sun } from "@lucide/svelte";

  import IconButton from "../ui/IconButton.svelte";
  import HamburgerButton from "../ui/HamburgerButton.svelte";
  import LanguageSelector from "../ui/LanguageSelector.svelte";

  let lastScrollTop = $state(0);
  let scrolled = $state(false);

  const HIDE_THRESHOLD = 12;
  const SHOW_THRESHOLD = 8;

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const delta = scrollTop - lastScrollTop;

    if (delta > HIDE_THRESHOLD && scrollTop > 20) {
      scrolled = true;
    } else if (delta < -SHOW_THRESHOLD) {
      scrolled = false;
    }

    lastScrollTop = scrollTop;
  }

  onMount(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<!-- transition:slide={{
    axis: "y",
    duration: 500,
}} -->

<!-- Navbar -->
<nav class:hide={scrolled && !$menuOpen}>
  <!-- Navbar Wrapper -->
  <main>
    <!-- Left -->
    <div class="left">
      <HamburgerButton bind:open={$menuOpen} />
      <div class="search-button-left">
        <IconButton Icon={Search} href="/search" />
      </div>
    </div>

    <!-- Center -->
    <div class="center">
      <a href="/" class="logo">{$brands.name}</a>
    </div>

    <!-- Right -->
    <div class="right">
      <div class="theme-switcher">
        <IconButton
          Icon={$theme === "light" ? Moon : Sun}
          strokeWidth={1}
          onClick={toggleTheme}
        />
      </div>

      <div class="search-button-right">
        <IconButton Icon={Search} href="/search" />
      </div>

      <IconButton href="/cart" Icon={ShoppingBag} strokeWidth={1} />

      <div class="language-selector">
        <LanguageSelector bind:language={$language} />
      </div>
    </div>
  </main>
</nav>

<style>
  nav {
    height: var(--navbar-height);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);
    transition: opacity var(--transition-slow);
  }

  nav.hide {
    opacity: 0;
    pointer-events: none;
  }

  :global([data-theme="dark"]) nav {
    background: rgba(0, 0, 0, 0.8);
  }

  main {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3rem;
    position: relative;
  }

  .left,
  .right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
  }

  .logo {
    font-family: var(--font-brand);
    text-transform: uppercase;
    font-weight: 300;
    font-size: clamp(1.3rem, 2vw, 2rem);
    letter-spacing: 0.1em;
    margin: 0;
    text-decoration: none;
  }

  :global([dir="rtl"]) .logo {
    font-weight: 500;
    font-size: clamp(1rem, 3vw, 3rem);
    letter-spacing: 0;
  }

  .search-button-right {
    display: none;
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1rem;
    }

    .left {
      gap: 0.5rem;
    }

    .right {
      gap: 0rem;
    }

    .right > :global(*) {
      transform: scale(0.8);
    }

    .theme-switcher,
    .language-selector {
      display: none;
    }

    .search-button-right {
      display: block;
    }

    .search-button-left {
      display: none;
    }
  }
</style>
