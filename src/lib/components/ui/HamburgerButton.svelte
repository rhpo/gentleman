<script lang="ts">
    interface IProps {
        open?: boolean;
    }

    let { open = $bindable(false) }: IProps = $props();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button onclick={() => (open = !open)} class:open>
    <span></span>
    <span></span>
</button>

<style>
    button {
        position: relative;
        width: 16px;
        height: 8px;

        padding: 1rem 1.5rem;
    }

    button span {
        position: absolute;
        left: 0;
        width: 16px;
        height: 2px;
        background: var(--color-accent);
        border-radius: 2px;
        transition:
            transform var(--transition-fast),
            top var(--transition-fast);
    }

    /* CLOSED state */
    button span:first-child {
        top: calc(40%);
        left: calc(50% - 8px);
    }

    button span:last-child {
        top: calc(60%);
        left: calc(50% - 8px);
    }

    /* OPEN state */
    button.open span:first-child {
        top: 50%;
        transform: rotate(45deg);
    }

    button.open span:last-child {
        top: 50%;
        transform: rotate(-45deg);
    }
</style>
