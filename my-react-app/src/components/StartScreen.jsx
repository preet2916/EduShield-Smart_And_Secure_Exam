import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const validQuestionCounts = [10, 20, 30, 40, 50];

const StartScreen = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(10);

  // Load question count from localStorage when the component mounts
  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem("questionCount"), 10);
    if (validQuestionCounts.includes(storedCount)) {
      setQuestionCount(storedCount);
    } else {
      setQuestionCount(10); // Default value if invalid
    }
  }, []);

  const handleQuestionCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setQuestionCount(newCount);
    localStorage.setItem("questionCount", newCount); 
  };

  const handleStart = () => {
    if (!validQuestionCounts.includes(questionCount)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please select a valid number of questions (10, 20, 30, 40, 50).",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Save selected question count in localStorage
    localStorage.setItem("questionCount", questionCount);

    navigate("/user-preview");
  };

  const handleBack = () => {
    navigate("/document-upload");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg text-white w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4">🎯 Online Quiz</h1>
        <p className="text-gray-300 mb-6 text-lg">Test your knowledge and challenge yourself!</p>

        {/* Number of Questions Dropdown */}
        <div className="mb-6 w-full">
          <label className="block text-gray-400 text-sm mb-2">Select Number of Questions</label>
          <div className="relative">
            <select
              value={questionCount}
              onChange={handleQuestionCountChange}
              className="appearance-none w-full p-3 text-center rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {validQuestionCounts.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
          >
            ⬅ Back
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Proceed ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
