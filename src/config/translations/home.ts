import { provider } from './provider';
import { createI18n } from 'hooks/i18n';

export const home = createI18n(provider, {
  en: {
    'next gen discord bot': 'A clearer way to manage your Discord server',
    'welcome messages': 'Welcome Messages',
    'welcome messages description': 'Configure a message to send when a new member joins your server.',
  },
  cn: {
    'next gen discord bot': '更轻松地管理您的 Discord 服务器',
    'welcome messages': '欢迎消息',
    'welcome messages description': '设置新成员加入服务器时发送的消息。',
  },
});
