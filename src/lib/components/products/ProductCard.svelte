<!-- Product Card Component -->
<script lang="ts">
  import { addToCart } from "$lib/stores/cart";
  import { t } from "$lib/i18n/translations";
  import Button from "../ui/Button.svelte";
  import ProductWithActions from "./ProductWithActions.svelte";
  import type { ProductWithBrand } from "$lib/types/entities";
  import { onMount } from "svelte";

  interface ProductCardProps {
    product: ProductWithBrand;
  }

  let { product }: ProductCardProps = $props();

  function handleAddToCart(): void {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  onMount(() => {
    console.log(product);
  });
</script>

<ProductWithActions {product}>
  <Button type="primary" onclick={handleAddToCart}>
    {$t.addToCart}
  </Button>
</ProductWithActions>
