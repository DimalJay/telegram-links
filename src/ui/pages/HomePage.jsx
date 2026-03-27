import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Panel } from '../components/Panel.jsx';
import { LinkCard } from '../components/LinkCard.jsx';
import { SkeletonCard } from '../components/SkeletonCard.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { useLinks } from '../hooks/useLinks.js';

function useQuery() {
  const ctx = useOutletContext();
  return ctx?.query ?? '';
}

export function HomePage() {
  const query = useQuery();
  const [tab, setTab] = React.useState('trending');

  const q = String(query ?? '').trim();
  const effectiveFilter = q ? undefined : tab;

  const [groupsPage, setGroupsPage] = React.useState(1);
  const [channelsPage, setChannelsPage] = React.useState(1);

  React.useEffect(() => {
    setGroupsPage(1);
    setChannelsPage(1);
  }, [tab, q]);

  const groupsLimit = 6;
  const channelsLimit = 6;

  const {
    items: groups,
    loading: groupsLoading,
    page: groupsPageCurrent,
    totalPages: groupsTotalPages,
  } = useLinks({ type: 'group', query: q, filter: effectiveFilter, page: groupsPage, limit: groupsLimit });

  const {
    items: channels,
    loading: channelsLoading,
    page: channelsPageCurrent,
    totalPages: channelsTotalPages,
  } = useLinks({ type: 'channel', query: q, filter: effectiveFilter, page: channelsPage, limit: channelsLimit });

  const groupsTitle = tab === 'trending' ? 'Trending Groups' : tab === 'latest' ? 'Latest Groups' : 'Hot Groups';
  const channelsTitle = tab === 'trending' ? 'Trending Channels' : tab === 'latest' ? 'Latest Channels' : 'Hot Channels';

  const groupPlaceholders = React.useMemo(() => Array.from({ length: groupsLimit }, (_, i) => i), [groupsLimit]);
  const channelPlaceholders = React.useMemo(() => Array.from({ length: channelsLimit }, (_, i) => i), [channelsLimit]);

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
              {groupsLoading ? (
                groupPlaceholders.map((i) => <SkeletonCard key={`g-skel-${i}`} />)
              ) : groups.length ? (
                groups.map((x) => <LinkCard key={x.id} item={x} />)
              ) : (
                <p className="text-sm text-(--tg-muted)">No links yet.</p>
              )}
            </div>

            <Pagination
              page={groupsPageCurrent}
              totalPages={groupsTotalPages}
              onPageChange={setGroupsPage}
              disabled={groupsLoading}
            />
          </Panel>

          <Panel title={channelsTitle}>
            <div className="grid gap-3 sm:grid-cols-3" role="list">
              {channelsLoading ? (
                channelPlaceholders.map((i) => <SkeletonCard key={`c-skel-${i}`} />)
              ) : channels.length ? (
                channels.map((x) => <LinkCard key={x.id} item={x} />)
              ) : (
                <p className="text-sm text-(--tg-muted)">No links yet.</p>
              )}
            </div>

            <Pagination
              page={channelsPageCurrent}
              totalPages={channelsTotalPages}
              onPageChange={setChannelsPage}
              disabled={channelsLoading}
            />
          </Panel>
        </div>
      </div>
    </section>
  );
}
