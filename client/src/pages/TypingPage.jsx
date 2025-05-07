import { useEffect, useRef, useState } from "react";

const sampleText = "The quick brown fox jumps over the lazy dog.";

export default function TypingPage() {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (typed.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (typed === sampleText) {
      const end = Date.now();
      setEndTime(end);
      const minutes = (end - startTime) / 1000 / 60;
      const words = sampleText.trim().split(/\s+/).length;
      setWpm(Math.round(words / minutes));
    }
  }, [typed]);

  const getCharClass = (char, index) => {
    if (!typed[index]) return "";
    return typed[index] === char ? "text-green-600" : "text-red-500";
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

        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mt-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Start typing here..."
        />

        {wpm !== null && (
          <p className="mt-4 text-center text-green-700 font-semibold">
            🎉 Your speed: {wpm} WPM
          </p>
        )}
      </div>
    </div>
  );
}
