"use client";

export default function NoticeBar({ message, isActive = true }) {
  if (!isActive || !message) return null;

  // Split on em dash or double hyphen
  const parts = message.split(/—|--/);

  return (
    <div className="notice-bar bg-secondary w-full border-y border-gray-200">
      <div className="notice-bar max-w-7xl mx-auto px-4 py-2 text-center text-lg font-medium uppercase">
        {parts.length > 1 ? (
          <>
            <span>{parts[0].trim()}</span>
            <span className="block sm:inline">
              {" — " + parts.slice(1).join(" ").trim()}
            </span>
          </>
        ) : (
          message
        )}
      </div>
    </div>
  );
}