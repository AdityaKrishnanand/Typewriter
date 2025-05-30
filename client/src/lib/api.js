import axios from "axios";

export const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function register(email, password) {
  try {
    const res = await axios.post(
      `${apiUrl}/register`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
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
    const res = await axios.post(
      `${apiUrl}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

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
    credentials: "include",
  });

  return res.json();
}

export async function getLeaderboard(token, limit = 10) {
  const res = await fetch(`${apiUrl}/leaderboard?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return res.json();
}
