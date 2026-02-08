// filepath: frontend/app/admin/layout.js

import "../../styles/globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
