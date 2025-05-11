import { useEffect, useState } from "react";
import axios from "axios";
import { getLeaderboard } from "../lib/api";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getLeaderboard(token);
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          🏆 Leaderboard
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-100 text-purple-700">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b">WPM</th>
              <th className="py-2 px-4 border-b">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className="hover:bg-purple-50">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{entry.user.email}</td>
                <td className="py-2 px-4 border-b text-center">{entry.wpm}</td>
                <td className="py-2 px-4 border-b text-center">
                  {entry.accuracy}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
