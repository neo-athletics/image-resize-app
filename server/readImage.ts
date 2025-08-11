import sharp from "sharp";

async function getMetadata(imagePath: string) {
  try {
    const metadata = await sharp(imagePath).metadata();
    console.log("Image metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error reading image metadata:", error);
    throw error;
  }
}
export { getMetadata };
