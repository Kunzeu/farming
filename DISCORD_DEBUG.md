# 🔍 Debugging de Discord OAuth

## 📋 Pasos para Diagnosticar el Problema

### 1. **Verificar Variables de Entorno**
Asegúrate de que tu archivo `.env.local` contenga:

```bash
# Cliente (NEXT_PUBLIC_)
NEXT_PUBLIC_DISCORD_CLIENT_ID=1399450681126944939
NEXT_PUBLIC_DISCORD_REDIRECT_URI=https://www.true-farming.com/auth/discord/callback

# Servidor (sin NEXT_PUBLIC_)
DISCORD_CLIENT_ID=1399450681126944939
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DISCORD_REDIRECT_URI=https://www.true-farming.com/auth/discord/callback
```

### 2. **Verificar Discord Developer Portal**
1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecciona tu aplicación
3. En la sección "OAuth2":
   - **Redirect URI**: `https://www.true-farming.com/auth/discord/callback`
   - **Scopes**: `identify`, `guilds`, `email`

### 3. **Verificar Logs del Servidor**
Después de intentar autenticarte, revisa la consola del servidor para ver logs como:

```
🔐 Discord Token API: Iniciando solicitud...
📝 Código recibido: ✅ Presente
🔧 Variables de entorno:
  - DISCORD_CLIENT_ID: ✅ Presente
  - DISCORD_CLIENT_SECRET: ✅ Presente
  - DISCORD_REDIRECT_URI: ✅ Presente
🌐 URL de redirección configurada: https://www.true-farming.com/auth/discord/callback
🆔 Client ID configurado: 1399450681126944939
🔄 Intercambiando código por token...
```

### 4. **Errores Comunes y Soluciones**

#### ❌ **"Configuración de Discord OAuth incompleta"**
- **Problema**: Faltan variables de entorno
- **Solución**: Verifica que `.env.local` tenga todas las variables necesarias

#### ❌ **"Error al obtener token de Discord"**
- **Problema**: Discord rechaza la solicitud
- **Causas posibles**:
  - `redirect_uri` no coincide con el configurado en Discord
  - `client_secret` incorrecto
  - `client_id` incorrecto
  - Código de autorización expirado o inválido

#### ❌ **"invalid_grant"**
- **Problema**: El código de autorización es inválido
- **Solución**: El código solo se puede usar una vez y expira rápidamente

### 5. **Verificar URL de Redirección**
Asegúrate de que la URL en Discord Developer Portal coincida EXACTAMENTE con:
```
https://www.true-farming.com/auth/discord/callback
```

**NO** debe tener:
- Espacios extra
- Caracteres especiales
- Protocolo diferente (http vs https)
- Subdominio diferente

### 6. **Probar la Configuración**
1. Limpia el localStorage del navegador
2. Reinicia el servidor de desarrollo
3. Intenta autenticarte nuevamente
4. Revisa tanto la consola del navegador como la del servidor

### 7. **Comandos de Verificación**
```bash
# Verificar que el archivo .env.local existe
ls -la .env.local

# Verificar contenido (sin mostrar valores sensibles)
grep -E "^(NEXT_PUBLIC_|DISCORD_)" .env.local | sed 's/=.*/=***/'
```

## 🚨 **Si el Problema Persiste**

1. **Verifica que el dominio `www.true-farming.com` esté funcionando**
2. **Confirma que tienes SSL/HTTPS configurado correctamente**
3. **Verifica que Discord no esté bloqueando tu IP o dominio**
4. **Revisa los logs del servidor para errores específicos**

## 📞 **Soporte**

Si necesitas más ayuda, proporciona:
- Los logs completos del servidor
- El contenido de tu `.env.local` (ocultando valores sensibles)
- Cualquier error específico que aparezca en la consola del navegador
