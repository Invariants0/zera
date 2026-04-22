import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

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
        
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          <TopBar />
          
          <main className="flex-1 w-full relative">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
