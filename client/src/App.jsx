import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import TypingPage from "./pages/TypingPage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import ProtectedRoute from "./lib/ProtectedRoute";
import "rsuite/dist/rsuite.min.css";
import { SnackbarProvider } from "./components/SnackbarContext";
import { LoaderProvider } from "./components/LoaderContext";

export default function App() {
  return (
    <SnackbarProvider>
      <LoaderProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/typing" replace />} />
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
      </LoaderProvider>
    </SnackbarProvider>
  );
}
