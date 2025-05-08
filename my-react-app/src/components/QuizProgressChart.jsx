import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const QuizProgressChart = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userName, setUserName] = useState("User");
  const [timePerQuestion, setTimePerQuestion] = useState([]);
  const [breakdown, setBreakdown] = useState({ correct: 0, incorrect: 0, unanswered: 0 });

  useEffect(() => {
    const storedScore = parseInt(localStorage.getItem("quizScore"), 10) || 0;
    const storedTotal = parseInt(localStorage.getItem("totalQuestions"), 10) || 1;
    const storedUserName = localStorage.getItem("userName") || "User";
    const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    const quizQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    const timeData = JSON.parse(localStorage.getItem("timeSpent")) || [];

    setScore(storedScore);
    setTotalQuestions(storedTotal);
    setUserName(storedUserName);

    let correct = 0, incorrect = 0, unanswered = 0;
    const timeWithStatus = timeData.map((time, index) => {
      const answer = userAnswers[index];
      const correctAnswer = quizQuestions[index]?.answer;

      let status = "unanswered";
      if (answer === null || answer === "Unanswered") {
        unanswered++;
        status = "unanswered";
      } else if (answer === correctAnswer) {
        correct++;
        status = "correct";
      } else {
        incorrect++;
        status = "incorrect";
      }

      return {
        question: `Q${index + 1}`,
        time,
        status,
      };
    });

    setTimePerQuestion(timeWithStatus);
    setBreakdown({ correct, incorrect, unanswered });
  }, []);

  const pieData = [
    { name: "Correct", value: breakdown.correct },
    { name: "Incorrect", value: breakdown.incorrect },
    { name: "Unanswered", value: breakdown.unanswered },
  ];

  const COLORS = {
    correct: "#34D399",
    incorrect: "#EF4444",
    unanswered: "#FBBF24",
  };

  const getBarColor = (status) => COLORS[status] || "#8884d8";

  const handleHomeClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All your quiz data will be deleted, and you'll start fresh!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Start Fresh!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-xl text-white w-full max-w-5xl text-center">

        <h1 className="text-4xl font-extrabold text-yellow-400 mb-6">📊 Quiz Performance</h1>
        <p className="text-xl font-semibold mb-6">
          Total Marks: <span className="text-blue-400">{totalQuestions}</span>
        </p>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3">Correct vs Incorrect vs Unanswered</h3>
            <ResponsiveContainer width={350} height={350}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={120} label>
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name.toLowerCase()]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                Correct
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                Incorrect
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                Unanswered
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3">Time Taken Per Question</h3>
            <ResponsiveContainer width={350} height={350}>
              <BarChart
                data={timePerQuestion}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="question" stroke="#ffffff" tick={{ fill: "#fff" }} />
                <YAxis stroke="#ffffff" tick={{ fill: "#fff" }} label={{ value: "Time (s)", angle: -90, position: "insideLeft", fill: "#fff" }} />
                <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
                <Bar dataKey="time">
                  {timePerQuestion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Bar Chart Legend */}
            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                Correct
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                Incorrect
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                Unanswered
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <button
            onClick={() => navigate("/result")}
            className="px-6 py-3 bg-green-500 rounded-xl hover:bg-green-600 text-white font-semibold transition-all transform hover:scale-105"
          >
            📄 Back to Result
          </button>
          <button
            onClick={() => navigate("/start-screen")}
            className="px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-semibold transition-all transform hover:scale-105"
          >
            🔄 Retry Quiz
          </button>
          <button
            onClick={handleHomeClick}
            className="px-6 py-3 bg-red-500 rounded-xl hover:bg-red-600 text-white font-semibold transition-all transform hover:scale-105"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate("/certificate", { state: { userName, score } })}
            className="px-6 py-3 bg-yellow-500 rounded-xl hover:bg-yellow-600 text-white font-semibold transition-all transform hover:scale-105"
          >
            🏆 Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizProgressChart;
