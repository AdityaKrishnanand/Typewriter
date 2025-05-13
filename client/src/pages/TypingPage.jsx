import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { saveScore } from "../lib/api";
import anime from "animejs/lib/anime.es.js";
import "./TypingPage.css"; // Import the CSS file

const sampleText = "The quick brown fox jumps over the lazy dog.";

export default function TypingPage() {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [totalTypedCharacters, setTotalTypedCharacters] = useState(0);
  const inputRef = useRef();
  const containerRef = useRef();
  const countdownRef = useRef();
  const charactersRef = useRef([]);
  const resultRef = useRef();
  const confettiRef = useRef();

  // Reset character refs when component mounts
  useEffect(() => {
    charactersRef.current = charactersRef.current.slice(0, sampleText.length);
  }, []);

  // Entrance animation when component mounts
  useEffect(() => {
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: "easeOutExpo",
    });
  }, []);

  // Handle countdown and focus
  useEffect(() => {
    if (hasStarted && countdown === 0) {
      inputRef.current?.focus();
      setStartTime(Date.now());

      // Animate text container when test starts
      anime({
        targets: charactersRef.current,
        opacity: [0.6, 1],
        scale: [0.95, 1],
        duration: 500,
        delay: anime.stagger(10),
        easing: "easeOutQuad",
      });
    }
  }, [countdown, hasStarted]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (hasStarted && countdown > 0) {
      // Animate countdown number
      anime({
        targets: countdownRef.current,
        scale: [1.5, 1],
        opacity: [1, 0.7],
        duration: 900,
        easing: "easeOutCirc",
      });

      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, countdown]);

  // Handle test completion
  useEffect(() => {
    if (typed === sampleText) {
      const end = Date.now();
      setEndTime(end);
      const minutes = (end - startTime) / 1000 / 60;
      const wordCount = sampleText.trim().split(/\s+/).length;

      let correctChars = 0;
      for (let i = 0; i < sampleText.length; i++) {
        if (typed[i] === sampleText[i]) correctChars++;
      }

      const calculatedWpm = Math.round(wordCount / minutes);
      const acc = Math.round((correctChars / totalTypedCharacters) * 100);
      setWpm(calculatedWpm);
      setAccuracy(acc);

      const token = localStorage.getItem("token");
      if (token) {
        saveScore(calculatedWpm, acc, token);
      }

      // Celebration animation
      celebrateCompletion();
    }
  }, [typed]);

  const handleTyping = (e) => {
    const value = e.target.value;

    // Start time when typing begins
    if (typed.length === 0 && value.length === 1) {
      setStartTime(Date.now());
    }

    // Count only added characters (not deletions)
    const addedChars = value.length - typed.length;
    if (addedChars > 0) {
      setTotalTypedCharacters((prev) => prev + addedChars);
    }

    setTyped(value);
  };

  // Create confetti particles
  const createConfetti = () => {
    const confettiContainer = confettiRef.current;
    confettiContainer.innerHTML = "";
    const colors = [
      "#FF1461",
      "#18FF92",
      "#5A87FF",
      "#FBF38C",
      "#FF7AC5",
      "#8B5CF6",
      "#22D3EE",
    ];
    const shapes = ["circle", "square", "triangle"];

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // Randomly choose shape
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === "circle") {
        confetti.style.borderRadius = "50%";
      } else if (shape === "triangle") {
        confetti.style.width = "0";
        confetti.style.height = "0";
        confetti.style.backgroundColor = "transparent";
        confetti.style.borderLeft = "5px solid transparent";
        confetti.style.borderRight = "5px solid transparent";
        confetti.style.borderBottom = `10px solid ${
          colors[Math.floor(Math.random() * colors.length)]
        }`;
      } else {
        // Square shape
        confetti.style.borderRadius = "0";
      }

      // Set properties
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confettiContainer.appendChild(confetti);
    }

    // Animate confetti
    anime({
      targets: ".confetti",
      translateY: [
        { value: -20, duration: 300 },
        { value: 800, duration: 1500, delay: anime.stagger(10) },
      ],
      translateX: () => {
        return [anime.random(-100, 100), anime.random(-300, 300)];
      },
      rotate: () => {
        return anime.random(-720, 720);
      },
      scale: [
        { value: 0, duration: 0 },
        { value: 1, duration: 200 },
        { value: 0, duration: 1000, delay: anime.random(500, 1200) },
      ],
      easing: "easeOutExpo",
      duration: 2000,
      delay: anime.stagger(10),
    });
  };

  // Background animation based on typing speed
  const animateBackground = () => {
    if (!hasStarted || countdown > 0 || !containerRef.current) return;

    const currentTime = Date.now();
    const typingSpeed = typed.length / ((currentTime - startTime) / 1000);

    // Change background animation based on typing speed
    const background = containerRef.current;
    const intensity = Math.min(Math.max(typingSpeed / 5, 0.1), 1);

    anime({
      targets: background,
      backgroundColor: [
        { value: `rgba(255, 255, 255, 1)`, duration: 0 },
        {
          value: `rgba(${255 - 20 * intensity}, ${
            255 - 10 * intensity
          }, 255, 1)`,
          duration: 300,
        },
      ],
      easing: "easeOutQuad",
    });
  };

  // Add effect when typing
  useEffect(() => {
    if (hasStarted && countdown === 0 && startTime && typed.length > 0) {
      animateBackground();
    }
  }, [typed, hasStarted, countdown, startTime]);

  // Celebrate completion
  const celebrateCompletion = () => {
    // Animate result display
    anime({
      targets: resultRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.8, 1],
      duration: 800,
      easing: "easeOutElastic(1, .5)",
    });

    // Add sparkle effect to the container
    anime({
      targets: containerRef.current,
      boxShadow: [
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "0 0 0 3px rgba(139, 92, 246, 0.3), 0 10px 20px rgba(139, 92, 246, 0.35)",
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      ],
      duration: 2000,
      easing: "easeOutElastic(1, .5)",
    });

    // Create confetti celebration
    createConfetti();
  };

  const getCharClass = (char, index) => {
    if (!typed[index]) return "";
    return typed[index] === char ? "text-green-600" : "text-red-500";
  };

  // Add typing particle effect
  const createTypingParticle = (x, y, isCorrect) => {
    const container = containerRef.current;
    const particle = document.createElement("div");
    particle.className = "absolute pointer-events-none";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.innerText = isCorrect ? "✓" : "✗";
    particle.style.fontSize = "16px";
    particle.style.color = isCorrect ? "#16a34a" : "#dc2626";
    particle.style.zIndex = 20;
    container.appendChild(particle);

    anime({
      targets: particle,
      translateY: -30,
      opacity: [1, 0],
      duration: 800,
      easing: "easeOutExpo",
      complete: () => {
        container.removeChild(particle);
      },
    });
  };

  // Animate characters as they're typed
  useEffect(() => {
    if (
      typed.length > 0 &&
      typed.length <= sampleText.length &&
      hasStarted &&
      countdown === 0
    ) {
      const currentCharRef = charactersRef.current[typed.length - 1];
      const isCorrect =
        typed[typed.length - 1] === sampleText[typed.length - 1];

      if (currentCharRef) {
        const rect = currentCharRef.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top;

        anime({
          targets: currentCharRef,
          scale: [1.5, 1],
          duration: 300,
          easing: "easeOutElastic(1, .5)",
        });

        // Create particle effect
        createTypingParticle(x, y, isCorrect);
      }
    }
  }, [typed, hasStarted, countdown]);

  const handleStart = () => {
    setTyped("");
    setWpm(null);
    setAccuracy(null);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setHasStarted(true);

    // Animate button press
    anime({
      targets: event.currentTarget,
      scale: [1, 0.95, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
      {/* Confetti container */}
      <div
        ref={confettiRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      ></div>

      <div
        ref={containerRef}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full relative typing-container"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          <span className="text-purple-600">Speed</span> Typing Test
        </h2>

        {/* Typing progress indicator */}
        {hasStarted && countdown === 0 && typed.length > 0 && !wpm && (
          <div className="absolute top-4 right-4">
            <div className="text-xs text-gray-500 mb-1 text-right">
              Progress
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{
                  width: `${(typed.length / sampleText.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div
          className={`bg-gray-100 p-4 rounded-lg text-lg leading-relaxed font-mono border h-[100px] overflow-auto relative ${
            hasStarted && countdown === 0 ? "typing-active" : ""
          }`}
        >
          {sampleText.split("").map((char, idx) => (
            <span
              key={idx}
              ref={(el) => (charactersRef.current[idx] = el)}
              className={`inline-block transition-colors duration-200 ${getCharClass(
                char,
                idx
              )} ${idx === typed.length ? "char-cursor" : ""}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {countdown !== null && countdown > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <p
              ref={countdownRef}
              className="text-6xl font-bold text-purple-600 bg-white bg-opacity-80 rounded-full h-24 w-24 flex items-center justify-center"
            >
              {countdown}
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={handleTyping}
          disabled={!hasStarted || countdown > 0}
          className="mt-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
          placeholder="Start typing here..."
        />

        {wpm !== null && (
          <div
            ref={resultRef}
            className="mt-4 text-center text-green-700 font-semibold space-y-1"
          >
            <div className="flex items-center justify-center space-x-8">
              <div>
                <p className="text-xl">🚀 Your speed</p>
                <p className="text-3xl result-badge text-purple-600">
                  {wpm} <span className="text-xl">WPM</span>
                </p>
              </div>
              <div>
                <p className="text-xl">🎯 Accuracy</p>
                <p className="text-3xl result-badge text-emerald-600">
                  {accuracy}
                  <span className="text-xl">%</span>
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/leaderboard"
                className="text-purple-600 hover:underline text-base font-medium inline-flex items-center group"
              >
                <span>View Leaderboard</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleStart}
            className="relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 transform hover:scale-105"
          >
            {hasStarted ? "Restart Test" : "Start Test"}
          </button>
        </div>

        {/* Message to encourage users when they start typing */}
        {hasStarted &&
          countdown === 0 &&
          typed.length > 0 &&
          typed.length < sampleText.length &&
          !wpm && (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-purple-600 text-sm font-medium bg-white px-3 py-1 rounded-full shadow">
              Keep going, you're doing great!
            </div>
          )}
      </div>
    </div>
  );
}
