import React from 'react';
import {
  listTrendingChannels,
  listTrendingGroups,
  listTrendingChannelsPage,
  listTrendingGroupsPage,
  listChannelsPage,
  listGroupsPage,
  searchLinksPage,
  toUiItem,
} from '../../data/links.js';

export function useLinks(options) {
  const type = options?.type;
  const query = options?.query;
  const filter = options?.filter;
  const page = Number(options?.page ?? 1) || 1;
  const limit = Number(options?.limit ?? 12) || 12;

  const [links, setLinks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [meta, setMeta] = React.useState({ page: 1, totalPages: 1, totalItems: undefined });
  const [refreshToken, setRefreshToken] = React.useState(0);

  React.useEffect(() => {
    const onUpdated = () => setRefreshToken((x) => x + 1);
    window.addEventListener('links-updated', onUpdated);
    return () => window.removeEventListener('links-updated', onUpdated);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const q = String(query ?? '').trim();

        const shouldFetchGroups = type !== 'channel';
        const shouldFetchChannels = type !== 'group';

        const [trendingGroups, trendingChannels] = await Promise.all([
          shouldFetchGroups ? listTrendingGroups({ filter: 'trending', limit: 10, signal: controller.signal }) : Promise.resolve([]),
          shouldFetchChannels ? listTrendingChannels({ filter: 'trending', limit: 10, signal: controller.signal }) : Promise.resolve([]),
        ]);

        const trendingIds = new Set([
          ...trendingGroups.map((x) => String(x.id)),
          ...trendingChannels.map((x) => String(x.id)),
        ]);

        if (type !== 'group' && type !== 'channel') {
          throw new Error('useLinks now requires type="group" or type="channel" for paginated lists');
        }

        let paged;
        if (q) {
          paged = await searchLinksPage({ query: q, type, page, limit, signal: controller.signal });
        } else if (filter === 'trending' || filter === 'latest' || filter === 'hot') {
          paged =
            type === 'group'
              ? await listTrendingGroupsPage({ filter, page, limit, signal: controller.signal })
              : await listTrendingChannelsPage({ filter, page, limit, signal: controller.signal });
        } else {
          paged =
            type === 'group'
              ? await listGroupsPage({ page, limit, signal: controller.signal })
              : await listChannelsPage({ page, limit, signal: controller.signal });
        }

        if ((filter === 'trending' || filter === 'latest' || filter === 'hot') && !q) {
          for (const x of paged.items ?? []) trendingIds.add(String(x?.id ?? ''));
        }

        const ui = (paged.items ?? []).map((x) => toUiItem(x, { trendingIds }));
        if (!cancelled) {
          setLinks(ui);
          setMeta({
            page: Number(paged.page) || 1,
            totalPages: Number(paged.totalPages) || 1,
            totalItems: typeof paged.totalItems === 'number' ? paged.totalItems : undefined,
          });
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err?.name === 'AbortError') return;
        console.error(err);
        setLinks([]);
        setMeta({ page: 1, totalPages: 1, totalItems: undefined });
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [type, query, filter, page, limit, refreshToken]);

  return { items: links, loading, ...meta };
}
