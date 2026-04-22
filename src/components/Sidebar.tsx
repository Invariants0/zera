"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  Layers, 
  Activity, 
  LayoutDashboard, 
  Briefcase, 
  Bookmark, 
  ShieldCheck, 
  FileKey, 
  ArrowRightLeft, 
  PlusCircle, 
  FolderPlus, 
  SplitSquareHorizontal, 
  Rocket, 
  MonitorPlay, 
  User, 
  Settings, 
  Wallet 
} from "lucide-react";
import { cn } from "./ui/Button";

const navSections = [
  {
    title: "Marketplace",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Explore", href: "/explore", icon: Compass },
      { name: "Collections", href: "/collections", icon: Layers },
      { name: "Activity", href: "/activity", icon: Activity },
    ],
  },
  {
    title: "Tokenization",
    items: [
      { name: "Mint Asset", href: "/mint", icon: PlusCircle },
      { name: "Create Collection", href: "/create-collection", icon: FolderPlus },
      { name: "Fractionalize Asset", href: "/fractionalize", icon: SplitSquareHorizontal },
      { name: "Launch Drop", href: "/launch-drop", icon: Rocket },
      { name: "Creator Studio", href: "/creator-studio", icon: MonitorPlay },
    ],
  },
  {
    title: "Assets",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Assets", href: "/my-assets", icon: Briefcase },
      { name: "Watchlist", href: "/watchlist", icon: Bookmark },
    ],
  },
  {
    title: "Registry",
    items: [
      { name: "Verified Registry", href: "/registry", icon: ShieldCheck },
      { name: "Proof Logs", href: "/proof-logs", icon: FileKey },
      { name: "Transfer History", href: "/transfers", icon: ArrowRightLeft },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Wallet", href: "/wallet", icon: Wallet },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-obsidian_light border-r border-white/5 flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-lime flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-black font-bold text-lg font-grotesk tracking-tighter">Z</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-text-primary uppercase">ZERA</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-4 text-[10px] font-mono font-semibold text-text-muted uppercase tracking-widest mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-grotesk font-medium transition-colors",
                      isActive 
                        ? "bg-white/10 text-lime" 
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-lime" : "text-text-secondary")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Bottom */}
      <div className="p-6 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3 bg-obsidian rounded-xl p-3 border border-white/5">
           <div className="w-2 h-2 rounded-full bg-lime animate-pulse-fast"></div>
           <div className="flex flex-col">
             <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">System Status</span>
             <span className="font-mono text-xs text-lime">All Systems Operational</span>
           </div>
        </div>
      </div>
    </aside>
  );
}
