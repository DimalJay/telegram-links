import React from 'react';

export function LinkCard({ item }) {
  return (
    <div
      className="group rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      role="listitem"
    >
      <div className="flex items-start gap-3">
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
            {item.trending ? (
              <span className="rounded-full border border-(--tg-border) bg-(--tg-card-hover) px-2 py-0.5 font-semibold text-(--tg-primary)">
                trending
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-(--tg-muted) break-words">{item.description ? item.description : item.url}</p>

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
    </div>
  );
}
