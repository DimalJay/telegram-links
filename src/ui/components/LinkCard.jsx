import React from 'react';
import { useAdultGate } from '../hooks/useAdultGate.js';

export function LinkCard({ item }) {
  const { confirmed, confirm } = useAdultGate();
  const isAdultLocked = Boolean(item?.adult) && !confirmed;

  return (
    <div
      className={
        isAdultLocked
          ? 'group relative overflow-hidden rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-4 shadow-sm'
          : 'group rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
      }
      role="listitem"
    >
      <div className={isAdultLocked ? 'flex items-start gap-3 blur-sm select-none pointer-events-none' : 'flex items-start gap-3'}>
        {item.logoUrl ? (
          <img
            className="h-11 w-11 flex-none rounded-xl border border-(--tg-border) bg-(--tg-card-hover) object-cover"
            src={item.logoUrl}
            alt={`${item.title} logo`}
            loading="lazy"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-(--tg-border) px-2 py-0.5 text-(--tg-muted)">{item.kind}</span>
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

          <p className="mt-2 text-sm text-(--tg-muted) wrap-break-word">{item.description ? item.description : item.url}</p>

          <div className="mt-3 flex gap-2">
            <a
              className="inline-flex items-center justify-center rounded-xl bg-(--tg-primary) px-4 py-2 text-sm font-semibold text-(--tg-primary-contrast) shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </a>
          </div>
        </div>
      </div>

      {isAdultLocked ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-4 text-center shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">18+ warning</p>
            <p className="mt-1 text-sm text-(--tg-muted)">This link is marked as adult content.</p>
            <p className="mt-1 text-sm text-(--tg-muted)">Confirm you’re 18+ to view it.</p>
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-(--tg-primary) px-4 py-2 text-sm font-semibold text-(--tg-primary-contrast) shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                onClick={confirm}
              >
                I am 18+
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
