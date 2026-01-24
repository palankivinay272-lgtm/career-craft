import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        // Check initial user preference or system setting
        const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle("light", storedTheme === "light");
        } else {
            // Default is dark as per current app design
            setTheme("dark");
            document.documentElement.classList.remove("light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("light", newTheme === "light");
        localStorage.setItem("theme", newTheme);
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
            {theme === "dark" ? (
                <Sun className="h-5 w-5 hover:text-yellow-400 transition-colors" />
            ) : (
                <Moon className="h-5 w-5 hover:text-purple-400 transition-colors" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
