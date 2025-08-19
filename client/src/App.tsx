import "./App.css";
import { useState } from "react";
import ImageProcessingForm from "./ImageProcessingForm";
function App() {
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

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
              <ImageProcessingForm setError={setError} setUrl={setUrl} />
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
