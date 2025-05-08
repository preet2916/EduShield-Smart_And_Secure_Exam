import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TabSwitchBlocker from "../security/TabSwitchBlocker";
import RightClickBlocker from "../security/RightClickBlocker";
import ActivityMonitor from "../security/ActivityMonitor";

const QuizScreen = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState([]);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    fetch("/quizquestion.json")
      .then((response) => response.json())
      .then((data) => {
        const questionLimit = parseInt(localStorage.getItem("questionCount"), 10) || data.length;
        const shuffledQuestions = data.sort(() => 0.5 - Math.random()).slice(0, questionLimit);
        
        setQuestions(shuffledQuestions);
        setUserAnswers(new Array(questionLimit).fill(null));
        setTimeSpent(new Array(questionLimit).fill(0));
        setTotalTimeLeft(questionLimit * 60);
        setLoading(false);
  
        // Store shuffled questions in localStorage
        localStorage.setItem("quizQuestions", JSON.stringify(shuffledQuestions));
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
        setLoading(false);
      });
  
    return () => clearInterval(timerRef.current); 
  }, []);
  

  useEffect(() => {
    if (questions.length === 0) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTotalTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleQuizCompletion(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current); 
  }, [questions]);

  const updateTimeSpent = () => {
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const updatedTimeSpent = [...timeSpent];
    updatedTimeSpent[currentQuestionIndex] = timeTaken;
    setTimeSpent(updatedTimeSpent);
  };

  const handleAnswerSelect = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    updateTimeSpent();
    startTimeRef.current = Date.now(); 

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      updateTimeSpent();
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleQuizCompletion = (autoSubmitted = false) => {
    clearInterval(timerRef.current);
    updateTimeSpent(); 

    const finalAnswers = userAnswers.map((answer) => answer !== null ? answer : "Unanswered");

    const finalScore = finalAnswers.reduce((acc, answer, index) => {
      return answer === questions[index]?.answer ? acc + 1 : acc;
    }, 0);

    localStorage.setItem("quizScore", finalScore);
    localStorage.setItem("totalQuestions", questions.length);
    localStorage.setItem("timeSpent", JSON.stringify(timeSpent));
    localStorage.setItem("userAnswers", JSON.stringify(finalAnswers));

    if (autoSubmitted) {
      localStorage.setItem("autoSubmitted", "true");
    }

    navigate("/result");
  };

  if (loading) {
    return <div className="text-center text-white">⏳ Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((totalTimeLeft / (questions.length * 60)) * 100).toFixed(2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <TabSwitchBlocker handleViolation={() => handleQuizCompletion(true)}  />
      <RightClickBlocker handleViolation={() => handleQuizCompletion(true)} />
      <ActivityMonitor handleViolation={() => handleQuizCompletion(true)} />

      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quiz Time ⏳</h2>
          <p className={`text-lg font-semibold ${totalTimeLeft <= 30 ? "text-red-400" : "text-yellow-400"}`}>
            Time Left: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, "0")} min
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden mb-4">
          <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="text-gray-300 text-center mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        <h3 className="text-xl mb-6 text-center">{currentQuestion.question}</h3>

        <div className="grid grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((key) => (
            <button
              key={key}
              className={`p-4 rounded-xl text-white text-lg transition-all duration-200 focus:ring-2 focus:ring-yellow-400 ${
                userAnswers[currentQuestionIndex] === key ? "bg-yellow-500" : "bg-blue-500 hover:bg-blue-600 focus:bg-blue-600"
              }`}
              onClick={() => handleAnswerSelect(key)}
            >
              {currentQuestion[key]}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={handlePreviousQuestion} className="p-3 bg-gray-500 rounded-xl text-lg text-white" disabled={currentQuestionIndex === 0}>
            ⬅ Back
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={() => handleQuizCompletion()} className="p-3 bg-green-500 rounded-xl text-lg text-white">
              Finish Quiz 🎉
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="p-3 bg-green-500 rounded-xl text-lg text-white">
              Next ➡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
