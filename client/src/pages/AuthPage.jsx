import { useState } from "react";
import { register, login } from "../lib/api";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login / Register</h1>

      <input
        className="border p-2 mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {}}
        >
          Login
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {}}
        >
          Register
        </button>
      </div>
    </div>
  );
}
