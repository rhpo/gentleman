export function mediaType(media: string): 'image' | 'video' {

    const extensions = {
        video: [".mp4", ".webm"],
        image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    }

    const extension = media.split(".").pop();

    if (extensions.video.includes(`.${extension}`)) {
        return "video";
    }

    return "image";

}
