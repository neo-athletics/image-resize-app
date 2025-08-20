import { processImage } from "../processImage";
import * as path from "path";

describe("Index Spec", () => {
  it("should have a valid structure", () => {
    expect(true).toBeTrue(); // Placeholder for actual test logic
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
});
