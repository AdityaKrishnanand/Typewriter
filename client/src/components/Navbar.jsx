import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold tracking-wide">
        TypeWriter⚡
      </Link>
      <div className="space-x-4">
        {location.pathname === "/leaderboard" && (
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 transition duration-200"
          >
            Back
          </button>
        )}
        <Link
          to="/"
          className={`hover:underline transition duration-200 ${
            isActive("/") ? "underline font-semibold" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/leaderboard"
          className={`hover:underline transition duration-200 ${
            isActive("/leaderboard") ? "underline font-semibold" : ""
          }`}
        >
          Leaderboard
        </Link>
        <Link
          to="/login"
          className={`hover:underline transition duration-200 ${
            isActive("/login") ? "underline font-semibold" : ""
          }`}
        >
          Login/Register
        </Link>
      </div>
    </nav>
  );
}
