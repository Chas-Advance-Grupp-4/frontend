import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme");
            return stored === "dark" || stored === "light" ? stored : "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return {theme, toggleTheme};
}