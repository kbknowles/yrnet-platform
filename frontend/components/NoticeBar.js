"use client";

export default function NoticeBar({ message, isActive = true }) {
  if (!isActive || !message) return null;

  return (
    <div className="bg-secondary w-full border-y border-gray-200 bg-[#EEF1F3]">
      <div className="max-w-7xl mx-auto px-4 uppercase py-2 text-center text-lg font-medium text-white">
        {message}
      </div>
    </div>
  );
}