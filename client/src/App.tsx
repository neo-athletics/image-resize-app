import "./App.css";
import React, { useState } from "react";
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [format, setFormat] = useState("Pick a format");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    <div className="app-container">
      <div className="hero  min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left ml-5">
            <h1 className="text-5xl font-bold">Resize It</h1>
            <p className="py-6 ">
              Image processing app that resizes and converts images to different
              formats.
            </p>
          </div>
          <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              {error && <div className="alert alert-error">{error}</div>}

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
            </div>
          </div>
        </div>
        {url && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Processed Image</h2>
            <img src={url} alt="Processed" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
