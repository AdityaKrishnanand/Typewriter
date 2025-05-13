import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { saveScore } from "../lib/api";
import anime from "animejs/lib/anime.es.js";
import "./TypingPage.css"; // Import the CSS file

const sampleText = "The quick brown fox jumps over the lazy dog.";

// Typing sound effects
const keySound1 = new Audio();
const keySound2 = new Audio();
const keySound3 = new Audio();
const keySounds = [keySound1, keySound2, keySound3];

// Function to play random typing sound
const playRandomKeySound = () => {
  // In a real implementation, you would set the src for each sound
  // keySound1.src = "path/to/key1.mp3";
  // keySound2.src = "path/to/key2.mp3";
  // keySound3.src = "path/to/key3.mp3";

  // For demo purposes, we'll just log the sound play
  console.log("Keyboard sound played");

  // Uncomment to actually play sounds when you have audio files
  // const sound = keySounds[Math.floor(Math.random() * keySounds.length)];
  // sound.currentTime = 0;
  // sound.volume = 0.3;
  // sound.play();
};

export default function TypingPage() {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [totalTypedCharacters, setTotalTypedCharacters] = useState(0);
  const [progress, setProgress] = useState(0);
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
  const [realTimeWpm, setRealTimeWpm] = useState(0);
  const speedTimerRef = useRef(null);

  // Calculate and show real-time WPM
  useEffect(() => {
    if (hasStarted && countdown === 0 && startTime && typed.length > 0) {
      clearInterval(speedTimerRef.current);

      speedTimerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - startTime) / 1000 / 60;
        const words = typed.trim().split(/\s+/).length;
        const currentWpm = Math.round(words / elapsedMinutes) || 0;

        setRealTimeWpm(currentWpm);

        // Animate the speed indicator
        anime({
          targets: ".speed-indicator",
          translateY: [
            { value: -5, duration: 150 },
            { value: 0, duration: 150 },
          ],
          opacity: [0.7, 1],
          easing: "easeOutQuad",
        });
      }, 1000);
    }

    return () => clearInterval(speedTimerRef.current);
  }, [typed, hasStarted, countdown, startTime]);

  // Clear interval when test is complete
  useEffect(() => {
    if (endTime) {
      clearInterval(speedTimerRef.current);
    }
  }, [endTime]);

  // Update progress bar as user types
  useEffect(() => {
    if (hasStarted && countdown === 0) {
      const newProgress = (typed.length / sampleText.length) * 100;
      setProgress(newProgress);

      anime({
        targets: ".progress-bar-fill",
        width: `${newProgress}%`,
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  }, [typed, hasStarted, countdown]);

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
          Typing Test
        </h2>

        {/* Progress bar with speed indicator */}
        <div className="relative mb-4">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="progress-bar-fill h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {hasStarted && countdown === 0 && !endTime && (
            <div
              className={`speed-indicator absolute -top-6 right-0 text-sm font-semibold bg-white px-2 py-1 rounded shadow-sm ${
                realTimeWpm > 50 ? "high" : realTimeWpm > 30 ? "medium" : "low"
              }`}
              style={{ opacity: realTimeWpm > 0 ? 1 : 0 }}
            >
              {realTimeWpm} WPM
            </div>
          )}
        </div>

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
            <p className="text-xl">
              🚀 Your speed:{" "}
              <span className="text-2xl result-badge">{wpm} WPM</span>
            </p>
            <p className="text-xl">
              🎯 Accuracy:{" "}
              <span className="text-2xl result-badge">{accuracy}%</span>
            </p>
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
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 transform hover:scale-105 relative overflow-hidden"
          >
            {hasStarted ? "Restart" : "Start Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
