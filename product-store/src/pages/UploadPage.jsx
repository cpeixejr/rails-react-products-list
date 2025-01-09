import React, { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import "./UploadPage.css";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSuccess(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setSuccess(false);

      await axios.post("http://localhost:3000/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Upload a CSV file</h1>

      <form className="upload-form" onSubmit={handleUpload}>
        <div className="file-input-container">
          <label className="file-input-label">Select a CSV file</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-button">
            {file ? "Change file" : "Select file"}
          </label>
          {file && (
            <div className="selected-file">
              Selected file: {file.name}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={loading || !file}
        >
          {loading ? "Sending..." : "Upload file"}
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <Oval
            height={50}
            width={50}
            color="#63b3ed"
            secondaryColor="#4a5568"
            ariaLabel="loading"
          />
          <p>Upload in progress...</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>The file was uploaded successfully</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
