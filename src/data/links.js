const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  const body = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

function isPaginatedResponse(body) {
  return (
    body &&
    typeof body === 'object' &&
    Array.isArray(body.items) &&
    typeof body.page === 'number' &&
    typeof body.totalPages === 'number'
  );
}

async function apiGetAllPages(path, { signal, limit = 100 } = {}) {
  const items = [];
  let page = 1;

  while (true) {
    const sp = new URLSearchParams();
    sp.set('page', String(page));
    sp.set('limit', String(limit));

    const separator = path.includes('?') ? '&' : '?';
    const data = await apiGet(`${path}${separator}${sp.toString()}`, { signal });

    if (Array.isArray(data?.items)) {
      items.push(...data.items);
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return items;
    }

    if (!isPaginatedResponse(data) || page >= data.totalPages) break;
    page += 1;
  }

  return items;
}

async function apiPost(path, data, { signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
    signal,
  });

  const body = await parseJsonResponse(res);
  if (!res.ok) {
    if (res.status === 409) {
      const err = new Error(body?.error || 'duplicate link');
      err.status = 409;
      err.existing = body?.existing ?? null;
      throw err;
    }
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export async function listGroups({ signal } = {}) {
  const items = await apiGetAllPages('/api/groups', { signal });
  return Array.isArray(items) ? items : [];
}

export async function listChannels({ signal } = {}) {
  const items = await apiGetAllPages('/api/channels', { signal });
  return Array.isArray(items) ? items : [];
}

export async function listTrendingGroups({ signal } = {}) {
  const data = await apiGet('/api/trending/groups?page=1&limit=10', { signal });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function listTrendingChannels({ signal } = {}) {
  const data = await apiGet('/api/trending/channels?page=1&limit=10', { signal });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function searchLinks({ query, type, signal } = {}) {
  const q = String(query ?? '').trim();
  const sp = new URLSearchParams();
  sp.set('query', q);
  if (type === 'group' || type === 'channel') sp.set('type', type);
  const items = await apiGetAllPages(`/api/search?${sp.toString()}`, { signal });
  return Array.isArray(items) ? items : [];
}

export async function createLink(input, { signal } = {}) {
  const data = await apiPost('/api/links', input, { signal });
  return data?.item ?? null;
}

export function toUiItem(apiItem, { trendingIds } = {}) {
  const id = String(apiItem?.id ?? '');
  const kind = apiItem?.type === 'group' || apiItem?.type === 'channel' ? apiItem.type : 'group';
  const rawLogoUrl = typeof apiItem?.logoUrl === 'string' ? apiItem.logoUrl : '';
  const logoUrl = rawLogoUrl ? `${API_BASE_URL}${rawLogoUrl.startsWith('/') ? '' : '/'}${rawLogoUrl}` : undefined;
  return {
    id,
    title: String(apiItem?.name ?? ''),
    url: String(apiItem?.link ?? ''),
    kind,
    trending: Boolean(trendingIds?.has?.(id)),
    description: apiItem?.description ? String(apiItem.description) : undefined,
    createdAt: apiItem?.createdAt ? String(apiItem.createdAt) : undefined,
    hasLogo: Boolean(apiItem?.hasLogo),
    logoUrl,
  };
}

export function isTelegramUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return host === 't.me' || host === 'telegram.me' || host.endsWith('.t.me');
  } catch {
    return false;
  }
}
