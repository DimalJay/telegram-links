import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Panel } from '../components/Panel.jsx';
import { LinkCard } from '../components/LinkCard.jsx';
import { useLinks } from '../hooks/useLinks.js';

function useQuery() {
  const ctx = useOutletContext();
  return ctx?.query ?? '';
}

export function ChannelsPage() {
  const query = useQuery();
  const links = useLinks({ type: 'channel', query });

  const trending = links.filter((x) => x.trending);
  const all = links.filter((x) => !x.trending);

  return (
    <section className="grid gap-4 py-6 lg:grid-cols-2">
      <Panel title="Trending Channels">
        <div className="grid gap-3 sm:grid-cols-2" role="list">
          {trending.length ? (
            trending.map((x) => <LinkCard key={x.id} item={x} />)
          ) : (
            <p className="text-sm text-(--tg-muted)">No links yet.</p>
          )}
        </div>
      </Panel>

      <Panel title="All Channels">
        <div className="grid gap-3 sm:grid-cols-2" role="list">
          {all.length ? all.map((x) => <LinkCard key={x.id} item={x} />) : <p className="text-sm text-(--tg-muted)">No links yet.</p>}
        </div>
      </Panel>
    </section>
  );
}
