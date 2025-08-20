// Configuración para Discord OAuth (Solo para el cliente)
export const getDiscordConfig = () => {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return null; // Completamente silencioso
  }
  
  return {
    clientId,
    redirectUri,
    authUrl: `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+guilds+email`
  };
}; 