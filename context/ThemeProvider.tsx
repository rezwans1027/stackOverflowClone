"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
    mode: string;
    setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined >(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    const handleThemeChange = () => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!("theme" in localStorage)) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setMode('dark');
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                setMode('light');
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    };

    useEffect(() => {
        handleThemeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
