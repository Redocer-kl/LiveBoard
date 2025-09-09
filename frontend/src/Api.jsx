const API_URL = "http://localhost:8000/api";

export async function register(username, email, password) {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
