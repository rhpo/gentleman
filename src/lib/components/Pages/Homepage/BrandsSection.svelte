<script lang="ts">
    import type { Brand } from "$lib/types/entities";
    import HeroSection from "$lib/components/ui/HeroSection.svelte";
    import emblaCarouselSvelte from "embla-carousel-svelte";
    import AutoScroll from "embla-carousel-auto-scroll";
    import { brandSection } from "$lib/i18n/brands";

    interface IProps {
        brands: Brand[];
    }

    let { brands }: IProps = $props();

    const options = { loop: true, dragFree: true };
    const plugins = [
        AutoScroll({
            speed: 1,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        }),
    ];
</script>

<HeroSection
    title={$brandSection.title}
    description={$brandSection.description}
    class="brands-section"
>
    <div class="embla">
        <div
            class="embla__viewport"
            use:emblaCarouselSvelte={{ options, plugins }}
        >
            <div class="embla__container">
                {#each [...brands, ...brands, ...brands] as brand}
                    <div class="embla__slide">
                        <a
                            href="/products?brand={encodeURIComponent(
                                brand.name,
                            )}"
                            class="brand-item"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                class="brand-image"
                            />
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</HeroSection>

<style>
    :global(.brands-section) {
        overflow: hidden !important;
    }

    .embla {
        width: 100%;
        mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
        );
        -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
        );
    }

    .embla__viewport {
        overflow: hidden;
    }

    .embla__container {
        display: flex;
        touch-action: pan-y pinch-zoom;
    }

    .embla__slide {
        flex: 0 0 auto;
        min-width: 0;
    }

    .brand-item {
        height: 12°px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        text-decoration: none;
        padding: 0.5rem var(--spacing-lg);
        user-select: none;
    }

    .brand-item:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
    }

    .brand-image {
        max-width: 150px;
        max-height: 100%;
        object-fit: contain;
        opacity: 0.8;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    :global([data-theme="dark"]) .brand-image {
        filter: invert(1);
    }

    .brand-item:hover .brand-image {
        opacity: 1;
    }

    @media (max-width: 768px) {
        .brand-item {
            height: 60px;
            padding: 0 var(--spacing-md);
        }

        .brand-item:hover {
            transform: scale(1.1);
            filter: brightness(1.2);
        }

        .brand-image {
            max-width: 100px;
        }
    }
</style>
