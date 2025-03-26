import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPredictions(response.data.predictions);
    } catch (err) {
      setError("Error uploading file. Make sure Flask API is running.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">DDoS Detection System</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {predictions.length > 0 && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-lg font-bold">Predictions:</h2>
            <ul>
              {predictions.map((pred, index) => (
                <li key={index} className="mt-1">{pred}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
