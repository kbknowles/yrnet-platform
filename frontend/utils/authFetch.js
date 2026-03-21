// filepath: frontend/utils/authFetch.js

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function authFetch(endpoint, options = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // future: real auth
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // current: admin lock
  if (!headers.Authorization && process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}