# Implementación Completa de Patreon OAuth

## 📁 Archivos Creados/Modificados

### Archivos Nuevos

#### API Routes
- `src/app/api/auth/patreon/token/route.ts` - Intercambia código OAuth por token de acceso
- `src/app/api/auth/patreon/identity/route.ts` - Obtiene información del usuario de Patreon

#### Páginas
- `src/app/auth/patreon/callback/page.tsx` - Callback para login/registro con Patreon
- `src/app/auth/patreon/link/page.tsx` - Callback para vincular cuenta existente

#### Componentes
- `src/components/auth/PatreonSection.tsx` - Sección de Patreon para perfil de usuario
- `src/components/PatreonBadge.tsx` - Badge visual para mostrar tier de Patreon
- `src/components/ConditionalAd.tsx` - Componente para mostrar/ocultar anuncios

#### Librerías
- `src/lib/patreon-benefits.ts` - Sistema completo de gestión de beneficios

#### Documentación
- `PATREON_SETUP.md` - Guía completa de configuración
- `PATREON_IMPLEMENTATION.md` - Este archivo
- `migrations/add_patreon_fields.sql` - Migración SQL para base de datos

### Archivos Modificados

#### Tipos
- `src/types/auth.ts` - Agregados campos: `patreonId`, `patreonTier`, `patreonStatus`

#### Contexto de Autenticación
- `src/contexts/AuthContext.tsx` - Agregadas funciones:
  - `loginWithPatreon()` - Login/registro con Patreon
  - `linkPatreon()` - Vincular cuenta existente

#### Base de Datos
- `src/lib/database-client.ts` - Agregado método:
  - `getUserByPatreonId()` - Buscar usuario por Patreon ID

#### API
- `src/app/api/auth/search/route.ts` - Agregado soporte para búsqueda por `patreonId`

#### UI
- `src/components/auth/LoginForm.tsx` - Agregado botón de login con Patreon

## 🔄 Flujos de Usuario

### 1. Login/Registro con Patreon

```
Usuario → Click "Continue with Patreon" 
       → Redirección a Patreon OAuth 
       → Usuario autoriza 
       → Callback a /auth/patreon/callback 
       → Intercambio de código por token 
       → Obtención de datos del usuario 
       → Búsqueda/Creación de usuario en DB 
       → Login exitoso 
       → Redirección a página principal
```

### 2. Vincular Cuenta Existente

```
Usuario logueado → Perfil 
                → Sección Patreon 
                → Click "Vincular Cuenta" 
                → Redirección a Patreon OAuth 
                → Usuario autoriza 
                → Callback a /auth/patreon/link 
                → Actualización de datos en DB 
                → Redirección a perfil
```

## 💾 Estructura de Datos

### Base de Datos (PostgreSQL)

```sql
Table: users
- patreon_id: VARCHAR(255) - ID único de Patreon
- patreon_tier: VARCHAR(255) - Nombre del tier
- patreon_status: VARCHAR(50) - Estado: active_patron, declined_patron, former_patron
```

### Objeto User (TypeScript)

```typescript
interface User {
  // ... campos existentes
  patreonId?: string;
  patreonTier?: string;
  patreonStatus?: 'active_patron' | 'declined_patron' | 'former_patron' | null;
}
```

## 🎁 Sistema de Beneficios

### Tiers Configurados

1. **Basic Supporter (3€/mes)**
   - Sin anuncios
   - Rol en Discord

2. **Premium Supporter (5€/mes)**
   - Sin anuncios
   - Contenido exclusivo
   - Rol en Discord
   - Soporte prioritario

3. **VIP Supporter (10€/mes)**
   - Todos los beneficios anteriores
   - Acceso anticipado
   - Features personalizados
   - Acceso a API

### Uso del Sistema de Beneficios

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { usePatreonBenefits } from '@/lib/patreon-benefits';

function MyComponent() {
  const { user } = useAuth();
  const { 
    isActivePatron, 
    tier, 
    hasBenefit, 
    shouldShowAds 
  } = usePatreonBenefits(user);
  
  if (isActivePatron) {
    // Lógica para patrons activos
  }
  
  if (hasBenefit('exclusive_content')) {
    // Mostrar contenido exclusivo
  }
  
  if (!shouldShowAds) {
    // Ocultar anuncios
  }
}
```

## 🔧 Configuración Requerida

### Variables de Entorno

```env
# Servidor
PATREON_CLIENT_ID=
PATREON_CLIENT_SECRET=
PATREON_REDIRECT_URI=

# Cliente
NEXT_PUBLIC_PATREON_CLIENT_ID=
NEXT_PUBLIC_PATREON_REDIRECT_URI=
```

### Configuración en Patreon

1. Crear aplicación OAuth2 en Patreon Developer Portal
2. Configurar URLs de redirección:
   - `/auth/patreon/callback` - Para login/registro
   - `/auth/patreon/link` - Para vincular cuenta
3. Obtener Client ID y Client Secret

## 📊 Endpoints API

### POST `/api/auth/patreon/token`
Intercambia código OAuth por token de acceso

**Body:**
```json
{
  "code": "oauth_code"
}
```

**Response:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 2678400
}
```

### GET `/api/auth/patreon/identity`
Obtiene información del usuario de Patreon

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "data": {
    "id": "user_id",
    "attributes": {
      "email": "user@example.com",
      "full_name": "User Name",
      ...
    }
  },
  "included": [
    {
      "type": "member",
      "attributes": {
        "patron_status": "active_patron",
        ...
      }
    }
  ]
}
```

## 🎨 Componentes UI

### PatreonSection
Muestra información de Patreon en el perfil del usuario

```tsx
import PatreonSection from '@/components/auth/PatreonSection';

<PatreonSection />
```

### PatreonBadge
Badge visual para mostrar tier de Patreon

```tsx
import PatreonBadge from '@/components/PatreonBadge';

<PatreonBadge showIcon={true} />
```

### ConditionalAd
Muestra contenido condicionalmente basado en estado de Patreon

```tsx
import ConditionalAd from '@/components/ConditionalAd';

<ConditionalAd fallback={<ThanksMessage />}>
  <AdComponent />
</ConditionalAd>
```

## 🔒 Seguridad

- ✅ Tokens OAuth nunca se almacenan en base de datos
- ✅ Credenciales en variables de entorno
- ✅ Validación de origen en endpoints internos
- ✅ Solo datos públicos del usuario se almacenan
- ✅ Todas las peticiones OAuth desde servidor

## 🧪 Testing

### Checklist de Pruebas

- [ ] Login con Patreon funciona
- [ ] Registro con Patreon funciona
- [ ] Vincular cuenta existente funciona
- [ ] Datos se guardan correctamente en DB
- [ ] Beneficios se aplican correctamente
- [ ] Badge de Patreon se muestra
- [ ] Anuncios se ocultan para patrons
- [ ] Callback de error maneja correctamente
- [ ] Redirecciones funcionan
- [ ] Variables de entorno configuradas

## 📈 Mejoras Futuras

1. **Webhooks de Patreon**
   - Sincronización en tiempo real
   - Notificaciones de cambios de tier
   - Detección automática de cancelaciones

2. **Dashboard de Patreon**
   - Panel de administración
   - Estadísticas de patrons
   - Gestión de beneficios

3. **Niveles Personalizados**
   - Sistema flexible de tiers
   - Beneficios configurables
   - A/B testing de ofertas

4. **Integración Discord**
   - Asignación automática de roles
   - Notificaciones en canal privado
   - Comandos especiales

## 🆘 Solución de Problemas

### "Patreon OAuth incomplete configuration"
→ Verifica variables de entorno

### "User not found"
→ Verifica que la base de datos tenga los campos de Patreon

### Beneficios no se aplican
→ Verifica que el `patreonStatus` sea `'active_patron'`

### Callback no funciona
→ Verifica que las URLs estén configuradas en Patreon

## 📞 Contacto

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.

---

**Última actualización:** 2025-10-28
**Versión:** 1.0.0
