import { useState, useRef, useEffect } from "react";
import anime from "animejs";

import { register, login } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../components/SnackbarContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const cardRef = useRef(null);

  useEffect(() => {
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      duration: 1000,
      easing: "easeInOutQuad",
    });
  }, []);

  useEffect(() => {
    anime({
      targets: ".auth-title",
      opacity: [0, 1],
      translateX: [-10, 0],
      duration: 600,
      easing: "easeOutQuad",
    });
  }, [isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isRegister ? register : login;
    const response = await action(email, password);

    if (response.success) {
      if (!isRegister) {
        navigate("/typing");
      }
      showSnackbar(response.message, "success");
    } else {
      showSnackbar(response.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-400 p-6">
      <div
        ref={cardRef}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md opacity-0"
      >
        <h2 className="auth-title text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-purple-600 hover:underline text-sm"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
