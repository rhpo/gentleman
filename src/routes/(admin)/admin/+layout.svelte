<script lang="ts">
  import { language } from "$lib/i18n";
  import AdminNav from "$lib/components/AdminNav.svelte";
  import "$lib/styles/global.css";
  import "$lib/styles/globalAdmin.css";

  let { children } = $props();

  language.set("en");
</script>

<main>
  <AdminNav />
  {@render children?.()}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
