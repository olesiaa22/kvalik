import { useState } from "react";
import { FileCard, FileUpload } from "./components";
import { handleSTL } from "./utils/handleStl";
import { Scene } from "./components/Scene/Scene";
import { gCodeGenerator, sliceVertices } from "./utils";
import { fileService } from "./services/file.service";

function App() {
  const [file, setFile] = useState(null);
  const [stlData, setStlData] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setFile(file);
    const result = await handleSTL(file);
    setStlData(result);
  };

  const removeFile = () => {
    setStlData(null);
    setFile(null);
  };

  const handleDownload = () => {
    setLoading(true);
    try {
      const slices = sliceVertices(stlData.vertices);

      const gCode = gCodeGenerator(slices);

      fileService.download(gCode);
    } catch (error) {
      console.error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main id="app" className="grid grid-cols-[400px_1fr] w-screen h-screen">
        <aside className="border border-gray-700 border-r border-t-0 border-b-0 border-l-0 p-4 flex flex-col gap-4">
          {file ? (
            <>
              <FileCard file={file} onRemove={removeFile} />
              <button
                className="border-gray-700 bg-green-200 hover:bg-green-300 disabled:bg-gray-500 p-2 rounded-md cursor-pointer"
                onClick={() => handleDownload()}
                disabled={loading}
              >
                Export gcode
              </button>
            </>
          ) : (
            <FileUpload onUpload={handleFileUpload} />
          )}
        </aside>
        <section className="grid grid-rows-[532px_1fr]">
          <article className="p-4">
            {stlData && <Scene vertices={stlData.vertices} />}
          </article>
          <article id="panel" className="border-t border-gray-700"></article>
        </section>
      </main>
    </>
  );
}

export default App;
