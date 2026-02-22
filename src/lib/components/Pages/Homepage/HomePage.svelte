<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import SlideHero from "$lib/components/ui/SlideHero.svelte";
  import HeroSection from "$lib/components/ui/HeroSection.svelte";
  import ProductCard from "$lib/components/products/ProductCard.svelte";
  import ProductsCarousel from "$lib/components/products/ProductsCarousel.svelte";
  import BrandsSection from "./BrandsSection.svelte";

  import { homepage } from "$lib/i18n/pages/homepage";
  import { Heart, ShoppingBag } from "@lucide/svelte";

  import { t } from "$lib/i18n/translations";
  import { supabase } from "$lib/supabase";
  import { wishlist } from "$lib/stores/wishlist";
  import { getProductsByIds } from "$lib/api/products";

  import type { ProductWithBrand } from "$lib/types/entities";

  interface IProps {
    data: any;
  }

  let { data }: IProps = $props();
  let likedProducts: ProductWithBrand[] = $state([]);

  async function loadLikedProducts(ids: number[]) {
    if (ids.length === 0) {
      likedProducts = [];
      return;
    }
    try {
      likedProducts = await getProductsByIds(supabase, ids);
    } catch (error) {
      console.error("Error loading liked products for homepage:", error);
    }
  }

  $effect(() => {
    loadLikedProducts($wishlist);
  });
</script>

<main>
  <section class="heroes">
    <SlideHero isFirst media="/media/hero.webm">
      <div class="hero">
        <h4>{$homepage.hero_small_title}</h4>
        <h2>{$homepage.hero_title}</h2>

        <Button
          href="/products?category=parfum"
          type="secondary"
          autoWidth
          Icon={ShoppingBag}
          color="white"
          colorHover="black">{$homepage.hero_button}</Button
        >
      </div>
    </SlideHero>

    <BrandsSection brands={data.brands} />

    {#each $homepage.slides as slide}
      <SlideHero media={slide.image}>
        <div class="hero">
          <h2>{slide.title}</h2>

          {#if slide.description}
            <p>{slide.description}</p>
          {/if}

          {#if slide.button}
            <Button
              href={slide.button_href || "/products?category=parfum"}
              type="secondary"
              autoWidth
              Icon={ShoppingBag}
              color="white"
              colorHover="black">{slide.button}</Button
            >
          {/if}
        </div>
      </SlideHero>
    {/each}
  </section>

  <HeroSection
    title={$t.featuredProducts}
    description={$t.trendingDescription}
    class="featured-section"
  >
    <ProductsCarousel products={data.featuredProducts} />
  </HeroSection>

  {#if likedProducts.length > 0}
    <HeroSection
      title={$t.yourWishlist}
      description={$t.wishlistDescription}
      class="wishlist-section"
    >
      <div class="products-grid">
        {#each likedProducts.slice(0, 3) as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>

      <div class="wishlist-action text-center">
        <Button href="/wishlist" type="cta" autoWidth Icon={Heart}>
          {$t.yourWishlist}
        </Button>
      </div>
    </HeroSection>
  {/if}
</main>

<style>
  .wishlist-action {
    margin-top: var(--spacing-md);
  }

  .heroes {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .hero {
    text-align: center;
    padding: var(--spacing-lg);
    color: white;
  }

  .hero h4 {
    font-size: var(--font-size-xs);
    font-weight: 300;
    font-family: var(--font-body);
  }

  .hero h2 {
    font-size: clamp(3rem, 3vw, 4rem);
    max-width: 50rem;
    color: white;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 350px));
    justify-content: center;
    gap: var(--spacing-md);
  }

  @media (max-width: 768px) {
    .heroes {
      gap: var(--spacing-sm);
    }

    .products-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }
  }
</style>
