<script lang="ts">
    import type { ProductWithBrand } from "$lib/types/entities";
    import ProductCard from "./ProductCard.svelte";
    import emblaCarouselSvelte from "embla-carousel-svelte";
    import Autoplay from "embla-carousel-autoplay";
    import WheelGestures from "embla-carousel-wheel-gestures";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import { browser } from "$app/environment";

    interface IProps {
        products: ProductWithBrand[];
        delay?: number;
    }

    let { products, delay = 3500 }: IProps = $props();

    let emblaApi = $state<any>(null);
    let selectedIndex = $state(0);
    let scrollSnaps = $state<number[]>([]);

    const options = { loop: true, align: "start" as const, skipSnaps: false };

    const plugins = $derived(
        browser
            ? [
                  Autoplay({
                      delay,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                  }),
                  WheelGestures({
                      forceWheelAxis: "x",
                  }),
              ]
            : [],
    );

    const onInit = (event: any) => {
        emblaApi = event.detail;
    };

    $effect(() => {
        if (!emblaApi) return;

        const updateState = () => {
            selectedIndex = emblaApi.selectedScrollSnap();
            scrollSnaps = emblaApi.scrollSnapList();
        };

        emblaApi.on("select", updateState);
        emblaApi.on("init", updateState);
        emblaApi.on("reInit", updateState);

        updateState();
    });

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();
    const scrollTo = (index: number) => emblaApi?.scrollTo(index);
</script>

<div class="products-carousel">
    <div class="embla">
        <div
            class="embla__viewport"
            use:emblaCarouselSvelte={{ options, plugins }}
            onemblaInit={onInit}
        >
            <div class="embla__container">
                {#each products as product}
                    <div class="embla__slide">
                        <div class="card-wrapper">
                            <ProductCard {product} />
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        {#if products.length > 0}
            <div class="controls">
                <div class="navigation-group">
                    <button
                        class="nav-btn prev"
                        onclick={scrollPrev}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div class="dots">
                        {#each scrollSnaps as _, index}
                            <button
                                class="dot"
                                class:active={index === selectedIndex}
                                onclick={() => scrollTo(index)}
                                aria-label="Go to slide {index + 1}"
                            ></button>
                        {/each}
                    </div>
                    <button
                        class="nav-btn next"
                        onclick={scrollNext}
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .products-carousel {
        width: 100%;
        padding: var(--spacing-md) 0;
        position: relative;
    }

    .embla {
        /* overflow: hidden; */
        width: 100%;
    }

    .embla__viewport {
        /* overflow: hidden; */
    }

    .embla__container {
        display: flex;
        touch-action: pan-y pinch-zoom;
        margin-left: calc(var(--spacing-md) * -1);
    }

    .embla__slide {
        flex: 0 0 25%;
        min-width: 0;
        padding-left: var(--spacing-md);
    }

    .card-wrapper {
        height: 100%;
    }

    .controls {
        margin-top: var(--spacing-lg);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navigation-group {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        background: rgba(var(--color-text-rgb, 0, 0, 0), 0.03);
        padding: 0.5rem var(--spacing-md);
        border-radius: 100px;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(var(--color-text-rgb, 0, 0, 0), 0.05);
    }

    .nav-btn {
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        color: var(--color-text);
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.6;
    }

    .nav-btn:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    .dots {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-text);
        border: none;
        opacity: 0.15;
        cursor: pointer;
        padding: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dot.active {
        opacity: 1;
        width: 24px;
        border-radius: 4px;
    }

    :global([data-theme="dark"]) .navigation-group {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 1200px) {
        .embla__slide {
            flex: 0 0 33.333%;
        }
    }

    @media (max-width: 768px) {
        .embla__slide {
            flex: 0 0 50%;
            padding-left: var(--spacing-sm);
        }
        .embla__container {
            margin-left: calc(var(--spacing-sm) * -1);
        }

        .navigation-group {
            gap: var(--spacing-sm);
            padding: 0.4rem var(--spacing-sm);
        }

        .dot {
            width: 6px;
            height: 6px;
        }

        .dot.active {
            width: 16px;
        }
    }

    @media (max-width: 480px) {
        .embla__slide {
            flex: 0 0 85%;
        }

        .controls {
            margin-top: var(--spacing-md);
        }
    }
</style>
