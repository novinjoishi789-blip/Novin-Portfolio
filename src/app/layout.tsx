import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Novin Joishi — Creative Developer",
  description:
    "Portfolio of Novin Joishi: Creative Developer & Full-Stack Architect. Exploring the intersection of software systems, interaction design, and real-time 3D graphics.",
  keywords: [
    "Novin Joishi",
    "Creative Developer",
    "WebGL",
    "Three.js",
    "Next.js",
    "Full-Stack Developer",
    "Interactive Portfolio",
    "Software Engineer"
  ],
  authors: [{ name: "Novin Joishi" }],
  openGraph: {
    title: "Novin Joishi — Creative Developer & 3D Interactive Studio",
    description: "Digital systems, interactive interfaces and experiences where engineering meets design.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#060709] text-[#f3f4f6] selection:bg-[#e89e47] selection:text-[#060709] antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
