<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import SlideHero from "$lib/components/ui/SlideHero.svelte";
  import ProductCard from "$lib/components/products/ProductCard.svelte";

  import { ShoppingBag } from "@lucide/svelte";
  import { homepage } from "$lib/i18n/pages/homepage";

  interface IProps {
    data: any;
  }

  let { data }: IProps = $props();
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
          style="filter: invert()"
          autoWidth
          Icon={ShoppingBag}
          color="white">{$homepage.hero_button}</Button
        >
      </div>
    </SlideHero>

    {#each $homepage.slides as slide}
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
              style="filter: invert()"
              autoWidth
              Icon={ShoppingBag}
              color="white">{slide.button}</Button
            >
          {/if}
        </div>
      </SlideHero>
    {/each}
  </section>

  <section class="featured-section section">
    <div class="container">
      <h2 class="section-title text-center">COLLECTION</h2>
      <div class="products-grid">
        {#each data.featuredProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
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
    font-family: var(--font-heading);
    font-size: clamp(3rem, 3vw, 4rem);
    max-width: 50rem;
    color: white;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  .featured-section {
    background-color: var(--color-bg);
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: var(--spacing-lg);
    letter-spacing: 0.2em;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }

  @media (max-width: 768px) {
    .heroes {
      gap: var(--spacing-sm);
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }
  }
</style>
