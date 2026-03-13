"use client";

import Image from "next/image";
import LangSwitcher from "@/components/LangSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function HeaderComponent() {
    return (
        <header
            className="
      w-full sticky top-0 z-50
      border-b border-[var(--color-border)]
      bg-[var(--color-background)]
      text-[var(--color-text)]
      transition-theme
    "
        >
            <div
                className="
        max-w-7xl mx-auto
        flex items-center justify-between
        px-4 py-3
      "
            >
                {/* LEFT - LOGO */}
                <div className="flex items-center gap-3">
                    <div
                        className="
            w-9 h-9
            rounded-lg
            bg-[var(--color-brand)]
            flex items-center justify-center
            text-white font-bold
          "
                    >
                        N
                    </div>

                    {/* hidden on mobile */}
                    <span className="hidden sm:block font-semibold text-lg">
            News
          </span>
                </div>

                {/* CENTER - TITLE */}
                <div
                    className="
          absolute left-1/2 -translate-x-1/2
          text-base sm:text-lg font-semibold
          pointer-events-none
        "
                >
                    News Aggregator
                </div>

                {/* RIGHT - CONTROLS */}
                <div className="flex items-center gap-3">
                    <LangSwitcher />
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}