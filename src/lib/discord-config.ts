// Configuración para Discord OAuth (Solo para el cliente)
export const getDiscordConfig = () => {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1399450681126944939';
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || 'https://www.true-farming.com/auth/discord/callback';
  
  return {
    clientId,
    redirectUri,
    authUrl: `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email+identify`
  };
}; 