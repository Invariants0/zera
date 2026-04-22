"use client";

import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md h-[72px] flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
        
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text_primary">ZERA</span>
          </Link>
        </div>

        {/* Center - Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-text_primary hover:text-primary-500 transition-colors">Explore</Link>
          <Link href="#" className="text-sm font-medium text-text_secondary hover:text-primary-500 transition-colors">Create</Link>
          <Link href="/registry" className="text-sm font-medium text-text_secondary hover:text-primary-500 transition-colors">Registry</Link>
          <Link href="#" className="text-sm font-medium text-text_secondary hover:text-primary-500 transition-colors">Activity</Link>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          <Button variant="primary" className="hidden sm:inline-flex">
            Connect Wallet
          </Button>
        </div>
        
      </div>
    </nav>
  );
}
