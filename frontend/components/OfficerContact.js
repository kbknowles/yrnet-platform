// filepath: frontend/components/OfficerContact.js
"use client";

import { maskPhone } from "lib/officerDisplay";

export function RevealEmail({ email }) {
  if (!email) return null;

  return (
    <button
      onClick={() => (window.location.href = `mailto:${email}`)}
      className="text-sm underline"
    >
      {email.replace("@", " [at] ").replace(".", " [dot] ")}
    </button>
  );
}

export function RevealPhone({ phone }) {
  if (!phone) return null;

  return (
    <button
      onClick={() => alert(phone)}
      className="block text-sm text-gray-600"
    >
      {maskPhone(phone)}
    </button>
  );
}