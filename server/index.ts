import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { processImage } from "./processImage";
import fs from "fs";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/api/images", (req, res) => {
  // Validate filename query parameter
  const filename = req.query.filename as string;
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

  console.log(imagePath);
  // processImage(imagePath+filename, { width: 200, height: 200, format: "jpeg" });
  res.json({ message: "API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
