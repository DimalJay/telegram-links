import React from 'react';
import { createLink, isTelegramUrl } from '../data/links.js';

export function SubmitDialog({ open, onClose }) {
  const dialogRef = React.useRef(null);
  const formRef = React.useRef(null);
  const [hint, setHint] = React.useState('');

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setHint('');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!isInDialog) handleClose();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    formRef.current = form;
    const fd = new FormData(form);

    const title = String(fd.get('title') ?? '').trim();
    const url = String(fd.get('url') ?? '').trim();
    const kind = String(fd.get('kind') ?? 'group');
    const description = String(fd.get('description') ?? '').trim();
    const isAdultOnly = fd.get('adult') === 'on';

    if (!title || !url) return;
    if (kind !== 'group' && kind !== 'channel') return;

    if (!isTelegramUrl(url)) {
      setHint('Please enter a valid Telegram link (t.me / telegram.me).');
      return;
    }

    try {
      await createLink({
        name: title,
        description: description || title,
        category: 'General',
        isAdultOnly,
        type: kind,
        link: url,
        country: 'Global',
      });

      form.reset();
      setHint('Added.');
      window.dispatchEvent(new Event('links-updated'));
      handleClose();
    } catch (err) {
      if (err?.status === 409) {
        setHint('That link already exists.');
        return;
      }
      setHint(err?.message ? String(err.message) : 'Failed to submit.');
    }
  };

  const onClear = () => {
    const form = formRef.current;
    if (form && typeof form.reset === 'function') form.reset();
    setHint('Cleared.');
  };

  return (
    <dialog ref={dialogRef} id="submit-dialog" aria-labelledby="submit-title" onClick={handleBackdropClick} onClose={handleClose}>
      <div className="w-[min(720px,calc(100vw-2rem))]">
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <h2 id="submit-title" className="text-lg font-semibold tracking-tight">
              Submit a Link
            </h2>
            <p className="mt-1 text-sm text-(--tg-muted)">Add a group or channel link.</p>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--tg-border) hover:bg-(--tg-card-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
            type="button"
            aria-label="Close"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-5">
          <form className="grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-1">
              <span className="text-sm text-(--tg-muted)">Title</span>
              <input
                className="w-full rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                name="title"
                type="text"
                required
                maxLength={80}
                autoComplete="off"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-(--tg-muted)">Telegram link (t.me / telegram.me)</span>
              <input
                className="w-full rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                name="url"
                type="url"
                required
                placeholder="https://t.me/your_link"
                inputMode="url"
                autoComplete="off"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-(--tg-muted)">Type</span>
              <select
                className="w-full rounded-xl border border-(--tg-border) bg-(--tg-surface) px-3 py-2 text-(--tg-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                name="kind"
                required
              >
                <option value="group">Group</option>
                <option value="channel">Channel</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-(--tg-muted)">Short description (optional)</span>
              <input
                className="w-full rounded-xl border border-(--tg-border) bg-transparent px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                name="description"
                type="text"
                maxLength={140}
                autoComplete="off"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-(--tg-border) bg-(--tg-surface) px-3 py-3">
              <input
                className="h-4 w-4 accent-(--tg-primary)"
                name="adult"
                type="checkbox"
              />
              <span className="text-sm text-(--tg-text)">18+ content</span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex items-center justify-center rounded-xl bg-(--tg-primary) px-4 py-2 text-sm font-semibold text-(--tg-primary-contrast) shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                type="submit"
              >
                Add
              </button>
              <button
                className="inline-flex items-center justify-center rounded-xl border border-(--tg-border) bg-transparent px-4 py-2 text-sm font-semibold hover:bg-(--tg-card-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--tg-primary)"
                type="button"
                onClick={onClear}
              >
                Clear my submissions
              </button>
              <p className="text-sm text-(--tg-muted)" role="status" aria-live="polite">
                {hint}
              </p>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
