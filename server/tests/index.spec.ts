import { processImage } from "../processImage";
import * as path from "path";
import supertest from "supertest";
import { app } from "../../server";
import { getMetadata } from "../readImage";

const request = supertest(app);

describe("Index Spec", () => {
  it("should have a valid structure", () => {
    expect(true).toBeTrue();
  });
  it("should process an image correctly", async () => {
    const imagePath = path.resolve(
      __dirname,
      "../../client/public/images/sammy.png"
    );
    const fileName = "sammy";
    const options = {
      widthNum: 800,
      heightNum: 600,
      format: "jpeg",
    };

    const outputPath = await processImage(imagePath, fileName, options);
    expect(outputPath).toBeDefined();
    expect(outputPath).toContain(fileName); // Check if the output path contains the filename
  });
  it("should handle invalid image paths gracefully", async () => {
    const invalidImagePath = path.resolve(
      __dirname,
      "../../client/public/images/nonexistent.png"
    );
    const fileName = "nonexistent";
    const options = {
      widthNum: 800,
      heightNum: 600,
      format: "jpeg",
    };

    await expectAsync(
      processImage(invalidImagePath, fileName, options)
    ).toBeRejectedWithError("Input file is missing or of an unsupported type");
  });
  it("should handle unsupported formats gracefully", async () => {
    const imagePath = path.resolve(
      __dirname,
      "../../client/public/images/sammy.png"
    );
    const fileName = "sammy";
    const options = {
      widthNum: 800,
      heightNum: 600,
      format: "unsupportedFormat", // Intentionally unsupported format
    };

    await expectAsync(
      processImage(imagePath, fileName, options)
    ).toBeRejectedWithError("Unsupported format");
  });
  it("should return 400 for invalid filename", async () => {
    const response = await request.get(
      "/api/images?filename=invalid/../name&width=200&height=200"
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe("Invalid filename");
  });
  it("should return 404 for non-existent file", async () => {
    const response = await request.get(
      "/api/images?filename=nonexistent&width=200&height=200"
    );
    expect(response.status).toBe(404);
    expect(response.text).toBe("File not found");
  });
  it("should return 400 if filename is missing", async () => {
    const response = await request.post("/upload").send({
      width: "200",
      height: "200",
      format: "jpeg",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No file uploaded");
  });
  it("should upload and process an image successfully", async () => {
    const response = await request
      .post("/upload")
      .attach(
        "image",
        path.resolve(__dirname, "../../client/public/images/sammy.png")
      )
      .field("width", "200")
      .field("height", "200")
      .field("format", "jpeg");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/jpeg");
  });
  it("should return image metadata", async () => {
    const imagePath = path.resolve(
      __dirname,
      "../../client/public/images/sammy.png"
    );
    const metadata = await getMetadata(imagePath);
    expect(metadata).toBeDefined();
    expect(metadata.width).toBeGreaterThan(0);
    expect(metadata.height).toBeGreaterThan(0);
  });
});
