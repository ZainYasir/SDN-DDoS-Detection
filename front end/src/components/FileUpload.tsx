import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import type { UploadState } from "../types";

const API_URL = "http://localhost:5000/predict";

export function FileUpload({ onUploadComplete }: { onUploadComplete: (data: UploadState, file?: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      onUploadComplete({ status: "idle" }, files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      onUploadComplete({ status: "idle" }, e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadComplete({ status: "error", message: "Please select a file first" });
      return;
    }

    if (!selectedFile.name.endsWith(".csv")) {
      onUploadComplete({ status: "error", message: "Please upload a CSV file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    onUploadComplete({ status: "uploading" });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadComplete({ status: "success", data: response.data });
    } catch (error) {
      console.error("File upload failed:", error);
      onUploadComplete({ status: "error", message: "Failed to process file. Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`neumorphic-inset rounded-xl p-6 transition-all duration-300 ${dragActive ? "bg-[#e0e3ea]" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".csv" onChange={handleChange} />

        <div className="flex flex-col items-center justify-center text-center py-4">
          <Upload className="h-12 w-12 text-[#7FE7D9] mb-4" />
          <p className="text-lg font-medium text-[#2A2F35] mb-2">File Upload</p>
          <p className="text-sm text-gray-500">Drag and drop your CSV file here</p>
          {selectedFile && <p className="text-sm text-green-600 mt-2">Selected: {selectedFile.name}</p>}
        </div>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full neumorphic-button text-white font-medium py-3 px-6 rounded-xl"
      >
        Select File
      </button>

      <button
        onClick={handleUpload}
        className="w-full neumorphic-button text-white font-medium py-3 px-6 rounded-xl mt-4"
        disabled={!selectedFile}
      >
        Detect
      </button>
    </div>
  );
}
