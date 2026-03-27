import React from 'react';

export function Pagination({ page, totalPages, onPageChange, disabled }) {
  const p = Number(page) || 1;
  const tp = Math.max(1, Number(totalPages) || 1);

  if (tp <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-(--tg-muted)">
        Page <span className="font-semibold text-(--tg-text)">{p}</span> of{' '}
        <span className="font-semibold text-(--tg-text)">{tp}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 text-sm font-semibold hover:bg-(--tg-card-hover) disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, p - 1))}
          disabled={disabled || p <= 1}
        >
          Prev
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 text-sm font-semibold hover:bg-(--tg-card-hover) disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(Math.min(tp, p + 1))}
          disabled={disabled || p >= tp}
        >
          Next
        </button>
      </div>
    </div>
  );
}
