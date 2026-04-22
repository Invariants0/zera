"use client";

import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between">
      
      {/* Left - Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-black font-bold text-xl font-grotesk tracking-tighter">Z</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-text-primary uppercase">ZERA</span>
        </Link>
      </div>

      {/* Center - Pill Links (Hidden on mobile) */}
      <div className="hidden md:flex items-center space-x-8 px-8 py-3 rounded-full bg-glass-white backdrop-blur-md border border-glass-border">
        <Link href="/" className="text-sm font-medium text-text-secondary hover:text-lime transition-colors">Explore</Link>
        <Link href="#" className="text-sm font-medium text-text-secondary hover:text-lime transition-colors">Create</Link>
        <Link href="/registry" className="text-sm font-medium text-text-secondary hover:text-lime transition-colors">Registry</Link>
        <Link href="#" className="text-sm font-medium text-text-secondary hover:text-lime transition-colors">Activity</Link>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center gap-2 font-mono uppercase tracking-widest text-[10px] text-text-secondary">
          <span>Sys.Online</span>
          <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-fast"></div>
        </div>
        <Button variant="primary" className="hidden sm:inline-flex rounded-full px-6 py-2.5 text-sm">
          Connect Wallet
        </Button>
      </div>
      
    </nav>
  );
}
