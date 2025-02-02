// components/theme-select.tsx
"use client";

import { useTheme } from "@/components/theme/Theme-Provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  // Current theme icon component
  const CurrentThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "dark":
        return <Moon className="h-4 w-4 text-blue-400" />;
      default:
        return <Monitor className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
      <SelectTrigger className="rounded-full bg-background px-4 py-2 shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/90">
        <div className="flex items-center gap-2">
          <CurrentThemeIcon />
          {/* <SelectValue placeholder="Select theme" /> */}
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <SelectItem
          value="light"
          className="hover:bg-gray-50 dark:hover:bg-zinc-700/50"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-900 dark:text-gray-100">Light</span>
          </div>
        </SelectItem>

        <SelectItem
          value="dark"
          className="hover:bg-gray-50 dark:hover:bg-zinc-700/50"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-400" />
            <span className="text-gray-900 dark:text-gray-100">Dark</span>
          </div>
        </SelectItem>

        <SelectItem
          value="system"
          className="hover:bg-gray-50 dark:hover:bg-zinc-700/50"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-gray-900 dark:text-gray-100">System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
