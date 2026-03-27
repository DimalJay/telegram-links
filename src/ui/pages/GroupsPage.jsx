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

export function GroupsPage() {
  const query = useQuery();
  const [tab, setTab] = React.useState('trending');

  const q = String(query ?? '').trim();
  const effectiveFilter = q ? undefined : tab;

  const [page, setPage] = React.useState(1);
  React.useEffect(() => setPage(1), [tab, q]);

  const limit = 10;
  const { items, loading, page: pageCurrent, totalPages } = useLinks({
    type: 'group',
    query: q,
    filter: effectiveFilter,
    page,
    limit,
  });

  const title = tab === 'trending' ? 'Trending Groups' : tab === 'latest' ? 'Latest Groups' : 'Hot Groups';

  const placeholders = React.useMemo(() => Array.from({ length: limit }, (_, i) => i), [limit]);

  return (
    <section className="py-6">
      <h1 className="sr-only">Telegram Groups</h1>
      <div className="max-w-full overflow-x-auto">
        <div
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-1"
          role="tablist"
          aria-label="Groups tabs"
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
        <Panel title={title}>
          <div className="grid gap-3 sm:grid-cols-2" role="list">
            {loading ? (
              placeholders.map((i) => <SkeletonCard key={`g-skel-${i}`} />)
            ) : items.length ? (
              items.map((x) => <LinkCard key={x.id} item={x} />)
            ) : (
              <p className="text-sm text-(--tg-muted)">No links yet.</p>
            )}
          </div>

          <Pagination page={pageCurrent} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
        </Panel>
      </div>
    </section>
  );
}
