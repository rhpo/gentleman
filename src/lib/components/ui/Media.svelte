<script lang="ts">
    import { mediaType } from "$lib/utils/extension";

    interface IProps {
        media: string;
    }

    let { media }: IProps = $props();

    const type = $derived(mediaType(media));
</script>

{#if type === "image"}
    <img src={media} alt="" />
{:else if type === "video"}
    <video src={media} autoplay loop muted playsinline></video>
{/if}

<style>
    img,
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
