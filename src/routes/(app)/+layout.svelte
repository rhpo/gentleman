<!-- Main Layout -->
<script lang="ts">
  import "$lib/styles/global.css";

  import Menu from "$lib/components/Menu/Menu.svelte";
  import Header from "$lib/components/Header/Header.svelte";
  import Footer from "$lib/components/Footer/Footer.svelte";
  import CookieConsent from "$lib/components/modals/CookieConsent.svelte";

  interface LayoutProps {
    children?: import("svelte").Snippet;
  }

  let { children }: LayoutProps = $props();
</script>

<!-- Overlays -->
<Menu />

<div class="app">
  <Header />

  <main>
    {#if children}
      {@render children()}
    {/if}
  </main>

  <Footer />
</div>

<CookieConsent />

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }
</style>
