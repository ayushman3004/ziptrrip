import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle — toggles between light and dark mode by setting
 * the data-theme attribute on <html> and persisting to localStorage.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      id="theme-toggle-btn"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
