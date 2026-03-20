import { useRef, useState } from "react";

const FileUpload = ({ onUpload }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleUpload = (files) => {
    const file = files[0];
    if (!file) return;

    console.log("Selected file:", file);

    onUpload?.(file);
  };

  const handleChange = (e) => {
    handleUpload(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
      >
        <p className="text-gray-500 text-sm text-center px-4">
          Drag & drop file here <br />
          or click to upload
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        accept=".stl"
      />
    </div>
  );
};

export { FileUpload };
