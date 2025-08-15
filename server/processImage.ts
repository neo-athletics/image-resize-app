import path from "path";
import sharp, { FormatEnum } from "sharp";
import { fileURLToPath } from "url";
import fs from "fs";

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, "cache");
// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}
async function processImage(
  imagePath: string,
  options: { widthNum?: number; heightNum?: number; format?: string }
) {
  const { widthNum: width, heightNum: height, format } = options;

  // Extract filename from the path
  // Example: "/some/directory/images/photo.png" -> "photo.png"
  const filename = path.parse(imagePath).name;
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

    if (width || height) {
      image = image.resize(width || null, height || null);
    }

    // if image format is applied change the extension to the new format
    if (allowedFormats.includes(format as keyof FormatEnum)) {
      image.toFormat(
        format as keyof FormatEnum,
        settings[format as keyof settingsType]
      );
      console.log(`Image format set to: ${format}`);
    } else {
      throw new Error("Unsupported format");
    }

    const cacheFileName = `${filename}_${width}x${height}.${format}`;
    const cacheFilePath = path.join(CACHE_DIR, cacheFileName);

    // Serve from cache if it exists
    if (fs.existsSync(cacheFilePath)) {
      console.log("Serving from cache:", cacheFileName);
      return cacheFilePath;
    }
    // Save the processed image to client/public/images/processed
    // const outputPath = path.join(
    //   __dirname,
    //   "../client/public/images/processed",
    //   `processed-${filename}.` + format
    // );
    await image.toFile(cacheFilePath);
    console.log(`Image resized ${width} ${height} successfully`);
    return cacheFilePath;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
export { processImage };
