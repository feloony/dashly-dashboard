import { discord } from 'api/discord';
import { bot } from 'api/bot';
import { Options } from './core';

/** Session-scoped token storage; the backend should prefer secure HttpOnly cookies when possible. */
export const SessionTokenStorage = 'openutility-session-token';

export function withBot<T extends Options>(init?: T): T {
  if (!bot) {
    throw new Error(
      'Dashboard API is not configured. Set VITE_API_ENDPOINT to the deployed backend URL.'
    );
  }

  const token = sessionStorage.getItem(SessionTokenStorage);
  return {
    ...init,
    origin: bot,
    init: {
      ...init?.init,
      headers: {
        ...init?.init?.headers,
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      mode: 'cors',
    },
  };
}

export function withDiscord<T extends Options>(accessToken: string, options?: T): T {
  const init = options?.init;

  return {
    ...options,
    origin: discord,
    init: {
      ...init,
      headers: {
        ...init?.headers,
        authorization: `Bearer ${accessToken}`,
      },
    },
  };
}
