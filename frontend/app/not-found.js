// filepath: frontend/app/not-found.js

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <h1 className="text-4xl font-bold text-ahsra-blue">
        Page Not Found
      </h1>

      <p className="text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or is no longer available.
      </p>

      <Link
        href="/"
        className="text-ahsra-red font-medium underline"
      >
        Return to Home
      </Link>
    </main>
  );
}
