import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listGroups, listChannels, toUiItem } from '../../data/links.js';
import { Panel } from '../components/Panel.jsx';

export function ItemDetailsPage({ type }) {
  const { id } = useParams();
  const [item, setItem] = useState(() => {
    if (typeof window !== 'undefined' && window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.id === id) {
      return toUiItem(window.__PRELOADED_STATE__);
    }
    return null;
  });
  const [loading, setLoading] = useState(!item);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item && item.id === id) return;

    setLoading(true);
    const fetchItem = async () => {
      try {
        const fetchFunc = type === 'channel' ? listChannels : listGroups;
        const items = await fetchFunc();
        const found = items.find(i => i.id === id);
        if (found) {
          setItem(toUiItem(found));
        } else {
          setError('Not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, type, item]);

  if (loading) {
    return (
      <section className="py-6">
        <Panel>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-(--tg-card-hover) h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-(--tg-card-hover) rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-(--tg-card-hover) rounded"></div>
                <div className="h-4 bg-(--tg-card-hover) rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="py-6 text-center">
        <h2 className="text-xl font-bold mb-2">Item not found</h2>
        <p className="text-(--tg-muted)">{error}</p>
        <Link to="/" className="mt-4 inline-block text-(--tg-primary) hover:underline">
          &larr; Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="mb-4 text-sm text-(--tg-muted) flex items-center gap-2">
        <Link to="/" className="hover:text-(--tg-text)">Home</Link>
        <span>&rsaquo;</span>
        <Link to={`/${type}s`} className="hover:text-(--tg-text) capitalize">{type}s</Link>
        <span>&rsaquo;</span>
        <span className="text-(--tg-text) truncate" style={{maxWidth: '200px'}}>{item.title}</span>
      </div>

      <div className="bg-(--tg-surface) border border-(--tg-border) rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          {item.logoUrl ? (
            <img
              className="h-24 w-24 sm:h-32 sm:w-32 flex-none rounded-2xl border border-(--tg-border) bg-(--tg-card-hover) object-cover shadow-sm"
              src={item.logoUrl}
              alt={`${item.title} logo`}
            />
          ) : (
            <div className="h-24 w-24 sm:h-32 sm:w-32 flex-none rounded-2xl border border-(--tg-border) bg-(--tg-card-hover) flex items-center justify-center text-4xl text-(--tg-muted)">
              {item.title.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{item.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
              <span className="rounded-full border border-(--tg-border) px-2 py-0.5 text-(--tg-muted) capitalize">{item.kind}</span>
              {item.adult ? (
                <span className="rounded-full border border-red-300 bg-red-50 px-2 py-0.5 font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                  18+ warning
                </span>
              ) : null}
              {item.trending ? (
                <span className="rounded-full border border-(--tg-border) bg-(--tg-card-hover) px-2 py-0.5 font-semibold text-(--tg-primary)">
                  trending
                </span>
              ) : null}
            </div>

            <p className="text-base text-(--tg-muted) whitespace-pre-wrap leading-relaxed mb-6">
              {item.description || "No description provided."}
            </p>

            <div className="flex gap-4">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-(--tg-primary) px-6 py-3 text-base font-semibold text-(--tg-primary-contrast) shadow-sm hover:opacity-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join {item.kind === 'channel' ? 'Channel' : 'Group'} &nearr;
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-(--tg-border)">
              <p className="text-sm font-semibold mb-3">Share this {item.kind}:</p>
              <div className="flex gap-3">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(`https://top-telegram-links.web.app/${type}/${item.id}`)}&text=${encodeURIComponent(`Check out ${item.title} on Top Telegram Links!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0088cc] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  Telegram
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${item.title} on Top Telegram Links! https://top-telegram-links.web.app/${type}/${item.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://top-telegram-links.web.app/${type}/${item.id}`)}&text=${encodeURIComponent(`Check out ${item.title} Telegram ${item.kind}!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Post on X
                </a>
              </div>
            </div>

            {item.createdAt && (
              <p className="mt-6 text-xs text-(--tg-muted)">
                Added on: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
