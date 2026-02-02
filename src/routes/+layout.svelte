<script lang="ts">
  import { language } from "$lib/i18n";
  import Loading from "$lib/overlays/Loading.svelte";
  import { theme } from "$lib/stores/theme";
  import { onMount } from "svelte";

  let {
    children,
  }: {
    children?: any;
  } = $props();

  onMount(() => {
    document.documentElement.setAttribute("data-theme", $theme);
    document.documentElement.dir = $language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = $language;
  });
</script>

<Loading />

{@render children?.()}
