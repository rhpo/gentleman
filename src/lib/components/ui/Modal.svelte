<!-- Reusable Modal Component -->
<script lang="ts">
    interface ModalProps {
        isOpen: boolean;
        onClose: () => void;
        title?: string;
        children?: import("svelte").Snippet;
    }

    let {
        isOpen = $bindable(false),
        onClose,
        title,
        children,
    }: ModalProps = $props();

    // Close modal on escape key
    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape" && isOpen) {
            onClose();
        }
    }

    // Close modal on backdrop click
    function handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <div class="modal-backdrop" onclick={handleBackdropClick}>
        <div class="modal-content">
            {#if title}
                <div class="modal-header">
                    <h3>{title}</h3>
                    <button class="close-btn" onclick={onClose}>×</button>
                </div>
            {/if}
            <div class="modal-body">
                {#if children}
                    {@render children()}
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--color-overlay);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    .modal-content {
        background-color: var(--color-bg);
        border-radius: var(--radius-lg);
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: var(--shadow-lg);
        animation: slideUp 0.3s ease;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
    }

    .modal-header h3 {
        margin: 0;
        font-size: 1.5rem;
    }

    .close-btn {
        font-size: 2rem;
        color: var(--color-text-secondary);
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color var(--transition-fast);
    }

    .close-btn:hover {
        color: var(--color-text);
    }

    .modal-body {
        padding: var(--spacing-md);
    }
    @media screen and (max-width: 720px) {
        .modal-body {
            padding: var(--spacing-sm);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
