import React from 'react';

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-4 shadow-sm" role="listitem" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="tg-skeleton h-11 w-11 flex-none rounded-xl border border-(--tg-border)" />

        <div className="min-w-0 flex-1">
          <div className="tg-skeleton h-4 w-2/3 rounded-lg" />

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="tg-skeleton h-5 w-16 rounded-full border border-(--tg-border)" />
            <div className="tg-skeleton h-5 w-20 rounded-full border border-(--tg-border)" />
          </div>

          <div className="mt-3 grid gap-2">
            <div className="tg-skeleton h-3 w-full rounded-lg" />
            <div className="tg-skeleton h-3 w-5/6 rounded-lg" />
          </div>

          <div className="mt-4 tg-skeleton h-9 w-24 rounded-xl border border-(--tg-border)" />
        </div>
      </div>
    </div>
  );
}
