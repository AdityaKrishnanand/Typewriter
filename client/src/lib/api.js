import axios from "axios";

export const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function register(email, password) {
  try {
    const res = await axios.post(`${API_URL}/register`, {
      email,
      password,
    });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return { success: true, message: "Registered successfully." };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed.",
    };
  }
}

export async function login(email, password) {
  try {
    const res = await axios.post(`${apiUrl}/login`, { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return { success: true, message: "Login successful." };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed.",
    };
  }
}

export async function saveScore(wpm, accuracy, token) {
  const res = await fetch(`${apiUrl}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wpm, accuracy }),
  });

  return res.json();
}

export async function getLeaderboard(token, limit = 10) {
  const res = await fetch(`${apiUrl}/leaderboard?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
