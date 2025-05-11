import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import TypingPage from "./pages/TypingPage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import ProtectedRoute from "./lib/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/typing" element={<TypingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
