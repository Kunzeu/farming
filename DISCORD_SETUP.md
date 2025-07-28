# Configuración de Discord OAuth

Para habilitar la autenticación con Discord en GW2 Farming Hub, sigue estos pasos:

## 1. Crear una Aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en "New Application"
3. Dale un nombre a tu aplicación (ej: "GW2 Farming Hub")
4. Guarda la aplicación

## 2. Configurar OAuth2

1. En el panel de tu aplicación, ve a "OAuth2" en el menú lateral
2. En "General", copia el **Client ID** y **Client Secret**
3. En "Redirects", agrega la URL de redirección:
   - Para desarrollo: `http://localhost:3000/auth/discord/callback`
   - Para producción: `https://tu-dominio.com/auth/discord/callback`

## 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Discord OAuth Configuration
NEXT_PUBLIC_DISCORD_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
```

## 4. Migrar Base de Datos

Si estás usando PostgreSQL, ejecuta el script de migración:

```sql
-- Ejecutar en tu base de datos PostgreSQL
ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_id VARCHAR(255) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);
```

O ejecuta el archivo de migración completo:
```bash
psql -d tu_base_de_datos -f migrations/add_discord_id.sql
```

## 5. Scopes Requeridos

La aplicación solicita los siguientes scopes:
- `identify`: Para obtener información básica del usuario
- `email`: Para obtener el email del usuario

## 6. Funcionalidades Implementadas

### Login con Discord
- Botón "Continuar con Discord" en la página de login
- Redirección a Discord OAuth
- Manejo del callback y creación/actualización de usuario

### Registro con Discord
- Botón "Registrarse con Discord" en la página de registro
- Creación automática de cuenta con datos de Discord
- Vinculación del Discord ID con la cuenta

### Características
- ✅ Autenticación OAuth2 con Discord
- ✅ Obtención de información del usuario (username, email, Discord ID)
- ✅ Creación automática de cuenta si no existe
- ✅ Vinculación de cuenta existente si ya existe
- ✅ Manejo de errores y estados de carga
- ✅ Redirección automática después de autenticación

## 7. Seguridad

- Los tokens de Discord no se almacenan permanentemente
- Solo se usa el Discord ID para vincular cuentas
- Las credenciales sensibles están en variables de entorno
- Validación de scopes y permisos

## 8. Personalización

Puedes personalizar:
- Los scopes solicitados en `LoginForm.tsx` y `RegisterForm.tsx`
- La URL de redirección según tu dominio
- Los permisos y roles de usuarios creados via Discord
- El diseño de los botones de Discord

## 9. Troubleshooting

### Error: "Invalid redirect URI"
- Verifica que la URL de redirección en Discord Developer Portal coincida exactamente con `DISCORD_REDIRECT_URI`

### Error: "Invalid client"
- Verifica que `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET` sean correctos

### Error: "Invalid code"
- El código de autorización expira rápidamente, asegúrate de que el callback se procese inmediatamente

## 10. Producción

Para producción:
1. Cambia las URLs de redirección a tu dominio real
2. Configura las variables de entorno en tu hosting
3. Asegúrate de que HTTPS esté habilitado
4. Considera usar un proxy para las llamadas a la API de Discord 