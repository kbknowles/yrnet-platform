// filepath: frontend/app/layout.js

import "../styles/globals.css";
import { Fira_Sans } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Alabama High School Rodeo Association",
  description: "Official AHSRA website",
};

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${firaSans.variable}
          min-h-screen flex flex-col
          bg-gray-100 text-gray-900
          font-sans
        `}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
