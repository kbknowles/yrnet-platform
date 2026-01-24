import "../styles/tailwind.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
