import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Diaries Admin",
  description: "Admin panel for Digital Diaries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
