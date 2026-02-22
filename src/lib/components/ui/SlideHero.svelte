<script lang="ts">
  import Media from "./Media.svelte";
  import { onMount } from "svelte";

  interface IProps {
    children: any;
    media: string;
    isFirst?: boolean;
  }

  let { children, media, isFirst = false }: IProps = $props();

  let parent = $state<HTMLElement>();

  function updateProgress(x?: number) {
    if (!parent) return;

    const rect = parent.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;
    const componentCenter = rect.top + rect.height / 2;

    // distance AFTER the crossing only
    const delta = viewportCenter - componentCenter;

    // progress starts ONLY when delta > 0
    const rawProgress = delta / (window.innerHeight / 2);

    const scrollProgress = Math.max(0, Math.min(1, rawProgress));

    parent.style.setProperty(
      "--progress",
      typeof x === "number" ? x.toString() : scrollProgress.toString(),
    );
  }

  function handleScroll() {
    scrollY = window.scrollY;
  }

  onMount(() => {
    updateProgress(0);
    handleScroll();

    window.addEventListener("scroll", () => updateProgress());
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", () => updateProgress());
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<main bind:this={parent}>
  <div class="media">
    <Media {media} />
  </div>

  <div class="overlay">
    {@render children?.()}
  </div>
</main>

<style>
  .media {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;

    transform: scale(calc(1 + 0.3 * var(--progress)));
  }

  .overlay {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: end;

    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }

  main {
    position: relative;
    overflow: hidden;
    height: calc(100vh - 2 * var(--header-height));

    background-size: cover;
    background-position: center;

    margin: 0 calc(3 * var(--spacing-md) * var(--progress));
    border-radius: calc(3 * var(--spacing-md) * var(--progress));
    filter: brightness(calc(1 - 0.5 * var(--progress)));
    /* opacity: calc(1 - 0.1 * var(--progress)); */

    /* start to 3d rotate the card when the --promo-height becomes 0 */
    transform: rotateX(var(--progress) * 360deg);

    /* add transition for when the --promo-height becomes 0 */
    transition: height var(--transition-fast);
  }

  @media screen and (max-width: 768px) {
    main {
      margin: 0 calc(3 * var(--spacing-xs) * var(--progress));
      border-radius: calc(3 * var(--spacing-xs) * var(--progress));

      height: calc(100vh - var(--header-height));
    }
  }
</style>
