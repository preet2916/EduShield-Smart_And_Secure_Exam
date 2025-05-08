import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultScreen = () => {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState({
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQuestions: 0,
    autoSubmitted: false,
  });

  useEffect(() => {
    const storedScore = parseInt(localStorage.getItem("quizScore"), 10) || 0;
    const storedTotal = parseInt(localStorage.getItem("totalQuestions"), 10) || 0;
    const storedAutoSubmitted = localStorage.getItem("autoSubmitted") === "true";
    const storedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    const storedQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || []; 

    console.log("LocalStorage Data (Before Processing):", {
      quizScore: storedScore,
      totalQuestions: storedTotal,
      autoSubmitted: storedAutoSubmitted,
      userAnswers: storedAnswers,
      quizQuestions: storedQuestions,
    });

    let correct = 0, incorrect = 0, unanswered = 0;

    storedAnswers.forEach((answer, index) => {
      if (answer === null || answer === "Unanswered") {
        unanswered++;
      } else if (storedQuestions[index] && answer === storedQuestions[index].answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setResultData({
      score: correct,
      totalQuestions: storedTotal,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unansweredQuestions: unanswered,
      autoSubmitted: storedAutoSubmitted,
    });

    console.log("Processed Result Data:", {
      correct,
      incorrect,
      unanswered,
      finalScore: correct,
    });

  }, []);

  const percentage = resultData.totalQuestions > 0 
    ? (resultData.score / resultData.totalQuestions) * 100 
    : 0;

  const getMessage = () => {
    if (percentage === 100) return "🌟 Perfect Score! Amazing!";
    if (percentage >= 80) return "🎯 Excellent! Keep it up!";
    if (percentage >= 50) return "👍 Good Job! You can do even better!";
    return "💡 Keep Practicing! You'll improve!";
  };

  const handleClearData = () => {
    localStorage.removeItem("quizScore");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("quizQuestions"); 
    localStorage.removeItem("autoSubmitted");
    navigate("/start-screen");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-white w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4">🎉 Quiz Completed!</h1>

        {resultData.autoSubmitted && (
          <p className="text-red-400 text-lg font-bold bg-red-800 p-2 rounded-lg mb-4">
            ⚠ Auto-Submitted Due to Rule Violations!
          </p>
        )}

        {/* Score Display */}
        <p className="text-2xl font-semibold mb-2">
          Your Score: <span className="text-green-400">{resultData.score}</span> / {resultData.totalQuestions}
        </p>

        {/* Score Breakdown */}
        <div className="text-lg text-gray-300 mb-4">
          ✅ Correct: <span className="text-green-400">{resultData.correctAnswers}</span> | ❌ Incorrect:{" "}
          <span className="text-red-400">{resultData.incorrectAnswers}</span> | ⏳ Unanswered:{" "}
          <span className="text-yellow-400">{resultData.unansweredQuestions}</span>
        </div>

        {/* Feedback Message */}
        <p className="text-lg font-semibold text-gray-300 mb-6">{getMessage()}</p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/start-screen")}
            className="p-3 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-semibold transition-all"
          >
            🔄 Retry Quiz
          </button>
          <button
            onClick={() => navigate("/quiz-progress")}
            className="p-3 bg-purple-500 rounded-xl hover:bg-purple-600 text-white font-semibold transition-all"
          >
            📊 View Analytics
          </button>
        </div>

        {/* Clear Data Button */}
        <button
          onClick={handleClearData}
          className="mt-6 p-3 bg-red-500 rounded-xl hover:bg-red-600 text-white font-semibold transition-all"
        >
          ❌ Clear Quiz Data
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
