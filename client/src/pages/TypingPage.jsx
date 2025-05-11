import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { saveScore } from "../lib/api";

const sampleText = "The quick brown fox jumps over the lazy dog.";

export default function TypingPage() {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (hasStarted && countdown === 0) {
      inputRef.current?.focus();
      setStartTime(Date.now());
    }
  }, [countdown, hasStarted]);

  useEffect(() => {
    let interval;
    if (hasStarted && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, countdown]);

  useEffect(() => {
    if (typed === sampleText) {
      const end = Date.now();
      setEndTime(end);
      const minutes = (end - startTime) / 1000 / 60;
      const words = sampleText.trim().split(/\s+/).length;
      const correctChars = typed
        .split("")
        .filter((char, i) => char === sampleText[i]).length;
      const acc = Math.round((correctChars / sampleText.length) * 100);

      const calculatedWpm = Math.round(words / minutes);
      setWpm(calculatedWpm);
      setAccuracy(acc);

      const token = localStorage.getItem("token");
      if (token) {
        saveScore(calculatedWpm, acc, token);
      }
    }
  }, [typed]);

  const getCharClass = (char, index) => {
    if (!typed[index]) return "";
    return typed[index] === char ? "text-green-600" : "text-red-500";
  };

  const handleStart = () => {
    setTyped("");
    setWpm(null);
    setAccuracy(null);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setHasStarted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Typing Test
        </h2>

        <div className="bg-gray-100 p-4 rounded-lg text-lg leading-relaxed font-mono border h-[100px] overflow-auto">
          {sampleText.split("").map((char, idx) => (
            <span key={idx} className={getCharClass(char, idx)}>
              {char}
            </span>
          ))}
        </div>

        {countdown !== null && countdown > 0 && (
          <p className="text-center mt-4 text-xl text-blue-600 font-bold">
            Starting in {countdown}...
          </p>
        )}

        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={!hasStarted || countdown > 0}
          className="mt-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
          placeholder="Start typing here..."
        />

        {wpm !== null && (
          <div className="mt-4 text-center text-green-700 font-semibold space-y-1">
            <p>🚀 Your speed: {wpm} WPM</p>
            <p>🎯 Accuracy: {accuracy}%</p>
            <div className="mt-4 text-center">
              <Link
                to="/leaderboard"
                className="text-purple-600 hover:underline text-sm"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleStart}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
          >
            {hasStarted ? "Restart" : "Start Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
