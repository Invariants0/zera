"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";

  return (
    <>
      {showSidebar && <Sidebar />}

      <div className={showSidebar ? "lg:pl-72 flex flex-col min-h-screen" : "flex flex-col min-h-screen"}>
        <TopBar />

        <main className="flex-1 w-full relative">{children}</main>
      </div>
    </>
  );
}
