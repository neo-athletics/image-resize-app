import path from "path";
import sharp, { FormatEnum } from "sharp";
import { fileURLToPath } from "url";
import fs from "fs";
import { getMetadata } from "./readImage";

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
  interface SettingsType {
    jpeg: { quality: number; progressive: boolean; mozjpeg: boolean };
    png: { compressionLevel: number; adaptiveFiltering: boolean };
    webp: { quality: number; effort: number };
    avif: { quality: number; effort: number };
    tiff: {
      quality: number;
      compression?: "none" | "lzw" | "jpeg" | "deflate";
      progressive?: boolean;
    };
    gif: {}; // GIF doesn’t have encoding options in sharp, so can be empty
    heif: { quality: number; lossless?: boolean };
  }

  const settings: SettingsType = {
    jpeg: { quality: 85, progressive: true, mozjpeg: true },
    png: { compressionLevel: 6, adaptiveFiltering: true },
    webp: { quality: 85, effort: 4 },
    avif: { quality: 50, effort: 4 },
    tiff: { quality: 85, compression: "lzw", progressive: false },
    gif: {}, // no options needed
    heif: { quality: 85, lossless: false },
  };

  const allowedFormats: (keyof SettingsType)[] = [
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
    let metadata = getMetadata(imagePath);
    if (width || height) {
      image = image.resize(width || null, height || null);
    }

    // if image format is applied change the extension to the new format
    if (allowedFormats.includes(format as keyof SettingsType)) {
      image.toFormat(
        format as keyof SettingsType,
        settings[format as keyof SettingsType]
      );
      console.log(`Image format set to: ${format}`);
    } else {
      throw new Error("Unsupported format");
    }

    const cacheFileName = `${filename}_${width || (await metadata).width}x${
      height || (await metadata).height
    }.${format}`;
    const cacheFilePath = path.join(CACHE_DIR, cacheFileName);

    // Serve from cache if it exists
    if (fs.existsSync(cacheFilePath)) {
      console.log("Serving from cache:", cacheFileName);
      return cacheFilePath;
    }

    await image.toFile(cacheFilePath);
    console.log(`Image resized ${width} ${height} successfully`);
    return cacheFilePath;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
export { processImage };
