import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserPreview = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [questionCount, setQuestionCount] = useState(5); 
  const [countdown, setCountdown] = useState(15); 
  const [isProceedDisabled, setIsProceedDisabled] = useState(true); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails")) || {};
    const storedDocuments = JSON.parse(localStorage.getItem("uploadedDocuments")) || [];
    const storedQuestionCount = localStorage.getItem("questionCount") || 5;

    setUserDetails(storedUser);
    setUploadedDocuments(storedDocuments);
    setQuestionCount(parseInt(storedQuestionCount, 10));

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsProceedDisabled(false); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Proceed to Quiz
  const handleProceed = () => {
    Swal.fire({
      icon: "success",
      title: "All Set!",
      text: "Your details have been confirmed. Proceeding to the quiz.",
      confirmButtonText: "Start Quiz",
    }).then(() => {
      navigate("/quiz");
    });
  };

  const handleBack = () => {
    navigate("/start-screen");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-6">👤 User Preview</h2>

        {/* User Information */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <p><strong>Name:</strong> {userDetails.name || "N/A"}</p>
          <p><strong>Email:</strong> {userDetails.email || "N/A"}</p>
          <p><strong>Phone:</strong> {userDetails.mobile || "N/A"}</p>
        </div>

        {/* Selected Number of Questions */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <p><strong>📌 Selected Number of Questions:</strong> {questionCount}</p>
        </div>

        {/* Uploaded Documents */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">📄 Uploaded Documents:</h3>
          {uploadedDocuments.length > 0 ? (
            uploadedDocuments.map((file, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg mb-2 flex items-center">
                {file.base64.startsWith("data:image") ? (
                  <img src={file.base64} alt={file.name} className="w-16 h-16 object-cover rounded-lg mr-3" />
                ) : (
                  <span className="text-gray-300">{file.name}</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No documents uploaded.</p>
          )}
        </div>

        {/* Countdown Timer */}
        <div className="bg-gray-700 p-4 rounded-lg text-center mb-6">
          <p className="text-lg font-semibold">⏳ Please wait: <span className="text-blue-400">{countdown}s</span></p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold">
            ⬅ Back
          </button>
          <button
            onClick={handleProceed}
            disabled={isProceedDisabled}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
              isProceedDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isProceedDisabled ? `Wait` : "Proceed ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
