"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F14] text-zinc-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Responsive Mobile Drawer Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenMobileMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#0B0F14] focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
