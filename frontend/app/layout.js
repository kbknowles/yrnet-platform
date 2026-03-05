// filepath: frontend/app/layout.js

import "../styles/globals.css";
import { Fira_Sans } from "next/font/google";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${firaSans.variable} min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}