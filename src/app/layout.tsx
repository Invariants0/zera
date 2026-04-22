import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "ZERA | Provably Real. Privately Owned.",
  description: "A futuristic verification-first digital asset marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-black flex flex-col p-4 md:p-6 lg:p-8`}>
        {/* Floating Shell Container */}
        <div className="relative w-full max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] rounded-[2.5rem] ring-1 ring-white/10 shadow-2xl bg-obsidian_light overflow-hidden flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
