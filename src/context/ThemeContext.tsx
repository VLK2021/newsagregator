"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    // Ініціалізація теми
    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null;

        if (saved) {
            setTheme(saved);
            document.documentElement.classList.add(saved);
        } else {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = systemDark ? "dark" : "light";

            setTheme(initial);
            document.documentElement.classList.add(initial);
        }
    }, []);

    // Синхронізація теми
    useEffect(() => {
        localStorage.setItem("theme", theme);

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};