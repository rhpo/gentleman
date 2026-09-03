<script lang="ts">
    import { Search } from "@lucide/svelte";

    let {
        placeholder = "Rechercher...",
        onSearch = (val: string) => {},
        value = $bindable(""),
        searchInput = $bindable(),
    } = $props();

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch(value);
        }
    }

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        onSearch(value);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<form class="search-box" onclick={() => searchInput?.focus()} onsubmit={handleSubmit}>
    <input
        type="text"
        {placeholder}
        bind:this={searchInput}
        bind:value
        onkeydown={handleKeyDown}
    />

    <button type="submit">
        <Search />
    </button>
</form>

<style>
    :root {
        --padding-search: 2rem;
        --height-search: 40px;
    }

    :global(html[data-rtl="true"]) .search-box input {
        padding-right: var(--padding-search);
        padding-left: 0;
    }

    .search-box {
        width: 100%;
        display: inline-flex;
        align-items: center;

        background-color: var(--color-card-bg);

        border-radius: var(--radius-sm);

        border: 1px solid var(--color-border);
        cursor: text;

        height: 100%;
    }

    .search-box input {
        flex: 1;
        height: 100%;
        width: 100%;
        padding-left: var(--padding-search);
        font-size: 1.2rem;

        background-color: transparent !important;
        border: none !important;
    }

    .search-box input:focus {
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

        .search-box input {
            font-size: 0.875rem;
        }
    }
</style>
