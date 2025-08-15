import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="hero  min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Resize It</h1>
            <p className="py-6">
              Image processing app that resizes and converts images to different
              formats.
            </p>
          </div>
          <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Upload Image</label>
                <input type="file" className="file-input file-input-primary" />
                <label className="label">width</label>
                <input
                  type="text"
                  placeholder="width"
                  className="input input-primary"
                />
                <label className="label">height</label>
                <input
                  type="text"
                  placeholder="height"
                  className="input input-primary"
                />
                <select
                  defaultValue="Pick a format"
                  className="select select-primary"
                >
                  <option disabled={true}>Pick a format</option>
                  <option>jpeg</option>
                  <option>png</option>
                  <option>webp</option>
                </select>
                <button className="btn btn-success">Success</button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
