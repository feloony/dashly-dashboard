import { createIcon } from '@chakra-ui/react';
import { PermissionFlags } from 'api/discord';
import { AppConfig } from './types';

const OpenUtilityIcon = createIcon({
  displayName: 'OpenUtilityIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12 2.5 14.6 8l5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1L9.4 8 12 2.5Zm0 4.2-1.2 2.5-2.7.4 2 1.9-.5 2.7 2.4-1.3 2.4 1.3-.5-2.7 2-1.9-2.7-.4L12 6.7Z"
    />
  ),
});

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID?.trim();

export const config: AppConfig = {
  name: 'OpenUtility',
  icon: OpenUtilityIcon,
  // Configure VITE_DISCORD_CLIENT_ID with the real bot application ID before deployment.
  // Do not request Administrator by default; grant only the permissions the bot needs.
  inviteUrl: clientId
    ? `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&scope=bot%20applications.commands`
    : '',
  guild: {
    // This is a display filter only. The backend must enforce guild permissions on every request.
    filter: (guild) => {
      const permissions = BigInt(guild.permissions);
      return (
        (permissions & BigInt(PermissionFlags.ADMINISTRATOR)) !== 0n ||
        (permissions & BigInt(PermissionFlags.MANAGE_GUILD)) !== 0n
      );
    },
  },
};
