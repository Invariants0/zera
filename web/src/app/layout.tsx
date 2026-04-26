import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/AppShell";
import { ToastProvider } from "../components/ToastProvider";

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
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-black font-grotesk text-text-primary antialiased`}>
        <ToastProvider />
        <AppShell>{children}</AppShell>

      </body>
    </html>
  );
}
