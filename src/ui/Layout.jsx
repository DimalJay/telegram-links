import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle, useTheme } from './ThemeToggle.jsx';
import { SubmitDialog } from './SubmitDialog.jsx';

export function Layout() {
  const location = useLocation();
  const [query, setQuery] = React.useState('');
  const [isSubmitOpen, setIsSubmitOpen] = React.useState(false);

  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const isGroups = location.pathname.startsWith('/groups');
  const isChannels = location.pathname.startsWith('/channels');

  // Keep the last search query across pages.
  React.useEffect(() => {
    // no-op; state persists in layout route
  }, [location.pathname]);

  useTheme(); // initialize theme on first mount

  return (
    <div className="min-h-dvh">
      <header className="border-b border-(--tg-border) bg-(--tg-surface) py-4 sm:py-5">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <NavLink
                className="max-w-[min(70vw,16rem)] truncate text-xl font-semibold tracking-tight text-(--tg-text) no-underline sm:max-w-none sm:text-2xl"
                to="/"
              >
                Top Telegram Links
              </NavLink>
              <nav className="flex items-center gap-3 text-sm">
                <NavLink
                  to="/"
                  className={isHome ? 'font-semibold text-(--tg-text)' : 'text-(--tg-primary)'}
                  end
                >
                  Home
                </NavLink>
                <NavLink
                  to="/groups"
                  className={isGroups ? 'font-semibold text-(--tg-text)' : 'text-(--tg-primary)'}
                >
                  Groups
                </NavLink>
                <NavLink
                  to="/channels"
                  className={isChannels ? 'font-semibold text-(--tg-text)' : 'text-(--tg-primary)'}
                >
                  Channels
                </NavLink>
              </nav>
            </div>
            <p className="mt-1 text-sm text-(--tg-muted)">Groups, channels, and what’s trending right now.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden sm:block">
              <span className="sr-only">Search</span>
              <input
                className="w-[min(360px,40vw)] rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                type="search"
                placeholder={
                  location.pathname.startsWith('/groups')
                    ? 'Search groups…'
                    : location.pathname.startsWith('/channels')
                      ? 'Search channels…'
                      : 'Search links…'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </label>

            <ThemeToggle />

            <button
              className="inline-flex items-center justify-center rounded-xl bg-(--tg-primary) px-4 py-2 text-sm font-semibold text-(--tg-primary-contrast) shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
              type="button"
              onClick={() => setIsSubmitOpen(true)}
              aria-label="Submit a Telegram link"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pt-3 sm:hidden">
          <input
            className="w-full rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
            type="search"
            placeholder={
              location.pathname.startsWith('/groups')
                ? 'Search groups…'
                : location.pathname.startsWith('/channels')
                  ? 'Search channels…'
                  : 'Search links…'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4">
        <Outlet context={{ query }} />
      </main>

      <footer className="border-t border-(--tg-border) py-7">
        <div className="mx-auto w-full max-w-6xl px-4">
          <small>Top Telegram Links • Simple directory</small>
        </div>
      </footer>

      <SubmitDialog open={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </div>
  );
}
