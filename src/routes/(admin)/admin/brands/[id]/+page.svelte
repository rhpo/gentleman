<script lang="ts">
  import {
    updateExistingBrand,
    deleteExistingBrand,
  } from "$lib/api/admin/brands";

  import { goto } from "$app/navigation";
  import { STORAGE_BUCKETS } from "$lib/constants/storage";

  import type { PageData } from "./$types";
  import type { BrandInput } from "$lib/types/entities";

  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import DragDropZone from "$lib/components/ui/DragDropZone.svelte";

  const UPLOAD_ENDPOINT = "/api/upload";

  let { data }: { data: PageData } = $props();

  let formData = $state<BrandInput>({
    name: "",
    logo: "",
    short_description: "",
  });

  let isSubmitting = $state(false);
  let isDeleting = $state(false);
  let error = $state<string | null>(null);
  let logoFile = $state<File | null>(null);
  let logoPreview = $state<string>("");

  $effect(() => {
    formData.name = data.brand.name;
    formData.logo = data.brand.logo;
    formData.short_description = data.brand.short_description;
    logoPreview = data.brand.logo;
  });

  async function handleLogoChange(file: File | null): Promise<void> {
    if (!file) {
      logoFile = null;
      logoPreview = data.brand.logo;
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
      if (!formData.short_description.trim()) {
        throw new Error("Brand description is required");
      }

      let logoUrl = formData.logo;

      // If logo file changed, upload new one and delete old one via server
      if (logoFile) {
        // Upload new logo via API endpoint
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

        const { url: newLogoUrl, path: newLogoPath } =
          await uploadResponse.json();
        logoUrl = newLogoUrl;

        // Delete old logo via API endpoint if it exists
        if (data.brand.logo) {
          try {
            // Extract the path from the old URL and delete it
            const oldPath = data.brand.logo.split("/").pop();
            if (oldPath) {
              await fetch(UPLOAD_ENDPOINT, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bucket: STORAGE_BUCKETS.BRAND_LOGOS,
                  path: oldPath,
                }),
              }).catch(() => {
                // Don't fail if deletion fails
              });
            }
          } catch (err) {
            console.error("Error deleting old logo:", err);
            // Don't fail the whole operation if old file deletion fails
          }
        }
      }

      // Update brand with potentially new logo URL
      const brandData: Partial<BrandInput> = {
        name: formData.name,
        logo: logoUrl,
        short_description: formData.short_description,
      };

      await updateExistingBrand(data.brand.id, brandData);

      // Redirect to brands list
      await goto("/admin/brands");
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating brand:", err);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(): Promise<void> {
    if (
      !confirm(
        "Are you sure you want to delete this brand? This cannot be undone.",
      )
    ) {
      return;
    }

    isDeleting = true;
    error = null;

    try {
      // Delete logo from storage if it exists
      if (data.brand.logo) {
        try {
          const logoPath = data.brand.logo.split("/").pop();
          if (logoPath) {
            await fetch(UPLOAD_ENDPOINT, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bucket: STORAGE_BUCKETS.BRAND_LOGOS,
                path: logoPath,
              }),
            }).catch(() => {
              // Don't fail if deletion fails
            });
          }
        } catch (err) {
          console.error("Error deleting logo:", err);
          // Don't fail the whole operation if file deletion fails
        }
      }

      // Delete brand from database
      await deleteExistingBrand(data.brand.id);

      // Redirect to brands list
      await goto("/admin/brands");
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting brand:", err);
    } finally {
      isDeleting = false;
    }
  }
</script>

<svelte:head>
  <title>Edit Brand - Admin</title>
</svelte:head>

<AdminPage title="Edit Brand" description={`Editing ${data.brand.name}`}>
  <form onsubmit={handleSubmit}>
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

    <div class="logo-section">
      <label for="logo">Brand Logo</label>
      <DragDropZone
        id="logo"
        onchange={handleLogoChange}
        backgroundImage={logoPreview}
        accept="image/*"
      />
    </div>

    <Textarea
      id="brand-description"
      label="Description"
      placeholder="Enter brand description"
      value={formData.short_description}
      onchange={(e) =>
        (formData.short_description = (e.target as HTMLTextAreaElement).value)}
      rows={3}
      required
    />

    <div class="form-actions">
      <Button type="primary" onclick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
      <Button type="secondary" href="/admin/brands">Cancel</Button>
      <Button
        type="error"
        onclick={handleDelete}
        disabled={isDeleting}
        style="margin-left: auto"
      >
        {isDeleting ? "Deleting..." : "Delete Brand"}
      </Button>
    </div>
  </form>
</AdminPage>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
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
</style>
