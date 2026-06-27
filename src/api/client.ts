import { apiBaseUrl, API_PREFIX } from '../config/api';
import type { ApiProblem } from './types';
import { clearAuthSession, getAuthToken } from './authSession';

export class ApiError extends Error {
  status: number;
  problem?: ApiProblem;

  constructor(status: number, message: string, problem?: ApiProblem) {
    super(message);
    this.status = status;
    this.problem = problem;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let problem: ApiProblem | undefined;
  let message = res.statusText || 'Error de API';
  try {
    const data = (await res.json()) as ApiProblem;
    problem = data;
    if (data.detail) message = data.detail;
    else if (data.title) message = data.title;
    else if (data.errors) {
      const first = Object.values(data.errors)[0]?.[0];
      if (first) message = first;
    }
  } catch {
    try {
      message = await res.text();
    } catch {}
  }
  return new ApiError(res.status, message, problem);
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
  const base = `${apiBaseUrl()}${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

type RequestOpts = {
  method?: string;
  body?: BodyInit | null;
  auth?: boolean;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(path: string, opts: RequestOpts = {}, query?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.auth) {
    const token = getAuthToken();
    if (!token) {
      clearAuthSession();
      throw new ApiError(401, 'Sesión expirada');
    }
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(buildUrl(path, query), {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ?? null,
  });
  if (res.status === 401 && opts.auth) {
    clearAuthSession();
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function apiGet<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>, auth = false): Promise<T> {
  return apiRequest<T>(path, { auth }, query);
}

export async function apiPostJson<T>(path: string, body: unknown, auth = false): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    auth,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function apiPostForm<T>(path: string, form: FormData, auth = false): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body: form, auth });
}

export async function apiPutForm<T>(path: string, form: FormData, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: 'PUT', body: form, auth });
}

export async function apiDelete(path: string): Promise<void> {
  await apiRequest<void>(path, { method: 'DELETE', auth: true });
}

export async function apiPatch(path: string): Promise<void> {
  await apiRequest<void>(path, { method: 'PATCH', auth: true });
}

export async function fetchAllPages<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>,
  auth = false,
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const data = await apiGet<{ items: T[]; totalPages: number }>(path, { ...query, page, pageSize: 100 }, auth);
    out.push(...data.items);
    totalPages = data.totalPages;
    page += 1;
  }
  return out;
}
