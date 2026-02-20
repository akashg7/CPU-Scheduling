"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleTheme}
            className="fixed top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 dark:border-slate-600/80 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700/90 dark:hover:text-slate-200 dark:focus:ring-offset-slate-900"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            ) : (
              <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10} className="border-slate-200/80 bg-white/95 px-3 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-200">
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
