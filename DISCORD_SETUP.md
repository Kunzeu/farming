# Configuración de Discord OAuth

## Variables de entorno necesarias

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

# Para producción:
# DISCORD_REDIRECT_URI=https://www.true-farming.com/auth/discord/callback

# Variables públicas (para el cliente)
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id_here
NEXT_PUBLIC_DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
```

## Pasos para configurar Discord OAuth

1. Ve a https://discord.com/developers/applications
2. Crea una nueva aplicación o selecciona una existente
3. Ve a la sección "OAuth2" > "General"
4. Copia el "Client ID" y "Client Secret"
5. En "Redirects", agrega:
   - Para desarrollo: `http://localhost:3000/auth/discord/callback`
   - Para producción: `https://www.true-farming.com/auth/discord/callback`
6. Guarda los cambios
7. Actualiza las variables de entorno en tu archivo `.env.local`

## Verificación

Una vez configurado, puedes verificar que funciona:
1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a la página de login
3. Haz clic en "Iniciar sesión con Discord"
4. Revisa la consola del navegador y del servidor para ver los logs

## Troubleshooting

Si hay errores, revisa:
- Que las variables de entorno estén correctamente configuradas
- Que la URL de redirección coincida exactamente con la configurada en Discord
- Que la aplicación de Discord tenga los permisos correctos (identify, email)
- Los logs en la consola del navegador y del servidor
