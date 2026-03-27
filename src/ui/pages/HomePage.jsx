import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Panel } from '../components/Panel.jsx';
import { LinkCard } from '../components/LinkCard.jsx';
import { SkeletonCard } from '../components/SkeletonCard.jsx';
import { useLinks } from '../hooks/useLinks.js';

function useQuery() {
  const ctx = useOutletContext();
  return ctx?.query ?? '';
}

function sortLatest(items) {
  return [...items].sort((a, b) => {
    const at = Date.parse(String(a?.createdAt ?? ''));
    const bt = Date.parse(String(b?.createdAt ?? ''));
    return (Number.isFinite(bt) ? bt : 0) - (Number.isFinite(at) ? at : 0);
  });
}

function sortBest(items) {
  return [...items].sort((a, b) => String(a.title ?? '').localeCompare(String(b.title ?? '')));
}

export function HomePage() {
  const query = useQuery();
  const { items: links, loading } = useLinks({ query });

  const [tab, setTab] = React.useState('trending');

  const allGroups = links.filter((x) => x.kind === 'group');
  const allChannels = links.filter((x) => x.kind === 'channel');

  const groups =
    tab === 'trending'
      ? allGroups.filter((x) => x.trending)
      : tab === 'latest'
        ? sortLatest(allGroups)
        : sortBest(allGroups);

  const channels =
    tab === 'trending'
      ? allChannels.filter((x) => x.trending)
      : tab === 'latest'
        ? sortLatest(allChannels)
        : sortBest(allChannels);

  const groupsTitle = tab === 'trending' ? 'Trending Groups' : tab === 'latest' ? 'Latest Groups' : 'Hot Groups';
  const channelsTitle = tab === 'trending' ? 'Trending Channels' : tab === 'latest' ? 'Latest Channels' : 'Hot Channels';

  const placeholders = React.useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  return (
    <section className="py-6">
      <h1 className="sr-only">Top Telegram Links</h1>
      <div className="max-w-full overflow-x-auto">
        <div
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-1"
          role="tablist"
          aria-label="Home tabs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'trending'}
            className={
              tab === 'trending'
                ? 'rounded-xl bg-(--tg-card-hover) px-4 py-2 text-sm font-semibold text-(--tg-text)'
                : 'rounded-xl px-4 py-2 text-sm font-semibold text-(--tg-muted) hover:bg-(--tg-card-hover)'
            }
            onClick={() => setTab('trending')}
          >
            Trending
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'latest'}
            className={
              tab === 'latest'
                ? 'rounded-xl bg-(--tg-card-hover) px-4 py-2 text-sm font-semibold text-(--tg-text)'
                : 'rounded-xl px-4 py-2 text-sm font-semibold text-(--tg-muted) hover:bg-(--tg-card-hover)'
            }
            onClick={() => setTab('latest')}
          >
            Latest
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'hot'}
            className={
              tab === 'hot'
                ? 'rounded-xl bg-(--tg-card-hover) px-4 py-2 text-sm font-semibold text-(--tg-text)'
                : 'rounded-xl px-4 py-2 text-sm font-semibold text-(--tg-muted) hover:bg-(--tg-card-hover)'
            }
            onClick={() => setTab('hot')}
          >
            Hot
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="grid gap-4">
          <Panel title={groupsTitle}>
            <div className="grid gap-3 sm:grid-cols-3" role="list">
              {loading ? (
                placeholders.map((i) => <SkeletonCard key={`g-skel-${i}`} />)
              ) : groups.length ? (
                groups.map((x) => <LinkCard key={x.id} item={x} />)
              ) : (
                <p className="text-sm text-(--tg-muted)">No links yet.</p>
              )}
            </div>
          </Panel>

          <Panel title={channelsTitle}>
            <div className="grid gap-3 sm:grid-cols-3" role="list">
              {loading ? (
                placeholders.map((i) => <SkeletonCard key={`c-skel-${i}`} />)
              ) : channels.length ? (
                channels.map((x) => <LinkCard key={x.id} item={x} />)
              ) : (
                <p className="text-sm text-(--tg-muted)">No links yet.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
