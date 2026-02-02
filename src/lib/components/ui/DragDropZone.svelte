<!-- Drag and Drop Zone Component -->
<script lang="ts">
  import { Recycle } from "@lucide/svelte";

  interface DragDropZoneProps {
    id?: string;
    label?: string;
    accept?: string;
    required?: boolean;
    disabled?: boolean;
    backgroundImage?: string;
    onchange?: (file: File | null) => void;
  }

  let {
    id,
    label,
    accept = "image/*",
    required = false,
    disabled = false,
    backgroundImage,
    onchange,
  }: DragDropZoneProps = $props();

  let isDragging = $state(false);
  let selectedFile = $state<File | null>(null);
  let preview = $state<string>("");
  let imageWidth = $state(0);
  let imageHeight = $state(0);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  function handleDragOver(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    isDragging = false;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }

  function handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      processFile(input.files[0]);
    }
  }

  function processFile(file: File) {
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    selectedFile = file;

    // Create preview and get image dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      preview = (e.target?.result as string) || "";

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        imageWidth = img.naturalWidth;
        imageHeight = img.naturalHeight;
      };
      img.src = preview;
    };
    reader.readAsDataURL(file);

    // Call callback
    if (onchange) {
      onchange(file);
    }
  }

  function clearFile() {
    selectedFile = null;
    preview = "";
    imageWidth = 0;
    imageHeight = 0;
    if (onchange) {
      onchange(null);
    }
  }

  function handleZoneClick() {
    if (!disabled && fileInputRef) {
      fileInputRef.click();
    }
  }
</script>

<div class="drag-drop-container">
  {#if label}
    <label for={id} class="label">{label}</label>
  {/if}

  <div
    class="drag-drop-zone"
    class:dragging={isDragging}
    class:disabled
    class:has-image={preview || backgroundImage}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={handleZoneClick}
    role="presentation"
    style={`background-image: url('${preview || backgroundImage || ""}'); background-size: cover; background-position: center; ${preview || backgroundImage ? `aspect-ratio: ${imageWidth && imageHeight ? imageWidth / imageHeight : 1};` : ""}`}
  >
    {#if preview || backgroundImage}
      <div class="image-overlay">
        <button type="button" class="remove-btn" onclick={clearFile} {disabled}>
          <Recycle /> Change Image
        </button>
        <div class="upload-hint">
          <p class="hint-text">Drop new image to replace</p>
        </div>
      </div>
    {:else}
      <div class="upload-content">
        <svg
          class="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <p class="drag-text">Drag and drop your image here</p>
        <p class="or-text">or</p>
        <label for={id} class="browse-link"> Browse files </label>
      </div>
    {/if}
  </div>

  <input
    bind:this={fileInputRef}
    {id}
    type="file"
    {accept}
    {required}
    {disabled}
    onchange={handleFileInput}
    style="display: none"
  />

  {#if selectedFile}
    <p class="file-info">Selected: <strong>{selectedFile.name}</strong></p>
  {/if}
</div>

<style>
  .drag-drop-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }

  .drag-drop-zone {
    position: relative;
    border: 2px dashed var(--color-border);
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    background-color: var(--color-bg);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .drag-drop-zone.has-image {
    background-color: transparent;
    border-color: var(--color-border);
    padding: 0;
  }

  .drag-drop-zone:hover:not(.disabled):not(.has-image) {
    border-color: var(--color-accent);
    background-color: rgba(var(--color-accent-rgb), 0.05);
  }

  .drag-drop-zone.dragging {
    border-color: var(--color-accent);
    background-color: rgba(var(--color-accent-rgb), 0.1);
    transform: scale(1.02);
  }

  .drag-drop-zone.dragging.has-image {
    background-color: rgba(var(--color-accent-rgb), 0.3);
  }

  .drag-drop-zone.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0.5;
    transition: opacity var(--transition-fast);
  }

  .drag-drop-zone:hover .image-overlay {
    opacity: 1;
  }

  .upload-hint {
    color: white;
  }

  .hint-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .remove-btn {
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--color-text-primary);
    border: none;
    border-radius: 0.375rem;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    transition: background-color var(--transition-fast);
    z-index: 10;
  }

  .remove-btn:hover:not(:disabled) {
    background-color: white;
  }

  .remove-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .upload-icon {
    width: 3rem;
    height: 3rem;
    color: var(--color-text-secondary);
  }

  .drag-text {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
  }

  .or-text {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .browse-link {
    color: var(--color-accent);
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
    transition: color var(--transition-fast);
  }

  .browse-link:hover {
    color: var(--color-accent-hover);
  }

  .file-info {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
  .file-info strong {
    color: var(--color-text-primary);
  }
</style>
