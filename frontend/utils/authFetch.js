// filepath: frontend/utils/authFetch.js

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function authFetch(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers = {
    ...(options.headers || {}),
  };

  // only set JSON header if not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // primary: token from login
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // fallback: env admin secret
  if (!headers.Authorization && process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}