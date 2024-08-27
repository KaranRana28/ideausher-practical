const IMAGE_UPLOAD = Object.freeze({
    IMAGE_FILE_SIZE: 5, // 5 MB
    IMAGE_EXT_ARRAY: ['.jpg', '.jpeg', '.png'],
});

const VIDEO_UPLOAD = Object.freeze({
    VIDEO_FILE_SIZE: 75, // 50 MB
    VIDEO_EXT_ARRAY: ['.webp', '.mp4'],
});

module.exports = {
    IMAGE_UPLOAD: IMAGE_UPLOAD,
    VIDEO_UPLOAD: VIDEO_UPLOAD
}