<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        title: string;
        description?: string;
        children: Snippet;
        class?: string;
    }

    let {
        title,
        description,
        children,
        class: className = "",
    }: Props = $props();
</script>

<section class="hero-section section {className}">
    <div class="container">
        <h2 class="section-title text-center">{title}</h2>
        {#if description}
            <p class="section-description text-center">
                {description}
            </p>
        {/if}
        <div class="section-content">
            {@render children()}
        </div>
    </div>
</section>

<style>
    .hero-section {
        padding: var(--spacing-xl) 0;
        overflow: hidden;
    }

    .section-title {
        margin-bottom: var(--spacing-sm) !important;
        font-size: clamp(2rem, 5vw, 3rem);
        letter-spacing: 0.2em;
    }

    .section-description {
        margin-bottom: var(--spacing-lg) !important;
        color: var(--color-text-secondary);
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        font-size: 1.1rem;
    }

    .section-content {
        width: 100%;
    }

    @media (max-width: 768px) {
        .section-title {
            font-size: 2rem;
        }

        .section-description {
            font-size: 1rem;
            margin-bottom: var(--spacing-md) !important;
        }
    }
</style>
