"use client";

import { X } from "lucide-react";
import Sidebar from "./Sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B0F14] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#121821] text-zinc-400 hover:text-zinc-100 border border-[#1E2638] focus:outline-none z-20"
          aria-label="Close mobile menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar content */}
        <Sidebar onNavClick={onClose} />
      </div>
    </div>
  );
}
