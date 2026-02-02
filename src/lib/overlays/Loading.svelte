<script>
  import { fade } from "svelte/transition";
  import { Loader } from "@lucide/svelte";
  import { navigating } from "$app/state";
</script>

{#if navigating.to}
  <div class="overlay" transition:fade>
    <div class="loader">
      <div class="loader-icon">
        <Loader color="white" size={48} />
      </div>
    </div>
  </div>
{/if}

<style>
  :root {
    --transform-origin: 49%;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    z-index: 99999;
  }

  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .loader-icon {
    animation: spin 1s linear infinite;
    transform-origin: var(--transform-origin) var(--transform-origin);
    margin: 0;
    padding: 0;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
