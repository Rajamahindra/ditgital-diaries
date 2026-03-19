import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Digital Diaries — AI-Powered Digital Identity Platform",
  description:
    "Build your professional digital identity in minutes. AI-powered digital visiting cards that work like mini websites.",
  keywords: ["digital card", "visiting card", "digital identity", "AI card builder"],
  openGraph: {
    title: "Digital Diaries",
    description: "AI-Powered Digital Identity Platform",
    type: "website",
    url: "https://digitaldiaries.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Diaries",
    description: "AI-Powered Digital Identity Platform",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
