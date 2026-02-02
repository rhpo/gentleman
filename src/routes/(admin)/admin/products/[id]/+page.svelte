<!-- Edit Product Page -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    updateExistingProduct,
    type ProductInput,
  } from "$lib/api/admin/products";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DragDropZone from "$lib/components/ui/DragDropZone.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import BrandSelector from "$lib/components/ui/BrandSelector.svelte";
  import type { PageData } from "./$types";
  import type {
    ProductType,
    ProductCategory,
    ProductGender,
    ScentFamily,
    ProductOccasion,
    ProductSize,
    Brand,
  } from "$lib/types/entities";
  import { STORAGE_BUCKETS } from "$lib/constants/storage";
  import {
    TYPE_OPTIONS,
    CATEGORY_OPTIONS,
    GENDER_OPTIONS,
    SCENT_FAMILY_OPTIONS,
    OCCASION_OPTIONS,
  } from "$lib/constants/productOptions";

  const UPLOAD_ENDPOINT = "/api/upload";

  let { data }: { data: PageData } = $props();

  let product = $derived(data.product);
  let brands = $derived(data.brands || []);
  let productId = $derived(product?.id);

  let formData: Partial<ProductInput> = $state({
    name: "",
    type: "parfum",
    category: "Eau de Parfum",
    gender: "Unisex",
    scent_family: "Floral",
    occasion: "Evening",
    size: 100, // Standard (100ml)
    brand_id: null as number | null,
    price: 0,
    description: "",
    image: "",
  });

  let loading = $state(false);
  let error = $state("");
  let imageFile = $state<File | null>(null);
  let imagePreview = $state<string>("");

  $effect(() => {
    if (product) {
      formData = {
        name: product.name,
        type: product.type,
        category: product.category,
        gender: product.gender,
        scent_family: product.scent_family,
        occasion: product.occasion,
        size: product.size,
        brand_id: product.brand_id || null,
        price: product.price || 0,
        description: product.description,
        image: "", // Don't auto-fill with old image - only upload if changed
      };
      imagePreview = product.image; // Show current image as preview
    }
  });

  function handleImageChange(file: File | null): void {
    if (!file) {
      imageFile = null;
      imagePreview = product?.image || "";
      return;
    }

    imageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = (e.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (!productId) {
      error = "Product ID not found";
      return;
    }

    loading = true;
    error = "";

    try {
      let imageUrl = formData.image || product?.image || "";

      // If image file changed, upload new one
      if (imageFile) {
        const uploadResponse = await fetch(UPLOAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imagePreview,
            fileName: imageFile.name,
            bucket: STORAGE_BUCKETS.PRODUCT_IMAGES,
          }),
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || "Failed to upload image");
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      // Update product with potentially new image URL
      const productData: Partial<ProductInput> = {
        ...formData,
        image: imageUrl,
      };

      await updateExistingProduct(productId, productData);
      await goto("/admin/products");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to update product";
      loading = false;
    }
  }

  function handleCancel(): void {
    goto("/admin/products");
  }
</script>

<AdminPage title="Edit Product" description="Update product information">
  <div class="form-container">
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="product-form">
      <div class="form-section">
        <h2>Image</h2>

        <div class="drag-drop">
          <DragDropZone
            onchange={handleImageChange}
            accept="image/*"
            backgroundImage={product?.image}
          />
        </div>
      </div>

      <div class="form-section">
        <h2>Basic Information</h2>

        <Input
          id="name"
          label="Product Name *"
          placeholder="Enter product name"
          value={formData.name}
          onchange={(e) =>
            (formData.name = (e.target as HTMLInputElement).value)}
          required
        />

        <div class="form-row">
          <Select
            id="type"
            label="Type *"
            value={formData.type || "parfum"}
            options={TYPE_OPTIONS as any}
            onchange={(e) =>
              (formData.type = (e.target as HTMLSelectElement)
                .value as ProductType)}
            required
          />

          <Select
            id="category"
            label="Category"
            value={formData.category || "Eau de Parfum"}
            options={CATEGORY_OPTIONS as any}
            onchange={(e) =>
              (formData.category = (e.target as HTMLSelectElement)
                .value as ProductCategory)}
          />
        </div>

        <div class="form-row">
          <Select
            id="gender"
            label="Gender"
            value={formData.gender || "Unisex"}
            options={GENDER_OPTIONS as any}
            onchange={(e) =>
              (formData.gender = (e.target as HTMLSelectElement)
                .value as ProductGender)}
          />

          <Input
            id="size"
            label="Size (ml)"
            type="number"
            placeholder="100"
            min="1"
            value={formData.size || 100}
            onchange={(e) =>
              (formData.size = Number(
                (e.target as HTMLInputElement).value,
              ) as ProductSize)}
          />
        </div>
      </div>

      <div class="form-section">
        <h2>Details</h2>

        <div class="form-row">
          <Select
            id="scent_family"
            label="Scent Family"
            value={formData.scent_family || "Floral"}
            options={SCENT_FAMILY_OPTIONS as any}
            onchange={(e) =>
              (formData.scent_family = (e.target as HTMLSelectElement)
                .value as ScentFamily)}
          />

          <Select
            id="occasion"
            label="Occasion"
            value={formData.occasion || "Evening"}
            options={OCCASION_OPTIONS as any}
            onchange={(e) =>
              (formData.occasion = (e.target as HTMLSelectElement)
                .value as ProductOccasion)}
          />
        </div>

        <BrandSelector
          {brands}
          value={formData.brand_id || null}
          onchange={(e) => {
            const selectedValue = (e.target as HTMLSelectElement).value;
            formData.brand_id = selectedValue ? Number(selectedValue) : null;
          }}
        />

        <Textarea
          id="description"
          label="Description"
          value={formData.description}
          placeholder="Enter product description"
          rows={4}
          onchange={(e) =>
            (formData.description = (e.target as HTMLTextAreaElement).value)}
        />
      </div>

      <div class="form-section">
        <h2>Pricing</h2>

        <Input
          id="price"
          label="Price (DA) *"
          type="number"
          step="0.01"
          value={formData.price}
          onchange={(e) =>
            (formData.price = parseFloat((e.target as HTMLInputElement).value))}
          required
        />
      </div>

      <div class="form-actions">
        <Button type="secondary" onclick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="primary" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  </div>
</AdminPage>

<style>
  .form-container {
    max-width: var(--view-width);
  }

  .drag-drop :global(> *) {
    max-height: 500px;
  }

  .error-message {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    color: var(--color-error);
  }

  .product-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-section {
    padding: var(--spacing-md);
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .form-section h2 {
    font-family: var(--font-brand);
    font-size: 1.25rem;
    margin-top: 0;
    margin-bottom: var(--spacing-md);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    padding-top: var(--spacing-md);
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;
    }
  }
</style>
