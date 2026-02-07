<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import SlideHero from "$lib/components/ui/SlideHero.svelte";
  import ProductCard from "$lib/components/products/ProductCard.svelte";
  import BrandsSection from "./BrandsSection.svelte";

  import { Heart, ShoppingBag } from "@lucide/svelte";
  import { homepage } from "$lib/i18n/pages/homepage";

  import { wishlist } from "$lib/stores/wishlist";
  import { getProductsByIds, type ProductWithBrand } from "$lib/api/products";
  import { t } from "$lib/i18n/translations";

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
      likedProducts = await getProductsByIds(ids);
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

    {#each $homepage.slides.slice(1) as slide}
      <SlideHero media={slide.image}>
        <div class="hero">
          <h2>{slide.title}</h2>

          {#if slide.description}
            <p>{slide.description}</p>
          {/if}

          {#if slide.button}
            <Button
              href="/products?category=parfum"
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

  <BrandsSection brands={data.brands} />

  <section class="featured-section section">
    <div class="container">
      <h2 class="section-title text-center text-uppercase">
        {$t.featuredProducts}
      </h2>
      <div class="products-grid">
        {#each data.featuredProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </section>

  {#if likedProducts.length > 0}
    <section class="wishlist-section section">
      <div class="container">
        <h2 class="section-title text-center text-uppercase">
          {$t.yourWishlist}
        </h2>
        <div class="products-grid">
          {#each likedProducts as product (product.id)}
            <ProductCard {product} />
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <SlideHero media={$homepage.slides[0].image}>
    <div class="hero">
      <h2>{$homepage.slides[0].title}</h2>

      {#if $homepage.slides[0].description}
        <p>{$homepage.slides[0].description}</p>
      {/if}

      {#if $homepage.slides[0].button}
        <Button
          href="/products?category=parfum"
          type="secondary"
          autoWidth
          Icon={ShoppingBag}
          color="white"
          colorHover="black">{$homepage.slides[0].button}</Button
        >
      {/if}
    </div>
  </SlideHero>
</main>

<style>
  .wishlist-section {
    padding-top: 0;
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

  .featured-section {
    background-color: var(--color-bg);
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: var(--spacing-lg);
    letter-spacing: 0.2em;
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
