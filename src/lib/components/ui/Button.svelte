<script lang="ts">
    let {
        href,
        type = "primary",
        label = "",
        Icon = null,
        iconPosition = "left",
        iconSize = 24,
        autoWidth = false,
        fullWidth = false,
        onClick = () => {},
        children = null,
        color = "var(--color-accent)",
        colorHover = "var(--color-hover)",
        isSubmit = false,

        // css
        large = false,
        uppercase = false,
        round = false,
        blink = false,

        ...rest
    }: {
        href?: string;
        type?: "primary" | "secondary" | "third" | "cta" | "error";
        label?: string;
        Icon?: any;
        iconPosition?: "left" | "right";
        iconSize?: number;
        autoWidth?: boolean;
        fullWidth?: boolean;
        onClick?: () => void;
        children?: any;
        color?: string;
        colorHover?: string;

        round?: boolean;
        large?: boolean;
        uppercase?: boolean;
        blink?: boolean;

        isSubmit?: boolean;
    } & Record<string, any> = $props();

    let styleBuilder = $derived(
        (() => {
            let styles: Record<typeof type, string> = {
                primary: `--color: ${color}; --bg-color: ${color}; --accent: var(--color-accent); --hover: var(--color-hover);`,
                secondary: `--color: ${color}; --border-color: ${color}; --accent: ${color}; --color-hover: ${colorHover};`,
                third: `--color: ${color}; --bg-color: ${color};`,
                cta: `--color: ${color}; --bg-color: ${color};`,
                error: `--color: ${color}; --bg-color: ${color};`,
            };

            return styles[type];
        })(),
    );
</script>

{#if href}
    <a
        class="button {type}"
        class:large
        class:uppercase
        class:round
        class:blink
        class:auto-width={autoWidth}
        class:full-width={fullWidth}
        {href}
        style={styleBuilder}
        {...rest}
        onclick={onClick}
    >
        {#if Icon && iconPosition === "left"}
            <Icon size={iconSize} />
        {/if}

        {#if label}
            <span class="label">{label}</span>
        {/if}

        {@render children?.()}

        {#if Icon && iconPosition === "right"}
            <Icon size={iconSize} />
        {/if}
    </a>
{:else}
    <button
        class="button {type}"
        class:large
        class:uppercase
        class:round
        class:blink
        style={styleBuilder}
        class:auto-width={autoWidth}
        onclick={onClick}
        class:full-width={fullWidth}
        {...rest}
    >
        {#if Icon && iconPosition === "left"}
            <Icon size={iconSize} />
        {/if}

        {#if label}
            <span class="label">{label}</span>
        {/if}

        {@render children?.()}

        {#if Icon && iconPosition === "right"}
            <Icon size={iconSize} />
        {/if}
    </button>
{/if}

<style>
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem 2rem;
        font-family: var(--font-body);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        background: none;
        text-decoration: none;
        line-height: 1;
        position: relative;
    }

    .primary {
        background-color: var(--accent);
        color: var(--color-bg);
    }

    .primary:hover:not([disabled]) {
        background-color: var(--hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .secondary {
        border: 1px solid var(--accent);
        color: var(--accent);
    }

    .secondary:hover:not([disabled]) {
        background-color: var(--accent);
        color: var(--color-bg);
        transform: translateY(-2px);
    }

    .third,
    .cta {
        background-color: var(--color-card-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border);
    }

    .third:hover:not([disabled]),
    .cta:hover:not([disabled]) {
        background-color: var(--color-border);
        transform: translateY(-2px);
    }

    .error {
        background-color: var(--color-error);
        color: var(--color-white);
    }

    .error:hover:not([disabled]) {
        background-color: var(--color-error-dark);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    /* Utilities */
    .button.large {
        padding: 1.25rem 2.5rem;
        font-size: 1rem;
    }

    .button.round {
        border-radius: 50px;
    }

    .button.uppercase {
        text-transform: uppercase;
    }

    .button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    .button.blink {
        animation: blink 2s infinite;
    }

    .button.full-width {
        width: 100%;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .button.full-width {
        width: 100%;
    }

    @media (max-width: 768px) {
        .button.auto-width {
            width: 100%;
        }

        .button {
            padding: 0.875rem 1.5rem;
            font-size: 0.8125rem;
        }
    }
</style>
