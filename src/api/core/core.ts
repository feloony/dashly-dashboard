import { deepmerge } from 'deepmerge-ts';

export const orgin = 'http://localhost:3000';

export type ReturnOptions<T> = Options & {
  allowed?: {
    [status: number]: (res: Response) => T;
  };
};

export type Options = {
  origin?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  contentType?: 'application/json';
  body?: string | FormData;
  errorOnFail?: boolean;
  init?: RequestInit;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function callDefault(url: string, init?: Options) {
  const options = init ?? {};
  const request = await parseOptions(url, options);
  return fetch(request.url, request.request).then((response) => handle(response, options));
}

export async function callReturn<T>(url: string, init?: ReturnOptions<T>): Promise<T> {
  const options = init ?? {};
  const request = await parseOptions(url, options);
  return fetch(request.url, request.request).then((response) =>
    handleResult<T>(response, options, (res) => res.json())
  );
}

async function handleResult<T>(
  res: Response,
  options: ReturnOptions<T>,
  mapper: (res: Response) => Promise<T>
): Promise<T> {
  if (!res.ok) {
    const allowedResult = options.allowed?.[res.status];
    if (allowedResult) return allowedResult(res);
    await handleError(res, options);
  }

  return mapper(res);
}

async function handle(res: Response, options: Options) {
  await handleError(res, options);
  return res;
}

async function handleError(res: Response, options: Options) {
  if (!res.ok && (options.errorOnFail ?? true)) {
    throw new ApiError(await readErrorMessage(res), res.status);
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  let body = '';

  try {
    body = await res.text();
  } catch {
    // Use the HTTP status as a useful fallback when the response body is unreadable.
  }

  if (body.trim()) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed === 'object') {
        const record = parsed as Record<string, unknown>;
        const message = record.message ?? record.error ?? record.detail;
        if (typeof message === 'string' && message.trim()) return message;
      }
    } catch {
      // Non-JSON error bodies (such as proxy HTML) are valid failure responses too.
    }

    // Avoid flooding the UI with a full HTML error page.
    return body.trim().replace(/\s+/g, ' ').slice(0, 300);
  }

  return `Request failed (${res.status}${res.statusText ? `: ${res.statusText}` : ''})`;
}

async function parseOptions<T extends Options>(url: string, options: T) {
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const request: RequestInit = {
    method: options.method,
    body: options.body,
    headers: {
      ...(!isForm && { 'Content-Type': options.contentType ?? 'application/json' }),
    },
  };

  return {
    url: options.origin == null ? url : `${options.origin}${url}`,
    request: deepmerge(request, options.init),
  };
}
