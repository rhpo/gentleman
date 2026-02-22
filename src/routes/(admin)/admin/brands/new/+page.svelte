<script lang="ts">
  import type { BrandInput } from "$lib/types/entities";

  import { goto } from "$app/navigation";
  import { STORAGE_BUCKETS } from "$lib/constants/storage";

  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import DragDropZone from "$lib/components/ui/DragDropZone.svelte";
  import { createNewBrand } from "$lib/api/admin/brands";

  const UPLOAD_ENDPOINT = "/api/upload";

  let formData = $state<BrandInput>({
    name: "",
    logo: "",
    short_description: "",
  });

  let isSubmitting = $state(false);
  let error = $state<string | null>(null);
  let logoFile = $state<File | null>(null);
  let logoPreview = $state<string>("");

  async function handleLogoChange(file: File | null): Promise<void> {
    if (!file) {
      logoFile = null;
      logoPreview = "";
      return;
    }

    logoFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      logoPreview = (event.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    isSubmitting = true;
    error = null;

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error("Brand name is required");
      }
      if (!logoFile) {
        throw new Error("Brand logo is required");
      }
      if (!formData.short_description.trim()) {
        throw new Error("Brand description is required");
      }

      // Upload logo to Supabase via API endpoint
      const uploadResponse = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: logoPreview,
          fileName: logoFile.name,
          bucket: STORAGE_BUCKETS.BRAND_LOGOS,
        }),
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || "Failed to upload logo");
      }

      const { url: logoUrl } = await uploadResponse.json();

      // Create brand with logo URL
      const brandData: BrandInput = {
        name: formData.name,
        logo: logoUrl,
        short_description: formData.short_description,
      };

      await createNewBrand(brandData);

      // Redirect to brands list
      await goto("/admin/brands");
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating brand:", err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<AdminPage title="Create Brand" description="Add a new brand">
  <form onsubmit={handleSubmit}>
    <div class="fillable">
      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <Input
        id="brand-name"
        label="Brand Name"
        placeholder="Enter brand name"
        value={formData.name}
        onchange={(e) => (formData.name = (e.target as HTMLInputElement).value)}
        required
      />

      <Textarea
        id="brand-description"
        label="Description"
        placeholder="Enter brand description"
        value={formData.short_description}
        onchange={(e) =>
          (formData.short_description = (
            e.target as HTMLTextAreaElement
          ).value)}
        rows={3}
        required
      />

      <div class="form-actions">
        <Button type="primary" onclick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Brand"}
        </Button>
        <Button type="secondary" href="/admin/brands">Cancel</Button>
      </div>
    </div>

    <div class="logo-section">
      <label for="logo">Brand Logo (Black transparent)</label>
      <DragDropZone
        id="logo"
        onchange={handleLogoChange}
        backgroundImage={logoPreview}
        accept="image/*"
      />
    </div>
  </form>
</AdminPage>

<style>
  .fillable {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .fillable > * {
    flex: 1;
  }

  form {
    display: flex;
    gap: var(--spacing-lg);
  }

  .error-message {
    padding: 1rem;
    background-color: #fee;
    color: #c00;
    border-radius: 4px;
    border-left: 4px solid #c00;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo-section label {
    font-weight: 500;
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
  }

  @media (max-width: 768px) {
    form {
      flex-direction: column-reverse;
    }
  }
</style>
