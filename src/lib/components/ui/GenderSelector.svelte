<script lang="ts">
    import { Mars, User, Venus } from "@lucide/svelte";
    import IconButton from "./IconButton.svelte";
    import { t } from "$lib/i18n/translations";

    let { value = $bindable(""), onchange } = $props();

    let isMen = $derived(value === "Men" || value === "Unisex");
    let isWomen = $derived(value === "Women" || value === "Unisex");

    function toggleMen() {
        let newValue = "";
        if (isMen) {
            if (isWomen) newValue = "Women";
            else newValue = "";
        } else {
            if (isWomen) newValue = "Unisex";
            else newValue = "Men";
        }
        value = newValue;
        onchange?.(newValue);
    }

    function toggleWomen() {
        let newValue = "";
        if (isWomen) {
            if (isMen) newValue = "Men";
            else newValue = "";
        } else {
            if (isMen) newValue = "Unisex";
            else newValue = "Women";
        }
        value = newValue;
        onchange?.(newValue);
    }
</script>

<div class="gender-selector">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <button class="toggle men" onclick={toggleMen} class:active={isMen}>
        <Mars size={20} strokeWidth={isMen ? 2 : 1.5} />
        {$t.men}
    </button>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <button class="toggle women" onclick={toggleWomen} class:active={isWomen}>
        <Venus size={20} strokeWidth={isWomen ? 2 : 1.5} />
        {$t.women}
    </button>
</div>

<style>
    :root {
        /* --color-men: #0c3e7f;
        --color-women: #820c7e; */

        --color-men: var(--color-accent);
        --color-women: var(--color-accent);
    }
    .gender-selector {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        background: var(--color-card-bg);
        transition: all var(--transition-fast);
    }

    .toggle {
        width: 100%;
        border: 1px solid;
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        transition: all var(--transition-fast);

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .toggle.men {
        color: var(--color-men);
        border-color: var(--color-men);
    }

    .toggle.women {
        color: var(--color-women);
        border-color: var(--color-women);
    }

    .toggle.men.active {
        background-color: var(--color-men);
        color: #fff;
    }

    .toggle.women.active {
        background-color: var(--color-women);
        color: #fff;
    }

    /* .label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-secondary);
        user-select: none;
        transition: all var(--transition-fast);
    }

    .option.active .label {
        color: var(--color-accent);
        font-weight: 600;
    } */

    @media (max-width: 768px) {
        .gender-selector {
            width: 100%;
            justify-content: space-around;
        }
    }
</style>
