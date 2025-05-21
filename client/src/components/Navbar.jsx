import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUserCheck, FiShield, FiSun, FiMoon } from "react-icons/fi";
import { useSnackbar } from "../components/SnackbarContext";
import logo from "../assets/Gemini_Generated_Image_58txyu58txyu58tx copy.jpeg";

const links = [
  { to: "/", label: "Home", Icon: FiHome },
  { to: "/leaderboard", label: "Leaderboard", Icon: FiUserCheck },
  { to: "/login", label: "Login/Register", Icon: FiShield },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      showSnackbar(
        `Switched to ${newMode ? "Dark" : "Light"} Mode ${
          newMode ? "🌙" : "☀️"
        }`,
        "info",
        2500
      );
      return newMode;
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white/30 dark:bg-gray-900/60 shadow-md text-gray-900 dark:text-gray-100 py-4 px-6 flex justify-between items-center fixed w-full z-50 transition-colors duration-300">
      <Link to="/" className="flex items-center space-x-3">
        <img
          src={logo}
          alt="TapTrack logo"
          className="h-10 w-10 rounded-full shadow-md"
        />
        <span className="text-3xl font-extrabold tracking-wide select-none drop-shadow-md">
          TapTrack
        </span>
      </Link>

      <div className="flex items-center space-x-6 text-lg font-semibold">
        {location.pathname === "/leaderboard" && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-200 px-3 py-1 rounded-md border border-gray-400 dark:border-gray-600 hover:border-gray-700 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Go Back"
          >
            ← Back
          </button>
        )}

        {links.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isActive(to)
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-900 dark:text-gray-100 hover:bg-purple-100 dark:hover:bg-purple-700/30 hover:text-purple-700 dark:hover:text-purple-300"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive(to)
                  ? "text-white"
                  : "text-purple-600 dark:text-purple-400"
              }`}
              aria-hidden="true"
            />
            <span>{label}</span>
          </Link>
        ))}

        <button
          onClick={toggleDarkMode}
          className="ml-4 p-2 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
    </nav>
  );
}
