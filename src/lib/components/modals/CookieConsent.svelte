<!-- Cookie Consent Modal -->
<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "../ui/Modal.svelte";
    import Button from "../ui/Button.svelte";
    import { t } from "$lib/i18n/translations";

    let showConsent = $state(false);

    onMount(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent && true) {
            showConsent = true;
        }
    });

    function handleAccept(): void {
        localStorage.setItem("cookieConsent", "accepted");
        showConsent = false;
    }

    function handleDecline(): void {
        localStorage.setItem("cookieConsent", "declined");
        showConsent = false;
    }
</script>

<Modal isOpen={showConsent} onClose={handleDecline}>
    <div class="cookie-consent">
        <p>{$t.cookieMessage}</p>
        <div class="actions">
            <Button type="primary" onclick={handleAccept}>{$t.accept}</Button>
            <Button type="secondary" onclick={handleDecline}
                >{$t.decline}</Button
            >
        </div>
    </div>
</Modal>

<style>
    .cookie-consent {
        text-align: center;
        padding: var(--spacing-md);
    }

    .cookie-consent p {
        margin-bottom: var(--spacing-md);
        font-size: 1rem;
    }

    .actions {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: center;
        flex-wrap: wrap;
    }
</style>
