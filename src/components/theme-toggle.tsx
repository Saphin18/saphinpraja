import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/65 bg-card text-muted-foreground transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/65 bg-card text-muted-foreground transition-colors hover:border-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-accent transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-primary transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
