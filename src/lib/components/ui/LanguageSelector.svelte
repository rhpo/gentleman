<script lang="ts">
    import { slide } from "svelte/transition";
    import { onMount, tick } from "svelte";
    import IconButton from "../ui/IconButton.svelte";
    import { languageName, languageToEmoji } from "$lib/utils/international";
    import { languages, type Language } from "$lib/i18n";

    interface IProps {
        language: Language;
    }

    let { language = $bindable() }: IProps = $props();

    let open = $state(false);

    let container: HTMLDivElement;
    let dropdown: HTMLDivElement | null = $state(null);

    // "left" | "right"
    let align = $state<"left" | "right">("right");

    function toggle() {
        open = !open;
        if (open) position();
    }

    function selectLanguage(lang: Language) {
        language = lang;
        open = false;
    }

    async function position() {
        await tick(); // wait for dropdown to mount

        if (!container || !dropdown) return;

        const triggerRect = container.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        if (triggerRect.right - dropdownRect.width < 8) {
            align = "left";
        } else {
            align = "right";
        }
    }

    function onClickOutside(e: MouseEvent) {
        if (container && !container.contains(e.target as Node)) {
            open = false;
        }
    }

    onMount(() => {
        window.addEventListener("click", onClickOutside);
        return () => window.removeEventListener("click", onClickOutside);
    });
</script>

<div class="language-selector" bind:this={container}>
    <!-- Trigger -->
    <IconButton onClick={toggle} aria-label="Select language">
        <span class="flag">{languageToEmoji(language)}</span>
    </IconButton>

    <!-- Dropdown -->
    {#if open}
        <div
            class="dropdown"
            bind:this={dropdown}
            data-align={align}
            transition:slide={{ axis: "y", duration: 180 }}
        >
            {#each languages as lang}
                <button
                    class:selected={lang === language}
                    onclick={() => selectLanguage(lang)}
                >
                    <span>{languageToEmoji(lang)}</span>
                    <span class="code">{languageName(lang)}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .language-selector {
        position: relative;
    }

    .flag {
        font-size: 1.2rem;
        line-height: 1;
    }

    .dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        background: var(--surface, white);
        backdrop-filter: blur(12px);
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        padding: 0.25rem;
        min-width: 120px;
        z-index: 100;

        direction: ltr;
    }

    :global([data-theme="dark"]) .dropdown {
        background: rgba(20, 20, 20, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    :global([data-theme="dark"]) .dropdown * {
        color: white !important;
    }

    .dropdown[data-align="right"] {
        right: 0;
        left: auto;
    }

    .dropdown[data-align="left"] {
        left: 0;
        right: auto;
    }

    :global([data-theme="dark"]) .dropdown {
        background: rgba(20, 20, 20, 0.9);
    }

    .dropdown button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: background 0.15s ease;
    }

    .dropdown button:hover {
        background: rgba(0, 0, 0, 0.06);
    }

    :global([data-theme="dark"]) .dropdown button:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .dropdown button.selected {
        font-weight: 600;
        background: rgba(0, 0, 0, 0.08);
    }

    :global([data-theme="dark"]) .dropdown button.selected {
        background: rgba(255, 255, 255, 0.12);
    }

    .code {
        opacity: 0.6;
        font-size: 0.75rem;
    }
</style>
