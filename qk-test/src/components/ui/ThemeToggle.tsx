'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ name, icon: Icon, label }) => (
        <motion.button
          key={name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(name)}
          className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            theme === name
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="w-4 h-4" />
          {theme === name && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-blue-500 rounded-md -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
