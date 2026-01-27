// filepath: frontend/app/layout.js

import "../styles/globals.css";
import { Source_Sans_3, Libre_Franklin } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Alabama High School Rodeo Association",
  description: "Official AHSRA website",
};

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${sourceSans.variable}
          ${libreFranklin.variable}
          min-h-screen flex flex-col
          bg-gray-100 text-gray-900
        `}
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
