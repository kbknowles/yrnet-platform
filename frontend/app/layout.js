import "../styles/tailwind.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-gray-100 text-gray-900 antialiased"
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
