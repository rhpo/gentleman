<script lang="ts">
    import { Search } from "@lucide/svelte";
    import { onMount } from "svelte";

    let {
        placeholder = "Rechercher un livre...",
        onSearch = () => {},
        value = $bindable(""),
        searchInput = $bindable(),
    } = $props();

    onMount(() => {
        searchInput.addEventListener("keydown", (e: any) => {
            if (e.keyCode === 13) {
                onSearch(value);
            }
        });
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main onclick={() => searchInput.focus()}>
    <input type="text" {placeholder} bind:this={searchInput} bind:value />

    <button onclick={() => onSearch(value)}>
        <Search />
    </button>
</main>

<style>
    :root {
        --padding-search: 2rem;
        --height-search: 40px;
    }

    :global(html[data-rtl="true"]) main input {
        padding-right: var(--padding-search);
        padding-left: 0;
    }

    main {
        width: 100%;
        display: inline-flex;
        align-items: center;

        background-color: var(--color-card-bg);

        border-radius: var(--radius-sm);
        /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */

        border: 1px solid var(--color-border);
        cursor: text;

        height: 100%;
    }

    main input {
        flex: 1;
        height: 100%;
        width: 100%;
        padding-left: var(--padding-search);
        font-size: 1.2rem;

        background-color: transparent !important;
        border: none !important;
    }

    main input:focus {
        outline: none;
    }

    button {
        background-color: var(--primary);
        color: var(--white);
        border-radius: 50%;
        padding: calc(var(--padding-search) / 2);
        margin: calc(var(--padding-search) / 4);

        display: grid;
        place-items: center;
        cursor: pointer;

        transition: all var(--transition-duration) var(--transition-easing);
    }

    button:hover {
        transform: scale(1.05) rotate(5deg);
    }

    @media screen and (max-width: 600px) {
        :root {
            --padding-search: 1rem;
        }

        main input {
            font-size: 0.875rem;
        }
    }
</style>
