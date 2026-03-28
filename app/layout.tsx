import type { Metadata } from "next";
import { Just_Another_Hand } from "next/font/google";
import "./globals.css";

const justAnotherHand = Just_Another_Hand({
  weight: "400",
  variable: "--font-just-another-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photobooth",
  description: "A hand-drawn doodle style photobooth app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={justAnotherHand.variable}>
      <body className="min-h-screen bg-white font-hand antialiased">
        {children}
      </body>
    </html>
  );
}
