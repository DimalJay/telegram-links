import React from 'react';
import {
  listChannels,
  listGroups,
  listTrendingChannels,
  listTrendingGroups,
  searchLinks,
  toUiItem,
} from '../../data/links.js';

export function useLinks(options) {
  const type = options?.type;
  const query = options?.query;

  const [links, setLinks] = React.useState([]);
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
        const q = String(query ?? '').trim();

        const shouldFetchGroups = type !== 'channel';
        const shouldFetchChannels = type !== 'group';

        const [trendingGroups, trendingChannels] = await Promise.all([
          shouldFetchGroups ? listTrendingGroups({ signal: controller.signal }) : Promise.resolve([]),
          shouldFetchChannels ? listTrendingChannels({ signal: controller.signal }) : Promise.resolve([]),
        ]);

        const trendingIds = new Set([
          ...trendingGroups.map((x) => String(x.id)),
          ...trendingChannels.map((x) => String(x.id)),
        ]);

        let items;
        if (q) {
          items = await searchLinks({ query: q, type, signal: controller.signal });
        } else if (type === 'group') {
          items = await listGroups({ signal: controller.signal });
        } else if (type === 'channel') {
          items = await listChannels({ signal: controller.signal });
        } else {
          const [groups, channels] = await Promise.all([
            listGroups({ signal: controller.signal }),
            listChannels({ signal: controller.signal }),
          ]);
          items = [...groups, ...channels];
        }

        const ui = items.map((x) => toUiItem(x, { trendingIds }));
        if (!cancelled) setLinks(ui);
      } catch (err) {
        if (cancelled) return;
        if (err?.name === 'AbortError') return;
        console.error(err);
        setLinks([]);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [type, query, refreshToken]);

  return links;
}
