import { GuildInfo } from '.';

export type CustomGuildInfo = GuildInfo & {};

/** Only features with implemented dashboard forms should be exposed here. */
export type CustomFeatures = {
  'welcome-message': WelcomeMessageFeature;
};

export type WelcomeMessageFeature = {
  channel?: string;
  message: string;
};

/** Kept for the unused example component until it is removed from the template. */
export type MusicFeature = {
  message: string;
  channel?: string;
  role?: string;
  color?: string;
  count?: string;
  date?: Date;
  file?: File[];
  bool: boolean;
  tags: string[];
};
