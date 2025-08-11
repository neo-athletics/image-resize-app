import sharp, { FormatEnum } from "sharp";

async function processImage(
  imagePath: string,
  options: { width: number; height: number; format: string }
) {
  const { width, height, format } = options;

  // Extract filename from the path
  // Example: "/some/directory/images/photo.png" -> "photo.png"
  const filename = imagePath.replace(/^.*[\\/]/, "");
  // Define settings for different formats
  interface settingsType {
    jpeg: { quality: number; progressive: boolean; mozjpeg: boolean };
    png: { compressionLevel: number; adaptiveFiltering: boolean };
    webp: { quality: number; effort: number };
    avif: { quality: number; effort: number };
  }
  const settings: settingsType = {
    jpeg: { quality: 85, progressive: true, mozjpeg: true },
    png: { compressionLevel: 6, adaptiveFiltering: true },
    webp: { quality: 85, effort: 4 },
    avif: { quality: 50, effort: 4 },
  };

  const allowedFormats: (keyof FormatEnum)[] = [
    "jpeg",
    "png",
    "webp",
    "avif",
    "tiff",
    "gif",
    "heif",
  ];

  try {
    let image = await sharp(imagePath);
    if (width) {
      if (width || height) {
        image = image.resize(width || null, height || null);
      }
    }

    if (allowedFormats.includes(format as keyof FormatEnum)) {
      image.toFormat(
        format as keyof FormatEnum,
        settings[format as keyof settingsType]
      );
    } else {
      throw new Error("Unsupported format");
    }

    image.toFile(`processed-${filename}`);
    console.log("Image resized successfully");
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
export { processImage };
