// Configuración para Discord OAuth (Solo para el cliente)
export const getDiscordConfig = () => {
  return {
    clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1399450681126944939',
    redirectUri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || 'https://farming-coral.vercel.app/auth/discord/callback',
    authUrl: `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1399450681126944939'}&response_type=code&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || 'https://farming-coral.vercel.app/auth/discord/callback')}&scope=email+identify`
  };
}; 