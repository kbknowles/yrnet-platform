// filepath: frontend/app/[tenantSlug]/admin/layout.js

import "../../../styles/globals.css";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#A9A9C2]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}