import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/api";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(token);
      setLeaderboard(data.leaderboard || []);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Leaderboard
        </h2>

        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-lg font-medium text-gray-600">
                Rank
              </th>
              <th className="py-2 px-4 text-lg font-medium text-gray-600">
                Email
              </th>
              <th className="py-2 px-4 text-lg font-medium text-gray-600">
                WPM
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr
                key={entry.user.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 text-gray-700">{index + 1}</td>
                <td className="py-2 px-4 text-gray-700">{entry.user.email}</td>
                <td className="py-2 px-4 text-gray-700">{entry.wpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
