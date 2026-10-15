import { bot } from './bot';

export const discord = 'https://discord.com/api/v9';

export type UserInfo = {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar: string | null;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number;
  locale?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
};

export type Guild = {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
  owner?: boolean;
  botInstalled?: boolean;
  botStatus?: string;
  memberCount?: number | null;
  onlineCount?: number | null;
  botInviteUrl?: string | null;
};

export type IconHash = string;

export enum PermissionFlags {
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS = 1 << 1,
  BAN_MEMBERS = 1 << 2,
  ADMINISTRATOR = 1 << 3,
  MANAGE_CHANNELS = 1 << 4,
  MANAGE_GUILD = 1 << 5,
  ADD_REACTIONS = 1 << 6,
  VIEW_AUDIT_LOG = 1 << 7,
  PRIORITY_SPEAKER = 1 << 8,
  STREAM = 1 << 9,
  VIEW_CHANNEL = 1 << 10,
  SEND_MESSAGES = 1 << 11,
  SEND_TTS_MESSAGES = 1 << 12,
  MANAGE_MESSAGES = 1 << 13,
  EMBED_LINKS = 1 << 14,
  ATTACH_FILES = 1 << 15,
  READ_MESSAGE_HISTORY = 1 << 16,
  MENTION_EVERYONE = 1 << 17,
  USE_EXTERNAL_EMOJIS = 1 << 18,
  VIEW_GUILD_INSIGHTS = 1 << 19,
  CONNECT = 1 << 20,
  SPEAK = 1 << 21,
  MUTE_MEMBERS = 1 << 22,
  DEAFEN_MEMBERS = 1 << 23,
  MOVE_MEMBERS = 1 << 24,
  USE_VAD = 1 << 25,
  CHANGE_NICKNAME = 1 << 26,
  MANAGE_NICKNAMES = 1 << 27,
  MANAGE_ROLES = 1 << 28,
  MANAGE_WEBHOOKS = 1 << 29,
  MANAGE_EMOJIS_AND_STICKERS = 1 << 30,
  USE_APPLICATION_COMMANDS = 1 << 31,
  REQUEST_TO_SPEAK = 1 << 32,
  MANAGE_EVENTS = 1 << 33,
  MANAGE_THREADS = 1 << 34,
  CREATE_PUBLIC_THREADS = 1 << 35,
  CREATE_PRIVATE_THREADS = 1 << 36,
  USE_EXTERNAL_STICKERS = 1 << 37,
  SEND_MESSAGES_IN_THREADS = 1 << 38,
  USE_EMBEDDED_ACTIVITIES = 1 << 39,
  MODERATE_MEMBERS = 1 << 40,
  MANAGE_GUILD_EXPRESSIONS = 1 << 41,
  USE_SOUNDBOARD = 1 << 42,
  CREATE_GUILD_EXPRESSIONS = 1 << 43,
  CREATE_EVENTS = 1 << 44,
  USE_EXTERNAL_SOUNDS = 1 << 45,
  SEND_VOICE_MESSAGES = 1 << 46,
  SEND_POLLS = 1 << 49,
}

async function apiJson<T>(path: string): Promise<T> {
  if (!bot) throw new Error('Dashboard API is not configured.');
  const response = await fetch(`${bot}${path}`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    mode: 'cors',
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Your Discord session has expired. Please log in again.');
    const body = await response.text().catch(() => '');
    throw new Error(body || `Dashboard API request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function fetchUserInfo(_accessToken: string) {
  const response = await apiJson<{ user: { id: string; username: string; global_name?: string; avatar: string | null } }>('/me');
  return {
    id: response.user.id,
    username: response.user.global_name || response.user.username,
    global_name: response.user.global_name || response.user.username,
    discriminator: '0',
    avatar: response.user.avatar,
  } satisfies UserInfo;
}

export async function getGuilds(_accessToken: string) {
  const response = await apiJson<{ guilds: Guild[] }>('/guilds');
  return response.guilds;
}

export async function getGuild(accessToken: string, id: string) {
  const guilds = await getGuilds(accessToken);
  const guild = guilds.find((item) => item.id === id);
  if (!guild) throw new Error('Server not found or you do not have permission to manage it.');
  return guild;
}

export function iconUrl(guild: Guild) {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : '';
}

export function avatarUrl(user: UserInfo) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`
    : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user.id) % 6n)}.png`;
}

export function bannerUrl(user: UserInfo) {
  if (user.banner == null) return null;
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=1024`;
}
