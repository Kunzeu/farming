# Test de Nuevas Monedas

## Verificación de Funcionalidad

### 1. Panel de Administración (`/admin`)
- [ ] Se pueden seleccionar todas las nuevas monedas
- [ ] Cada moneda tiene su propio campo de entrada
- [ ] Se pueden crear farms con múltiples monedas

### 2. Panel de Moderador (`/moderator`)
- [ ] Mismas funcionalidades que el panel de admin
- [ ] Se pueden crear farms pendientes de aprobación

### 3. Rutas de Farm (`/farming-routes`)
- [ ] Las nuevas monedas se muestran en las tarjetas
- [ ] Se muestran con el icono correcto
- [ ] Se muestran con la traducción correcta
- [ ] Se muestran con el sufijo "/h"

### 4. Rutina Diaria (`/daily-routine`)
- [ ] Las monedas se muestran en las tarjetas de farm
- [ ] Se calculan totales por tipo de moneda
- [ ] Se pueden ver en vista de lista y cuadrícula

### 5. Modal de Descripción
- [ ] Las nuevas monedas se muestran en el modal
- [ ] Se muestran con el formato correcto

## Monedas a Verificar

### Monedas Principales
- [ ] **Gold** - Oro básico
- [ ] **Spirit Shards** - Esquirlas espirituales

### Monedas de Expansión
- [ ] **Karma** (ID: 2) - Moneda básica del mundo
- [ ] **Fractal Relics** (ID: 7) - Reliquias de fractales
- [ ] **Volatile Magic** (ID: 45) - Magia volátil (HoT)
- [ ] **Unbound Magic** (ID: 32) - Magia desatada (PoF)
- [ ] **Rift Essences** (ID: 78) - Esencias de rift (SotO)
- [ ] **Mystic Clovers** (ID: 19675) - Tréboles místicos
- [ ] **Imperial Favor** (ID: 68) - Favor imperial (EoD)

## Pasos de Prueba

### 1. Crear Farm de Prueba
1. Ve al Panel de Administración
2. Crea una nueva farm con múltiples monedas
3. Verifica que se guarde correctamente

### 2. Verificar en Farming Routes
1. Ve a `/farming-routes`
2. Busca la farm creada
3. Verifica que todas las monedas se muestren en la tarjeta

### 3. Verificar en Daily Routine
1. Ve a `/daily-routine`
2. Selecciona la farm creada
3. Verifica que las monedas se muestren y se calculen los totales

### 4. Verificar Modal
1. Haz clic en la farm en farming-routes
2. Verifica que las monedas se muestren en el modal de descripción

## Problemas Comunes a Verificar

### 1. Iconos Faltantes
- Verificar que todos los iconos estén en `/public/images/expansions/`
- Los iconos deben ser archivos PNG válidos

### 2. Traducciones Faltantes
- Verificar que todas las monedas tengan traducciones en los 4 idiomas
- Verificar que las claves de traducción coincidan

### 3. Tipos TypeScript
- Verificar que no haya errores de tipo en la consola
- Verificar que todas las monedas estén en la interfaz `FarmItem`

### 4. Base de Datos
- Verificar que las monedas obsoletas se hayan eliminado
- Verificar que las nuevas monedas se guarden correctamente

## Comandos de Verificación

### Verificar Errores de Consola
```bash
cd gw2-farming-hub
npm run build
```

### Verificar Tipos TypeScript
```bash
npx tsc --noEmit
```

### Verificar Linting
```bash
npm run lint
```

## Archivos Modificados

### Interfaces y Tipos
- `src/lib/database-client.ts` - Interfaz FarmItem
- `src/components/ui/GW2Icon.tsx` - Tipos de iconos

### Componentes de UI
- `src/app/admin/page.tsx` - Panel de administración
- `src/app/moderator/page.tsx` - Panel de moderador
- `src/app/daily-routine/page.tsx` - Rutina diaria
- `src/app/farming-routes/page.tsx` - Rutas de farm
- `src/components/ui/DescriptionModal.tsx` - Modal de descripción

### Traducciones
- `src/i18n/messages/es.json` - Español
- `src/i18n/messages/en.json` - Inglés
- `src/i18n/messages/de.json` - Alemán
- `src/i18n/messages/fr.json` - Francés

### Scripts SQL
- `database/execute_cleanup.sql` - Limpieza simple
- `database/cleanup_currencies.sql` - Limpieza detallada
- `database/update_currencies.sql` - Script completo

## Notas Importantes

1. **ImperialFavor** se mantiene como moneda válida
2. Las monedas obsoletas (`experience`, `laurels`, `otherCurrency`) se eliminan
3. Los campos legacy (`estimatedGold`, `estimatedSpirit`) se mantienen por compatibilidad
4. Las nuevas monedas se integran automáticamente en todas las vistas
5. Los iconos son placeholders y deben reemplazarse con los reales de GW2
