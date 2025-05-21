import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/api";
import { useSnackbar } from "../components/SnackbarContext";

const medals = {
  1: (
    <span
      role="img"
      aria-label="gold medal"
      className="text-yellow-400 text-xl"
    >
      🥇
    </span>
  ),
  2: (
    <span
      role="img"
      aria-label="silver medal"
      className="text-gray-400 text-xl"
    >
      🥈
    </span>
  ),
  3: (
    <span
      role="img"
      aria-label="bronze medal"
      className="text-yellow-700 text-xl"
    >
      🥉
    </span>
  ),
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { showSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(token);
        setLeaderboard(data.leaderboard || []);
      } catch (error) {
        showSnackbar("Failed to load leaderboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-300 text-xl font-medium animate-pulse">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 transition-colors duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-wide drop-shadow-md">
            🏆 Leaderboard
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-700 dark:hover:bg-purple-600 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
            <thead
              className={`uppercase tracking-wider text-sm ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              }`}
            >
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">WPM</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No leaderboard data found.
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr
                    key={entry.user.id}
                    className={`transition-colors duration-300 cursor-default ${
                      darkMode
                        ? index % 2 === 0
                          ? "bg-gray-800"
                          : "bg-gray-700"
                        : index % 2 === 0
                        ? "bg-purple-50"
                        : "bg-pink-50"
                    } hover:${darkMode ? "bg-gray-600" : "bg-purple-100"}`}
                  >
                    <td className="py-4 px-6 font-semibold text-purple-700 dark:text-yellow-300 flex items-center gap-2">
                      {medals[index + 1] || index + 1}
                    </td>
                    <td className="py-4 px-6 font-medium truncate max-w-xs">
                      {entry.user.email}
                    </td>
                    <td className="py-4 px-6 font-semibold text-purple-900 dark:text-yellow-400">
                      {entry.wpm}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
