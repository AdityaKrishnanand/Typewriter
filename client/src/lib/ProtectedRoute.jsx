import { Navigate } from "react-router-dom";
import { useSnackbar } from "../components/SnackbarContext";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const { showSnackbar } = useSnackbar();
  console.log("token in pr,", token);
  if (!token) {
    showSnackbar("Token not found", "error");
    return <Navigate to="/login" replace />;
  }

  return children;
}
