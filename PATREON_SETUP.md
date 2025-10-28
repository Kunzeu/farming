# Integración de Patreon OAuth - Guía de Configuración

Esta guía te ayudará a configurar la integración de Patreon OAuth en tu aplicación True Farming.

## 📋 Requisitos Previos

1. Cuenta de creador en Patreon
2. Acceso a la consola de Patreon Developers
3. Base de datos PostgreSQL configurada

## 🔧 Paso 1: Configurar Aplicación en Patreon

1. Ve a [Patreon Developer Portal](https://www.patreon.com/portal/registration/register-clients)
2. Crea una nueva aplicación OAuth2
3. **Configura las URLs de redirección** - Este es el paso más importante:
   
   **IMPORTANTE:** En Patreon, debes registrar **TODAS** las URLs de redirección que vas a usar. En el campo "Redirect URIs", agrega:
   
   Para desarrollo local:
   - `http://localhost:3000/auth/patreon/callback`
   - `http://localhost:3000/auth/patreon/link`
   
   Para producción:
   - `https://tu-dominio.com/auth/patreon/callback`
   - `https://tu-dominio.com/auth/patreon/link`
   
   **Nota:** Puedes agregar múltiples URLs separándolas con comas en el campo "Redirect URIs" en la configuración de Patreon.

4. Copia tu **Client ID** y **Client Secret**

> ⚠️ **Atención:** El código ahora detecta automáticamente el entorno (desarrollo o producción) y usa la URL de redirección apropiada. Solo asegúrate de que las URLs estén registradas en Patreon.

## 🗄️ Paso 2: Actualizar Base de Datos

Ejecuta las siguientes migraciones SQL en tu base de datos PostgreSQL:

\`\`\`sql
-- Agregar columnas de Patreon a la tabla de usuarios
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_tier VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS patreon_status VARCHAR(50);

-- Agregar índices para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_users_patreon_id ON users(patreon_id);
CREATE INDEX IF NOT EXISTS idx_users_patreon_status ON users(patreon_status);

-- Agregar constraint para patreon_status
ALTER TABLE users ADD CONSTRAINT check_patreon_status 
  CHECK (patreon_status IS NULL OR patreon_status IN ('active_patron', 'declined_patron', 'former_patron'));
\`\`\`

## 🔑 Paso 3: Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

\`\`\`env
# Patreon OAuth Configuration
PATREON_CLIENT_ID=tu_client_id_aqui
PATREON_CLIENT_SECRET=tu_client_secret_aqui
PATREON_REDIRECT_URI=https://tu-dominio.com/auth/patreon/callback

# Variables públicas para el cliente
NEXT_PUBLIC_PATREON_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_PATREON_REDIRECT_URI=https://tu-dominio.com/auth/patreon/callback
\`\`\`

## 🎨 Paso 4: Agregar Componente al Perfil (Opcional)

Si quieres mostrar la sección de Patreon en la página de perfil, importa y usa el componente:

\`\`\`tsx
import PatreonSection from '@/components/auth/PatreonSection';

// En tu página de perfil:
<PatreonSection />
\`\`\`

## 🚀 Paso 5: Funcionalidades Disponibles

### Login/Registro con Patreon

Los usuarios pueden:
- Registrarse con su cuenta de Patreon
- Iniciar sesión con Patreon
- Ver el botón de Patreon en la página de login

### Vincular Cuenta Existente

Los usuarios registrados pueden:
- Vincular su cuenta de Patreon a una cuenta existente
- Ver su estado de Patreon en el perfil
- Acceder a beneficios basados en su tier

### Datos Capturados

El sistema almacena:
- \`patreonId\`: ID único del usuario en Patreon
- \`patreonTier\`: Nombre del tier/nivel de membresía
- \`patreonStatus\`: Estado actual (\`active_patron\`, \`declined_patron\`, \`former_patron\`)

## 📊 Beneficios por Tier

Puedes implementar beneficios personalizados basados en el tier del usuario:

\`\`\`tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  const isPatron = user?.patreonStatus === 'active_patron';
  const tier = user?.patreonTier;
  
  // Implementa lógica de beneficios
  if (isPatron) {
    if (tier === 'Premium Tier') {
      // Mostrar contenido premium
    }
  }
}
\`\`\`

## 🔒 Seguridad

- Los tokens de Patreon nunca se almacenan en la base de datos
- Solo se almacenan datos públicos del usuario (ID, tier, estado)
- Todas las peticiones a la API de Patreon se hacen desde el servidor
- Las credenciales de OAuth se mantienen en variables de entorno

## 🧪 Pruebas

### Modo Desarrollo

1. Usa la URL de desarrollo en Patreon: `http://localhost:3000/auth/patreon/callback`
2. Inicia sesión con una cuenta de prueba de Patreon
3. Verifica que los datos se guarden correctamente

### Modo Producción

1. Configura la URL de producción en Patreon
2. Actualiza las variables de entorno
3. Prueba el flujo completo

## ❓ Solución de Problemas

### Error: "Redirect URI localhost:3000/auth/patreon/callback is not supported by client"

**Causa:** La URL de redirección no está registrada en la configuración de tu aplicación de Patreon.

**Solución:**
1. Ve a [Patreon Developer Portal](https://www.patreon.com/portal/home)
2. Abre tu aplicación OAuth2
3. En el campo "Redirect URIs", agrega la URL que estás usando:
   - Para desarrollo: `http://localhost:3000/auth/patreon/callback`
   - También agrega: `http://localhost:3000/auth/patreon/link`
4. Guarda los cambios
5. Espera 1-2 minutos para que los cambios se propaguen
6. Intenta nuevamente

**Nota:** Después de los cambios, el código detecta automáticamente el entorno (localhost o producción) y usa la URL apropiada.

### Error: "Configuración de Patreon OAuth incompleta"

- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que no haya espacios en las claves

### Error: "User not found" al vincular cuenta

- Asegúrate de estar autenticado antes de intentar vincular
- Verifica que el flujo de OAuth se complete correctamente

### Los beneficios no se actualizan

- Los datos de Patreon se actualizan en cada login
- Puedes forzar una actualización cerrando sesión y volviendo a entrar

## 📞 Soporte

Si necesitas ayuda adicional:
- Consulta la [documentación oficial de Patreon](https://docs.patreon.com/)
- Revisa los logs de la consola para errores específicos
- Contacta al equipo de desarrollo

## 🔄 Webhooks de Patreon (Futuro)

Para mantener los datos sincronizados en tiempo real, considera implementar webhooks de Patreon:

1. Configura un endpoint para recibir webhooks
2. Procesa eventos como:
   - \`members:pledge:create\` - Nuevo patreon
   - \`members:pledge:update\` - Cambio de tier
   - \`members:pledge:delete\` - Usuario dejó de ser patreon

## 📝 Notas Adicionales

- La API de Patreon tiene límites de rate limiting
- Los datos de membresía pueden tardar unos minutos en actualizarse
- Considera implementar un caché para reducir llamadas a la API

---

¡Listo! Ahora tu aplicación está integrada con Patreon OAuth 🎉
