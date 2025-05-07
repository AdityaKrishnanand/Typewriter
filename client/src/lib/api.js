export const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function register(email, password) {
  const res = await fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  debugger;
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
