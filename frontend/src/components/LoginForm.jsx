import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const API_URL = "http://localhost:8000/api";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // Decode access token to extract username
      const me = await fetch(`${API_URL}/me/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      }).then(r => r.json());

      login(me, data);
      
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <label>
        Username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
