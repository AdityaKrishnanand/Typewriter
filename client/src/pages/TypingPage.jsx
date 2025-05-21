import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveScore } from "../lib/api";
import anime from "animejs/lib/anime.es.js";
import "./TypingPage.css";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

// Function to generate random paragraph
const getRandomParagraph = () => {
  return lorem.generateParagraphs(1);
};

// Function to play random typing sound
const playRandomKeySound = () => {
  console.log("Keyboard sound played");
};

export default function TypingPage() {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState(getRandomParagraph());
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [totalTypedCharacters, setTotalTypedCharacters] = useState(0);
  const [progress, setProgress] = useState(0);
  const [realTimeWpm, setRealTimeWpm] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userId, setUserId] = useState(null);
  const [paragraphsCompleted, setParagraphsCompleted] = useState(0);

  // Refs
  const inputRef = useRef();
  const containerRef = useRef();
  const countdownRef = useRef();
  const charactersRef = useRef([]);
  const resultRef = useRef();
  const confettiRef = useRef();
  const speedTimerRef = useRef(null);
  const timeLeftRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Reset character refs when text changes
  useEffect(() => {
    charactersRef.current = charactersRef.current.slice(0, currentText.length);
  }, [currentText]);

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

  // Timer for timed tests
  useEffect(() => {
    if (hasStarted && countdown === 0 && selectedTime && timeLeft > 0) {
      timeLeftRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timeLeftRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timeLeftRef.current);
  }, [hasStarted, countdown, selectedTime, timeLeft]);

  // Handle paragraph completion
  useEffect(() => {
    if (typed === currentText) {
      // Increment completed paragraphs
      setParagraphsCompleted((prev) => prev + 1);

      // Load next paragraph for infinite mode
      if (!selectedTime) {
        setCurrentText(getRandomParagraph());
        setTyped("");
      } else {
        // For timed mode, just update progress
        const updatedTotalChars = totalTypedCharacters + currentText.length;
        setTotalTypedCharacters(updatedTotalChars);
      }

      // Animate transition to next paragraph
      anime({
        targets: ".typing-text-container",
        opacity: [1, 0.5, 1],
        translateY: [0, -10, 0],
        duration: 600,
        easing: "easeOutQuad",
      });

      // Play completion sound/effect
      playCompletionEffect();
    }
  }, [typed, currentText, selectedTime]);

  // Handle test completion (timed mode)
  const finishTest = () => {
    setIsTestCompleted(true);
    setEndTime(Date.now());

    const end = Date.now();
    const minutes = (end - startTime) / 1000 / 60;

    // Calculate WPM based on standard 5 characters per word
    const wordCount = totalTypedCharacters / 5;

    // Calculate correct characters for accuracy
    let correctChars = 0;
    let totalChars = 0;

    // In timed mode, we accumulate characters across paragraphs
    const calculatedWpm = Math.round(wordCount / minutes);
    const acc = Math.round((correctChars / totalChars || 0) * 100);

    setWpm(calculatedWpm);
    setAccuracy(acc);

    // Save score if logged in
    const token = localStorage.getItem("token");
    if (token) {
      saveScore(calculatedWpm, acc, token);
    } else {
      setShowLoginPrompt(true);
    }

    // Celebration animation
    celebrateCompletion();
  };

  const handleTyping = (e) => {
    const value = e.target.value;

    // Start time when typing begins
    if (typed.length === 0 && value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    // Count total characters typed (for accuracy calculation)
    const addedChars = value.length - typed.length;
    if (addedChars > 0) {
      setTotalTypedCharacters((prev) => prev + addedChars);
      playRandomKeySound();
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

  // Calculate and show real-time WPM
  useEffect(() => {
    if (hasStarted && countdown === 0 && startTime && !isTestCompleted) {
      clearInterval(speedTimerRef.current);

      speedTimerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - startTime) / 1000 / 60;

        // Calculate WPM based on all typed characters (standard 5 chars per word)
        const totalWords = totalTypedCharacters / 5;
        const currentWpm = Math.round(totalWords / elapsedMinutes) || 0;

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
  }, [
    typed,
    hasStarted,
    countdown,
    startTime,
    totalTypedCharacters,
    isTestCompleted,
  ]);

  // Clear interval when test is complete
  useEffect(() => {
    if (isTestCompleted) {
      clearInterval(speedTimerRef.current);
      clearInterval(timeLeftRef.current);
    }
  }, [isTestCompleted]);

  // Update progress bar as user types
  useEffect(() => {
    if (hasStarted && countdown === 0) {
      const newProgress = (typed.length / currentText.length) * 100;
      setProgress(newProgress);

      anime({
        targets: ".progress-bar-fill",
        width: `${newProgress}%`,
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  }, [typed, hasStarted, countdown, currentText]);

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

  // Play small completion effect for paragraph completion
  const playCompletionEffect = () => {
    // Create mini-confetti or sparkle effect
    const container = containerRef.current;
    const sparkles = document.createElement("div");
    sparkles.className = "paragraph-complete-sparkles";
    container.appendChild(sparkles);

    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
      sparkles.appendChild(sparkle);
    }

    anime({
      targets: ".sparkle",
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      translateY: [0, -30],
      delay: anime.stagger(10),
      duration: 600,
      easing: "easeOutExpo",
      complete: () => {
        container.removeChild(sparkles);
      },
    });

    // Show quick notification
    const notification = document.createElement("div");
    notification.className = "paragraph-complete-notification";
    notification.innerText = "Great job!";
    container.appendChild(notification);

    anime({
      targets: notification,
      opacity: [0, 1, 0],
      translateY: [10, -30, -50],
      duration: 1200,
      easing: "easeOutExpo",
      complete: () => {
        container.removeChild(notification);
      },
    });
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
      typed.length <= currentText.length &&
      hasStarted &&
      countdown === 0
    ) {
      const currentCharRef = charactersRef.current[typed.length - 1];
      const isCorrect =
        typed[typed.length - 1] === currentText[typed.length - 1];

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
  }, [typed, hasStarted, countdown, currentText]);

  const handleStart = (time = null) => {
    setTyped("");
    setWpm(null);
    setAccuracy(null);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setHasStarted(true);
    setIsTestCompleted(false);
    setSelectedTime(time);
    setTimeLeft(time);
    setTotalTypedCharacters(0);
    setParagraphsCompleted(0);
    setCurrentText(getRandomParagraph());
    setShowLoginPrompt(false);

    // Animate button press
    anime({
      targets: event.currentTarget,
      scale: [1, 0.95, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 overflow-hidden">
      {/* Confetti container */}
      <div
        ref={confettiRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      ></div>

      <div
        ref={containerRef}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full relative typing-container"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-700">
          Typing Speed Test
        </h2>

        {/* Test mode selection */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleStart(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedTime && hasStarted
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => handleStart(15)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTime === 15
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            15 Seconds
          </button>
          <button
            onClick={() => handleStart(30)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTime === 30
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            30 Seconds
          </button>
          <button
            onClick={() => handleStart(60)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTime === 60
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            60 Seconds
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <div className="flex gap-4">
            <span>
              Speed: <strong>{realTimeWpm || 0} WPM</strong>
            </span>
            {selectedTime && (
              <span>
                Time: <strong>{timeLeft}s</strong>
              </span>
            )}
          </div>
          {!selectedTime && (
            <span>
              Paragraphs: <strong>{paragraphsCompleted}</strong>
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative mb-4">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="progress-bar-fill h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Typing area */}
        <div
          className={`typing-text-container bg-gray-100 p-4 rounded-lg text-lg leading-relaxed font-mono border h-[120px] overflow-auto relative ${
            hasStarted && countdown === 0 ? "typing-active" : ""
          }`}
        >
          {currentText.split("").map((char, idx) => (
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
          disabled={!hasStarted || countdown > 0 || isTestCompleted}
          className="mt-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
          placeholder={hasStarted ? "Type here..." : "Press Start to begin..."}
        />

        {/* Results area */}
        {isTestCompleted && (
          <div ref={resultRef} className="mt-4 text-center space-y-2">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-purple-700">
                Test Complete!
              </h3>
              <div className="flex gap-6 mt-2">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Speed</p>
                  <p className="text-2xl font-bold text-green-600">{wpm} WPM</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {accuracy}%
                  </p>
                </div>
                {!selectedTime && (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Paragraphs</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {paragraphsCompleted}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showLoginPrompt && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-blue-700">Want to save your score?</p>
                <button
                  onClick={handleLogin}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-sm"
                >
                  Log In
                </button>
              </div>
            )}

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => handleStart(selectedTime)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Try Again
              </button>
              <Link
                to="/leaderboard"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        )}

        {!isTestCompleted && !hasStarted && (
          <div className="mt-6 text-center">
            <button
              onClick={() => handleStart(null)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 transform hover:scale-105 relative overflow-hidden"
            >
              Start Typing
            </button>
            <p className="mt-3 text-sm text-gray-600">
              Choose a test mode above or just start practicing!
            </p>
          </div>
        )}

        {/* User status */}
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          {userId ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Logged In
            </span>
          ) : (
            <Link to="/login" className="hover:underline">
              Log in to save scores
            </Link>
          )}
        </div>
      </div>

      {/* Add extra CSS styles needed for new components */}
      <style jsx>{`
        .paragraph-complete-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 30;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .paragraph-complete-notification {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(139, 92, 246, 0.9);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-weight: bold;
          pointer-events: none;
          z-index: 30;
        }

        .char-cursor::after {
          content: "";
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #8b5cf6;
          margin-left: 1px;
          vertical-align: middle;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
