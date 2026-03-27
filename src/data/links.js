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

function withPagination(path, { page, limit }) {
  const sp = new URLSearchParams();
  sp.set('page', String(page));
  sp.set('limit', String(limit));
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${sp.toString()}`;
}

export async function apiGetPaginated(path, { page = 1, limit = 12, signal } = {}) {
  const data = await apiGet(withPagination(path, { page, limit }), { signal });

  if (isPaginatedResponse(data)) {
    return {
      items: Array.isArray(data.items) ? data.items : [],
      page: data.page,
      totalPages: data.totalPages,
      totalItems: typeof data.totalItems === 'number' ? data.totalItems : undefined,
    };
  }

  // Fallback: treat an array response as a single page.
  if (Array.isArray(data)) {
    return {
      items: data,
      page: 1,
      totalPages: 1,
      totalItems: data.length,
    };
  }

  return { items: [], page: 1, totalPages: 1, totalItems: 0 };
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

export async function listGroupsPage({ page = 1, limit = 12, signal } = {}) {
  return apiGetPaginated('/api/groups', { page, limit, signal });
}

export async function listChannels({ signal } = {}) {
  const items = await apiGetAllPages('/api/channels', { signal });
  return Array.isArray(items) ? items : [];
}

export async function listChannelsPage({ page = 1, limit = 12, signal } = {}) {
  return apiGetPaginated('/api/channels', { page, limit, signal });
}

export async function listTrendingGroups({ filter, page = 1, limit = 10, signal } = {}) {
  const sp = new URLSearchParams();
  if (filter === 'trending' || filter === 'latest' || filter === 'hot') sp.set('filter', filter);
  sp.set('page', String(page));
  sp.set('limit', String(limit));
  const data = await apiGet(`/api/trending/groups?${sp.toString()}`, { signal });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function listTrendingGroupsPage({ filter, page = 1, limit = 12, signal } = {}) {
  const sp = new URLSearchParams();
  if (filter === 'trending' || filter === 'latest' || filter === 'hot') sp.set('filter', filter);
  return apiGetPaginated(`/api/trending/groups?${sp.toString()}`, { page, limit, signal });
}

export async function listTrendingChannels({ filter, page = 1, limit = 10, signal } = {}) {
  const sp = new URLSearchParams();
  if (filter === 'trending' || filter === 'latest' || filter === 'hot') sp.set('filter', filter);
  sp.set('page', String(page));
  sp.set('limit', String(limit));
  const data = await apiGet(`/api/trending/channels?${sp.toString()}`, { signal });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function listTrendingChannelsPage({ filter, page = 1, limit = 12, signal } = {}) {
  const sp = new URLSearchParams();
  if (filter === 'trending' || filter === 'latest' || filter === 'hot') sp.set('filter', filter);
  return apiGetPaginated(`/api/trending/channels?${sp.toString()}`, { page, limit, signal });
}

export async function searchLinks({ query, type, signal } = {}) {
  const q = String(query ?? '').trim();
  const sp = new URLSearchParams();
  sp.set('query', q);
  if (type === 'group' || type === 'channel') sp.set('type', type);
  const items = await apiGetAllPages(`/api/search?${sp.toString()}`, { signal });
  return Array.isArray(items) ? items : [];
}

export async function searchLinksPage({ query, type, page = 1, limit = 12, signal } = {}) {
  const q = String(query ?? '').trim();
  const sp = new URLSearchParams();
  sp.set('query', q);
  if (type === 'group' || type === 'channel') sp.set('type', type);
  return apiGetPaginated(`/api/search?${sp.toString()}`, { page, limit, signal });
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
  const adult = Boolean(apiItem?.isAdultOnly ?? apiItem?.isAdult ?? apiItem?.adult ?? apiItem?.adultOnly);
  return {
    id,
    title: String(apiItem?.name ?? ''),
    url: String(apiItem?.link ?? ''),
    kind,
    trending: Boolean(trendingIds?.has?.(id)),
    adult,
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
