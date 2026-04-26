"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Search, User, ShoppingCart, Menu } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/explore?search=${encodeURIComponent(trimmed)}` : "/explore");
  };

  return (
    <div className="w-full flex flex-col border-b border-glass-border bg-black sticky top-0 z-50">
      {/* Top Navbar */}
      <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between gap-6">
        
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-black font-bold text-xl font-grotesk tracking-tighter">Z</span>
          </div>
          <span className="hidden sm:block text-2xl font-bold tracking-tighter text-text-primary uppercase">ZERA</span>
        </Link>

        {/* Center - Search Bar */}
        <form className="flex-1 max-w-3xl relative hidden md:block" onSubmit={handleSearch}>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search items, collections, and accounts"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime transition-all font-mono text-sm"
          />
          <button type="submit" className="absolute inset-y-0 right-4 flex items-center pointer-events-auto" aria-label="Search">
            <div className="px-2 py-1 rounded-md bg-white/10 text-text-secondary text-xs font-mono border border-white/10">/</div>
          </button>
        </form>

        {/* Right - Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="primary" className="hidden lg:flex px-6 h-12">
            Connect Wallet
          </Button>
          <button className="p-3 rounded-xl hover:bg-white/10 transition-colors hidden sm:block border border-transparent hover:border-white/10">
            <User className="w-6 h-6 text-text-primary" />
          </button>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
            <ShoppingCart className="w-6 h-6 text-text-primary" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime border-2 border-black"></span>
          </button>
          <button className="p-3 rounded-xl hover:bg-white/10 transition-colors md:hidden">
            <Menu className="w-6 h-6 text-text-primary" />
          </button>
        </div>
      </nav>

      {/* Bottom Sub-Nav (Categories) */}
      <div className="w-full px-4 md:px-8 py-3 flex items-center gap-8 overflow-x-auto no-scrollbar font-grotesk font-semibold text-text-secondary border-t border-white/5">
        <Link href="#" className="text-text-primary whitespace-nowrap hover:text-lime transition-colors">All</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">Art</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">Gaming</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">Memberships</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">PFPs</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">Photography</Link>
        <Link href="#" className="whitespace-nowrap hover:text-lime transition-colors">Music</Link>
      </div>
    </div>
  );
}
