// filepath: frontend/app/layout.js

import "../styles/globals.css";
import { Fira_Sans } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Alabama High School Rodeo Association",
  description: "Official AHSRA website",
  icons: {
    icon: "/favicon.png",
  },
};

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${firaSans.variable} min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 bg-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
