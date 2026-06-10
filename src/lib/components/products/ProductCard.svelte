<!-- Product Card Component -->
<script lang="ts">
  import { addToCart } from "$lib/stores/cart";
  import { t } from "$lib/i18n/translations";
  import Button from "../ui/Button.svelte";
  import ProductWithActions from "./ProductWithActions.svelte";
  import type { ProductWithBrand } from "$lib/types/entities";
  import { ArrowRight, ShoppingCart } from "@lucide/svelte";
  import svelteTilt from "vanilla-tilt-svelte";

  interface ProductCardProps {
    product: ProductWithBrand;
  }

  let { product }: ProductCardProps = $props();
  let added = $state(false);

  let hasVariants = $derived((product.variants?.length ?? 0) > 0);

  function handleAddToCart(): void {
    addToCart({
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size || null,
    });
    added = true;
    setTimeout(() => { added = false; }, 2000);
  }
</script>

<main
  use:svelteTilt={{
    max: 10,
    speed: 1000,
    gyroscopeMaxAngleY: 10,
    gyroscopeMaxAngleX: 10,
    glare: true,
    maxGlare: 1,
    perspective: 1000,
    scale: 1.05,
    transition: true,
  }}
>
  <ProductWithActions {product}>
    {#if hasVariants}
      <!-- Must pick a size on the detail page -->
      <Button
        type="cta"
        fullWidth
        href="/products/{product.id}"
        Icon={ArrowRight}
        iconPosition="right"
        iconSize={16}
      >
        Choose Size
      </Button>
    {:else}
      <Button
        type="cta"
        fullWidth
        onclick={handleAddToCart}
        Icon={ShoppingCart}
        iconPosition="left"
        iconSize={18}
        disabled={added}
      >
        {added ? $t.added : ""}
      </Button>
    {/if}
  </ProductWithActions>
</main>

<style>
  main:hover {
    z-index: 99;
  }
</style>
