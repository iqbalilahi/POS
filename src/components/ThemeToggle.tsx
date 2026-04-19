import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
