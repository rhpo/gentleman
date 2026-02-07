<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        type?: "primary" | "secondary" | "error";
        href?: string;
        label?: string;
        autoWidth?: boolean;
        Icon?: any;
        onClick?: () => void;
        children?: Snippet;
        selected?: boolean;
        color?: string;
        strokeWidth?: number;
        [key: string]: any;
    }

    let {
        type = "primary",
        href = "",
        label = "",
        autoWidth = false,
        Icon,
        onClick = () => {},
        selected = false,
        children,
        size = 24,
        strokeWidth = 1.5,
        color = "white",
        ...rest
    }: Props = $props();
</script>

{#if href}
    <a
        class="button"
        aria-label="Panier"
        class:auto-width={autoWidth}
        {href}
        class:selected
        {...rest}
    >
        {@render children?.()}

        {#if Icon}
            <Icon {size} {strokeWidth} />
        {/if}
    </a>
{:else}
    <button
        class="button {type}"
        aria-label="Panier"
        class:auto-width={autoWidth}
        onclick={onClick}
        class:selected
        {...rest}
    >
        {@render children?.()}

        {#if Icon}
            <Icon {size} {strokeWidth} />
        {/if}
    </button>
{/if}

<style>
    :root {
        --border-icon: 2px;
        --padding-icon: 0.5rem;
    }

    .button {
        text-decoration: none;
        padding: var(--padding-icon);
        transition: all var(--transition-medium);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        border: var(--border-icon) dashed transparent;
    }

    .button:hover {
        background: var(--color-card-bg);
        color: var(--color-accent);
        transform: translateY(-2px);
        border-color: var(--color-accent);
    }

    .button.primary {
    }

    .button.selected {
        background: var(--color-accent) !important;
        color: var(--color-white) !important;
        transform: scale(1.05) translateY(-2px);
        border: var(--border-icon) dashed var(--color-accent) !important;
    }

    .button.selected :global(svg) {
        fill: var(--color-white) !important;
        transform: scale(1.2);
        transition: all var(--transition-medium);
    }

    .button.selected:hover {
        background: var(--color-accent);
        color: var(--color-white) !important;
        transform: scale(1.05) rotate(5deg) translateY(-2px);
    }

    .button.secondary {
        background: var(--color-accent);
        color: var(--color-white);
    }

    .button.secondary:hover {
        background: var(--color-hover);
        color: var(--color-white);
    }

    .button.error {
        background: var(--color-error);
        color: var(--color-white);
    }

    .button.error:hover {
        background: var(--color-error-dark);
        color: var(--color-white);
    }

    /*
	@media screen and (max-width: 768px) {
		.button.selected {
		}
	} */
</style>
