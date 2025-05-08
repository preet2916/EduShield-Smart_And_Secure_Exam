import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  // Load stored files from localStorage
  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    setDocuments(storedDocuments);
  }, []);

  // Convert file to Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ name: file.name, base64: reader.result });
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection and store in localStorage
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= 2 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File!",
        text: "Only JPG, PNG, or PDF files under 2MB are allowed.",
      });
      return;
    }

    const base64Files = await Promise.all(validFiles.map(toBase64));
    const updatedDocuments = [...documents, ...base64Files];

    setDocuments(updatedDocuments);
    localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocuments));
  };

  // Remove file
  const removeFile = (index) => {
    const updatedFiles = [...documents];
    updatedFiles.splice(index, 1);
    setDocuments(updatedFiles);
    localStorage.setItem("uploadedDocuments", JSON.stringify(updatedFiles));
  };

  // Proceed to next screen
  const handleProceed = () => {
    Swal.fire({
      icon: "success",
      title: "Documents Uploaded!",
      text: "You can now proceed to the start screen.",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Navigating to Start Screen...");
        navigate("/start-screen"); // ✅ Ensure this matches AppRouter
      }
    });
  };

  // Navigate back
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">📄 Upload Your Documents</h2>

        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />

        {/* Show uploaded documents */}
        <div className="mt-6 space-y-3">
          {documents.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <span className="text-sm text-gray-300">{file.name}</span>
              <button className="text-red-400 hover:text-red-500" onClick={() => removeFile(index)}>
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold">
            ⬅ Back
          </button>
          <button
            onClick={handleProceed}
            disabled={documents.length === 0}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
              documents.length > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
