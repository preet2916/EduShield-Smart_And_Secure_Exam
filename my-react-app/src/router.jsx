import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import DocumentUpload from "./components/DocumentUpload";
import StartScreen from "./components/StartScreen";
import UserPreview from "./components/UserPreview";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import QuizProgressChart from "./components/QuizProgressChart"; 
import CertificateGenerator from "./components/CertificateGenerator"; 

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} /> 
        <Route path="/document-upload" element={<DocumentUpload />} /> 
        <Route path="/start-screen" element={<StartScreen />} /> 
        <Route path="/user-preview" element={<UserPreview />} /> 
        <Route path="/quiz" element={<QuizScreen />} /> 
        <Route path="/result" element={<ResultScreen />} /> 
        <Route path="/quiz-progress" element={<QuizProgressChart />} /> 
        <Route path="/certificate" element={<CertificateGenerator />} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
