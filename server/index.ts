import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (_req, res) => {
  res.json({ message: "Server is running!" });
});
app.get("/api/images", (_req, res) => {
  const { filename } = _req.query;
  if (!filename) {
    return res.status(400).send("Filename is required");
  }

  res.json({ message: "API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
