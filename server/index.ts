import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { processImage } from "./processImage";
import fs from "fs";
import multer from "multer";

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
    res.status(200).sendFile(processedPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
export { app };
