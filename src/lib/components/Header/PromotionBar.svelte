<script lang="ts">
    import { X } from "@lucide/svelte";

    import IconButton from "../ui/IconButton.svelte";
    import { slide } from "svelte/transition";

    let { promos = [] } = $props();
    let currentPromotionIndex = $state(0);

    let show = $state(true);

    $effect(() => {
        if (promos.length === 0) return;

        const interval = setInterval(() => {
            currentPromotionIndex = (currentPromotionIndex + 1) % promos.length;
        }, 3000);

        return () => clearInterval(interval);
    });

    function handleClose() {
        show = false;
        document.documentElement.style.setProperty("--promo-height", "0px");
    }
</script>

{#if show}
    <main
        transition:slide={{
            duration: 500,
            easing: (t) => t * (2 - t),
        }}
    >
        <span style="width: 2.7rem;"></span>

        <div class="promos">
            {#each promos as promo, i}
                <div class="promo" class:active={i === currentPromotionIndex}>
                    {@html promo}
                </div>
            {/each}
        </div>

        <IconButton
            style="filter: invert(1);border:0;"
            strokeWidth={1}
            Icon={X}
            onClick={() => handleClose()}
        />
    </main>
{/if}

<style>
    main {
        height: var(--promo-height);
        transition: height var(--transition-fast);

        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;

        color: var(--color-bg);
        background: var(--color-accent);
    }

    .promos {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;

        height: 100%;

        flex: 1;
    }

    .promo {
        position: absolute;
        opacity: 0;
        transform: translateY(100%);
        transition: 0.4s ease;
        font-size: 0.75rem;
        font-weight: 300;
    }

    :global([dir="rtl"]) .promo {
        font-weight: 500;
        word-spacing: 0.2em;
    }

    .promo.active {
        opacity: 1;
        transform: translateY(0);
    }

    @media screen and (max-width: 768px) {
        main {
            padding: 0 0.5rem;
        }

        .promo {
            font-size: 0.6rem;
        }
    }
</style>
