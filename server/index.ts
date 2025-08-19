import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { processImage } from "./processImage";
import fs, { read } from "fs";
import multer from "multer";
import sharp from "sharp";
import { getMetadata } from "./readImage";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// temp storage folder for Multer
const upload = multer({ dest: path.join(__dirname, "uploads/") });
const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"];

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Serve static files from the client build directory
app.get("/api/images", async (req, res) => {
  // Validate filename query parameter
  const { filename, width, height, format } = req.query as {
    filename: string;
    width?: string;
    height?: string;
    format?: string | undefined | null;
  };

  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).send("Invalid filename");
  }
  if (!filename) {
    return res.status(400).send("Filename is required");
  }

  const safeDir = path.join(__dirname, "../client/public/images");

  const imagePath = path.join(
    __dirname,
    "../client/public/images",
    filename as string
  );

  // Try to find the file with one of the extensions
  let fullFilePath = null;

  for (const ext of allowedExtensions) {
    const testPath = path.join(safeDir, filename + ext);
    if (fs.existsSync(testPath)) {
      fullFilePath = testPath;
      console.log("File exists:", imagePath);
      break;
    }
  }

  if (!fullFilePath) {
    return res.status(404).send("File not found");
  }

  const widthNum = Number(width);
  const heightNum = Number(height);

  // if (Number.isNaN(widthNum) || Number.isNaN(heightNum)) {
  //   return res.status(400).send("Width and height must be valid numbers.");
  // }
  console.log(
    "Processing image:",
    fullFilePath,
    filename,
    widthNum,
    heightNum,
    format
  );

  let ext = format ? format : path.parse(fullFilePath).ext.slice(1);

  const outputPath = processImage(fullFilePath, filename, {
    widthNum,
    heightNum,
    format: ext,
  });

  if (!outputPath) {
    return res.status(500).send("Error processing image");
  }
  // Send the processed image file
  res.sendFile(await outputPath);
});

//route to handle image upload and processing

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { width, height, format } = req.body; // user inputs

    // // Start sharp pipeline
    // let pipeline = sharp(req.file.path);

    // // Conditionally apply resize
    // if (width || height) {
    //   pipeline = pipeline.resize(
    //     width ? parseInt(width, 10) : undefined,
    //     height ? parseInt(height, 10) : undefined
    //   );
    // }

    // const buffer = await pipeline.toBuffer(); // triggers processing
    // const updatedMeta = await sharp(buffer).metadata();

    // const processedPath = path.join(
    //   __dirname,
    //   "cache",
    //   `${path.parse(req.file.originalname).name}_${
    //     width || updatedMeta.width
    //   }x${height || updatedMeta.height}.${
    //     allowedExtensions.includes(`.${format}`) || "jpeg"
    //   }`
    // );

    // // Conditionally apply format
    // if (format && allowedExtensions.includes(`.${format}`)) {
    //   pipeline = pipeline.toFormat(format as keyof sharp.FormatEnum);
    // } else {
    //   pipeline = pipeline.toFormat("jpeg"); // default
    // }

    // // Save processed file
    // await pipeline.toFile(processedPath);
    const filename = path.parse(req.file.originalname).name;
    const processedPath = await processImage(req.file.path, filename, {
      widthNum: parseInt(width, 10) || undefined,
      heightNum: parseInt(height, 10) || undefined,
      format: format || "jpeg", // default to jpeg if no format provided
    });

    // Clean up temp upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Temp file cleanup failed:", err);
    });

    // Respond with file
    res.sendFile(processedPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
