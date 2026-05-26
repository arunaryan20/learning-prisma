import { supportedMimes } from "../Config/fileSystem.js";

export const imageValidator = (size, mime) => {
    if (bytesToMb(size) > 2) {
        return "Image size must be less than 2 MB"
    }
    else if (!supportedMimes.includes(mime)) {
        return "Image must be type of png,jpg,jpeg,svg,webp,gif.. ";
    }
    return null;
}
export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
}