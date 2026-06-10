<!-- Create Product Page -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { createNewProduct } from "$lib/api/admin/products";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import DragDropZone from "$lib/components/ui/DragDropZone.svelte";
  import BrandSelector from "$lib/components/ui/BrandSelector.svelte";
  import VariantsEditor from "$lib/components/ui/VariantsEditor.svelte";
  import type { PageData } from "./$types";
  import type {
    ProductInput,
    ProductGender,
    ProductCategory,
    ScentFamily,
    ProductOccasion,
    ProductVariantInput,
  } from "$lib/types/entities";
  import Container from "$lib/components/ui/Container.svelte";
  import { STORAGE_BUCKETS } from "$lib/constants/storage";
  import {
    CATEGORY_OPTIONS,
    GENDER_OPTIONS,
    SCENT_FAMILY_OPTIONS,
    OCCASION_OPTIONS,
  } from "$lib/constants/productOptions";

  const UPLOAD_ENDPOINT = "/api/upload";

  let { data }: { data: PageData } = $props();

  let formData = $state<Omit<ProductInput, "variants">>({
    name: "",
    type: "parfum",
    category: null,
    gender: "Unisex",
    scent_family: null,
    occasion: null,
    size: 100,
    brand_id: null,
    price: 0,
    description: "",
    image: "",
  });

  let useVariants = $state(false);
  let variants = $state<ProductVariantInput[]>([]);

  let loading = $state(false);
  let error = $state("");
  let imageFile = $state<File | null>(null);
  let imagePreview = $state<string>("");

  function handleImageChange(file: File | null) {
    if (!file) {
      imageFile = null;
      imagePreview = "";
      formData.image = "";
      return;
    }
    imageFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview = (event.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    loading = true;
    error = "";

    try {
      if (!imageFile) throw new Error("Product image is required");
      if (useVariants && variants.length === 0)
        throw new Error("Add at least one size variant");

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

      const { url: imageUrl } = await uploadResponse.json();

      const productData: ProductInput = {
        ...formData,
        image: imageUrl,
        ...(useVariants ? { variants } : {}),
      };

      await createNewProduct(productData);
      await goto("/admin/products");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to create product";
      loading = false;
    }
  }

  function handleCancel(): void {
    goto("/admin/products");
  }
</script>

<AdminPage
  title="Create New Product"
  description="Add a new product to the inventory"
>
  {#if error}
    <div class="error-message"><p>{error}</p></div>
  {/if}

  <Container>
    <form onsubmit={handleSubmit} class="product-form">
      <div class="form-grid">
        <!-- Left Column -->
        <div class="form-column">
          <h3>Basic Information</h3>

          <Input
            id="name"
            label="Product Name *"
            placeholder="Enter product name"
            value={formData.name}
            onchange={(e) => (formData.name = (e.target as HTMLInputElement).value)}
            required
          />

          <Select
            id="gender"
            label="Gender *"
            value={formData.gender}
            options={GENDER_OPTIONS as any}
            onchange={(e) =>
              (formData.gender = (e.target as HTMLSelectElement).value as ProductGender)}
            required
          />

          <!-- Size variants toggle -->
          <div class="variants-toggle">
            <label class="toggle-label">
              <input
                type="checkbox"
                bind:checked={useVariants}
                onchange={() => { if (!useVariants) variants = []; }}
              />
              <span>Multiple sizes (variants)</span>
            </label>
            <p class="toggle-hint">
              {useVariants
                ? "Each size has its own price."
                : "Single size and price for this product."}
            </p>
          </div>

          {#if useVariants}
            <div class="field-group">
              <label class="field-label">Size Variants *</label>
              <VariantsEditor
                {variants}
                onchange={(v) => (variants = v)}
              />
            </div>
          {:else}
            <Input
              id="size"
              label="Size (ml) *"
              type="number"
              placeholder="100"
              min="1"
              value={formData.size}
              onchange={(e) =>
                (formData.size = Number((e.target as HTMLInputElement).value))}
              required
            />
            <Input
              id="price"
              label="Price (DA) *"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onchange={(e) =>
                (formData.price = parseFloat((e.target as HTMLInputElement).value))}
              required
            />
          {/if}

          <h3 style="margin-top: 1.5rem;">Additional Details</h3>

          <Select
            id="category"
            label="Category"
            value={formData.category || ""}
            options={[{ value: "", label: "None" }, ...CATEGORY_OPTIONS] as any}
            onchange={(e) =>
              (formData.category = (e.target as HTMLSelectElement).value as ProductCategory | null)}
          />

          <Select
            id="scent_family"
            label="Scent Family"
            value={formData.scent_family || ""}
            options={[{ value: "", label: "None" }, ...SCENT_FAMILY_OPTIONS] as any}
            onchange={(e) =>
              (formData.scent_family = (e.target as HTMLSelectElement).value as ScentFamily | null)}
          />

          <Select
            id="occasion"
            label="Occasion"
            value={formData.occasion || ""}
            options={[{ value: "", label: "None" }, ...OCCASION_OPTIONS] as any}
            onchange={(e) =>
              (formData.occasion = (e.target as HTMLSelectElement).value as ProductOccasion | null)}
          />

          <BrandSelector
            id="brand_id"
            label="Brand"
            brands={data.brands}
            bind:value={formData.brand_id}
            bindToId={true}
          />
        </div>

        <div class="form-column image-column">
          <DragDropZone
            id="image"
            label="Product Image *"
            accept="image/*"
            required
            onchange={handleImageChange}
          />
        </div>
      </div>

      <div class="description-section">
        <h3>Description</h3>
        <Textarea
          id="description"
          placeholder="Enter product description"
          value={formData.description}
          onchange={(e) =>
            (formData.description = (e.target as HTMLTextAreaElement).value)}
          rows={4}
        />
      </div>

      <div class="form-actions">
        <Button type="secondary" onclick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="primary" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  </Container>
</AdminPage>

<style>
  .error-message {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background-color: #fee;
    border: 1px solid #fcc;
    border-radius: 0.375rem;
    color: #c33;
  }

  .product-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .form-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .image-column {
    justify-content: flex-start;
  }

  .form-column h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .variants-toggle {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
  }

  .toggle-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: var(--color-accent);
  }

  .toggle-hint {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
    padding-left: 1.5rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
  }

  .description-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .description-section h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }
</style>
