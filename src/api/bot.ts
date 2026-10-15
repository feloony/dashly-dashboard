import { SessionTokenStorage } from 'api/core/plugins';
import { CustomFeatures, CustomGuildInfo } from 'config/types/custom-types';
import { withBot, callDefault, callReturn } from './core';
import { ChannelTypes } from './discord';

const configuredEndpoint = import.meta.env.VITE_API_ENDPOINT?.trim();
export const bot = (configuredEndpoint || (import.meta.env.DEV ? 'http://localhost:8080' : '')).replace(/\/+$/, '');

export type Role = {
  id: string;
  name: string;
  color: number;
  position: number;
  icon?: {
    iconUrl?: string;
    emoji?: string;
  };
};

export type GuildChannel = {
  id: string;
  name: string;
  type: ChannelTypes;
  category?: string;
};

/** Get the dashboard session token if logged in, otherwise return null. */
export async function auth() {
  return await callReturn<string | null>(
    '/auth',
    withBot({
      method: 'GET',
      allowed: { 401: () => null },
    })
  );
}

export async function logout() {
  await callDefault('/auth/signout', withBot({ method: 'POST' }));
  sessionStorage.removeItem(SessionTokenStorage);
  // Remove the previous persistent token during migration.
  localStorage.removeItem('ios-session-token');
}

/** Get custom guild info from the backend, or null if the bot is not in the guild. */
export async function fetchGuildInfo(guild: string): Promise<CustomGuildInfo | null> {
  return await callReturn<CustomGuildInfo | null>(
    `/guilds/${encodeURIComponent(guild)}`,
    withBot({ method: 'GET', errorOnFail: false })
  );
}

export async function enableFeature(guild: string, feature: string) {
  return await callDefault(
    `/guilds/${encodeURIComponent(guild)}/features/${encodeURIComponent(feature)}`,
    withBot({ method: 'POST' })
  );
}

export async function disableFeature(guild: string, feature: string) {
  return await callDefault(
    `/guilds/${encodeURIComponent(guild)}/features/${encodeURIComponent(feature)}`,
    withBot({ method: 'DELETE' })
  );
}

export async function getFeature<K extends keyof CustomFeatures>(
  guild: string,
  feature: K
): Promise<CustomFeatures[K]> {
  return await callReturn<CustomFeatures[K]>(
    `/guilds/${encodeURIComponent(guild)}/features/${encodeURIComponent(feature)}`,
    withBot({ method: 'GET' })
  );
}

export async function updateFeature<K extends keyof CustomFeatures>(
  guild: string,
  feature: K,
  options: FormData | string
): Promise<CustomFeatures[K]> {
  return await callReturn<CustomFeatures[K]>(
    `/guilds/${encodeURIComponent(guild)}/features/${encodeURIComponent(feature)}`,
    withBot({ method: 'PATCH', body: options })
  );
}

export async function fetchGuildRoles(guild: string) {
  return await callReturn<Role[]>(
    `/guilds/${encodeURIComponent(guild)}/roles`,
    withBot({ method: 'GET' })
  );
}

export async function fetchGuildChannels(guild: string) {
  return await callReturn<GuildChannel[]>(
    `/guilds/${encodeURIComponent(guild)}/channels`,
    withBot({ method: 'GET' })
  );
}
