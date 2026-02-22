<!-- Product Card Component -->
<script lang="ts">
  import { addToCart } from "$lib/stores/cart";
  import { t } from "$lib/i18n/translations";
  import Button from "../ui/Button.svelte";
  import ProductWithActions from "./ProductWithActions.svelte";
  import type { ProductWithBrand } from "$lib/types/entities";
  import { ShoppingCart } from "@lucide/svelte";
  import svelteTilt from "vanilla-tilt-svelte";

  interface ProductCardProps {
    product: ProductWithBrand;
  }

  let { product }: ProductCardProps = $props();
  let added = $state(false);

  function handleAddToCart(): void {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    added = true;
    setTimeout(() => {
      added = false;
    }, 2000);
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
  </ProductWithActions>
</main>

<style>
  main:hover {
    z-index: 99;
  }
</style>
