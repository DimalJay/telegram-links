import React from 'react';

export function Panel({ title, children }) {
  return (
    <article className="rounded-2xl border border-(--tg-border) bg-(--tg-surface) p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </article>
  );
}
