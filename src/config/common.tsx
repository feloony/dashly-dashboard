import { createIcon } from '@chakra-ui/react';
import { PermissionFlags } from 'api/discord';
import { AppConfig } from './types';

const DashlyIcon = createIcon({
  displayName: 'DashlyIcon',
  viewBox: '0 0 40 40',
  path: (
    <>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="currentColor" opacity="0.14" />
      <path
        fill="currentColor"
        d="M12 10h7.5C27 10 32 14 32 20s-5 10-12.5 10H12V10Zm6.5 15.5c4.2 0 6.5-2 6.5-5.5s-2.3-5.5-6.5-5.5h-1v11h1Z"
      />
    </>
  ),
});

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID?.trim();

export const config: AppConfig = {
  name: 'Dashly',
  icon: DashlyIcon,
  // Configure VITE_DISCORD_CLIENT_ID with the real application ID before deployment.
  // Never place private client secrets in frontend environment variables.
  inviteUrl: clientId
    ? `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&scope=bot%20applications.commands`
    : '',
  guild: {
    // Display filter only. The backend must enforce access permissions on every request.
    filter: (guild) => {
      const permissions = BigInt(guild.permissions);
      return (
        (permissions & BigInt(PermissionFlags.ADMINISTRATOR)) !== 0n ||
        (permissions & BigInt(PermissionFlags.MANAGE_GUILD)) !== 0n
      );
    },
  },
};
