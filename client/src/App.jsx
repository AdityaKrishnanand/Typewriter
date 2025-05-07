import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import TypingPage from "./pages/TypingPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/typing" element={<TypingPage />} />
      </Routes>
    </Router>
  );
}
