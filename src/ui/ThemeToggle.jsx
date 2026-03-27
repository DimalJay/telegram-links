import React from 'react';

const THEME_KEY = 'top-telegram-links.theme.v1';

function getPreferredTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return getPreferredTheme();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme() {
  React.useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState(() => getInitialTheme());

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      className="inline-flex items-center gap-2 rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 text-sm font-semibold hover:bg-(--tg-card-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <span className="text-(--tg-muted)">{isDark ? 'Dark' : 'Light'}</span>
      <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-(--tg-border)">
        <span
          className="absolute left-0.5 h-4 w-4 rounded-full bg-(--tg-primary) transition-transform"
          style={{ transform: isDark ? 'translateX(1rem)' : 'translateX(0)' }}
        />
      </span>
    </button>
  );
}
