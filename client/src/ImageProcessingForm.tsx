import React, { useState } from "react";

export default function ImageProcessingForm({
  setError,
  setUrl,
}: {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [format, setFormat] = useState("Pick a format");
  const allowedExtensions = [
    "jpeg",
    "png",
    "webp",
    "avif",
    "tiff",
    "gif",
    "heif",
  ];

  // Usage in input handler
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      e.target.value = "";
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      setError("Invalid file format. Please upload JPEG, PNG, WebP, or AVIF.");
      e.target.value = "";
      return;
    }

    setError(null);
    setFile(file);
    console.log("File accepted:", file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Please select a file");
    if (!width && !height && format === "Pick a format") {
      setError("Please provide at least one dimension or format");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    if (width) formData.append("width", width);
    if (height) formData.append("height", height);

    //have a default format if not selected
    if (format === "Pick a format") {
      let ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(ext)) {
        ext = "jpeg"; // default format
      }
      formData.append("format", ext);
    }

    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    console.log(blob, res);
    const url = URL.createObjectURL(blob);
    setUrl(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <label className="label">Upload Image</label>
        <input
          required
          type="file"
          className="file-input file-input-primary image"
          onChange={(e) => handleFileChange(e)}
        />
        <label className="label mt-2">Width</label>
        <input
          type="text"
          placeholder="width"
          className="input input-primary"
          onChange={(e) => setWidth(e.target.value)}
          value={width}
        />
        <label className="label mt-2">Height</label>
        <input
          type="text"
          placeholder="height"
          className="input input-primary"
          onChange={(e) => setHeight(e.target.value)}
          value={height}
        />
        <label className="label mt-2">Format</label>

        <select
          value={format}
          className="select select-primary"
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value={"Pick a format"} disabled={true}>
            Pick a format
          </option>
          <option value={"jpeg"}>jpeg</option>
          <option value={"png"}>png</option>
          <option value={"webp"}>webp</option>
        </select>
        <button type="submit" className="btn btn-success mt-4">
          Format It!
        </button>
      </fieldset>
    </form>
  );
}
