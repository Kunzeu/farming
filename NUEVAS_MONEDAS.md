# Monedas de Farm Actualizadas

## Descripción
Se han actualizado las monedas de farm del sistema, eliminando las obsoletas y agregando las que faltaban.

## Monedas Disponibles

### Monedas Principales
1. **Gold** - Oro básico del juego
2. **Spirit Shards** - Esquirlas espirituales

### Monedas de Expansión
3. **Karma** (ID: 2) - Moneda básica obtenida por actividades en el mundo
4. **Fractal Relics** (ID: 7) - Moneda obtenida en Fractales de la Niebla
5. **Volatile Magic** (ID: 45) - Moneda de Heart of Thorns
6. **Unbound Magic** (ID: 32) - Moneda de Path of Fire
7. **Rift Essences** (ID: 78) - Moneda de Secrets of the Obscure
8. **Mystic Clovers** (ID: 19675) - Material legendario
9. **Imperial Favor** (ID: 68) - Moneda de End of Dragons

## Monedas Eliminadas
Se han eliminado las siguientes monedas obsoletas:
- ~~Experience~~ (ya no se usa)
- ~~Laurels~~ (ya no se usa)
- ~~Other Currency~~ (ya no se usa)

## Scripts SQL

### Limpieza de Base de Datos
Ejecuta este script en tu base de datos PostgreSQL para limpiar las monedas obsoletas:

```sql
-- ELIMINAR MONEDAS OBSOLETAS (NO imperialFavor - es válida)
UPDATE farm_items 
SET estimated_rewards = estimated_rewards - 'experience' - 'laurels' - 'otherCurrency'
WHERE estimated_rewards IS NOT NULL;

-- VERIFICAR CAMBIOS
SELECT 
    jsonb_object_keys(estimated_rewards) as monedas_disponibles,
    COUNT(*) as cantidad_farms
FROM farm_items 
WHERE estimated_rewards IS NOT NULL
GROUP BY jsonb_object_keys(estimated_rewards)
ORDER BY monedas_disponibles;
```

### Archivos de Scripts
- `database/execute_cleanup.sql` - Script simple para ejecutar
- `database/cleanup_currencies.sql` - Script detallado con verificaciones
- `database/update_currencies.sql` - Script completo con opciones

## Ubicaciones Donde Se Usan

### 1. Panel de Administración (`/admin`)
- Al crear nuevas farms, puedes seleccionar estas monedas
- Se muestran en la lista de opciones de recompensas
- Cada moneda tiene su propio campo de entrada

### 2. Panel de Moderador (`/moderator`)
- Mismas funcionalidades que el panel de admin
- Permite crear farms con estas monedas

### 3. Rutas de Farm (`/farming-routes`)
- Las farms creadas con estas monedas se muestran aquí
- Se pueden filtrar y buscar

### 4. Rutina Diaria (`/daily-routine`)
- Las monedas se muestran en las tarjetas de farm
- Se calculan totales por tipo de moneda
- Se pueden ver en vista de lista y cuadrícula

## Configuración de Iconos

### Archivos de Iconos
Los iconos están ubicados en `/public/images/expansions/`:
- `karma.png`
- `fractal-relic.png`
- `volatile-magic.png`
- `unbound-magic.png`
- `rift-essence.png`
- `mystic-clover.png`
- `Imperial_Favor.png` (ya existía)

### Nota Importante
Los archivos actuales son placeholders. **Debes reemplazarlos** con los iconos reales de Guild Wars 2:
- Tamaño recomendado: 32x32 píxeles
- Formato: PNG
- Descargar desde la API oficial de GW2 o el Wiki

## Cómo Usar

### Crear una Farm con Nuevas Monedas

1. Ve al Panel de Administración o Moderador
2. Haz clic en "Crear Nueva Farm"
3. En "Tipos de Moneda", selecciona las monedas que quieres usar
4. Completa los campos de valor para cada moneda seleccionada
5. Guarda la farm

### Ejemplo de Farm con Múltiples Monedas

```json
{
  "name": "Ruta de Fractales T4",
  "description": "Farm diario de fractales para obtener reliquias y oro",
  "estimatedTime": "01:00:00",
  "estimatedRewards": {
    "gold": "15000",
    "fractalRelics": "50",
    "karma": "5000"
  },
  "expansion": ["core", "hot"],
  "isSolo": false,
  "requiresSquad": true
}
```

## Traducciones

Las monedas están traducidas en:
- Español (es.json)
- Inglés (en.json)
- Alemán (de.json)
- Francés (fr.json)

## Compatibilidad

- Las nuevas monedas son compatibles con el sistema existente
- No afectan farms creadas anteriormente
- Se integran automáticamente en todas las vistas
- Los campos legacy `estimatedGold` y `estimatedSpirit` se mantienen por compatibilidad

## API de Guild Wars 2

Las monedas se basan en la API oficial de GW2:
- Endpoint: `https://api.guildwars2.com/v2/currencies?ids=all`
- Los IDs corresponden a los valores oficiales de la API

## Cambios Realizados

### Código Limpiado
- ✅ Eliminadas monedas obsoletas de todas las interfaces
- ✅ Mantenida ImperialFavor (moneda válida de GW2)
- ✅ Actualizados paneles de administración y moderador
- ✅ Limpiado componente GW2Icon
- ✅ Actualizadas traducciones en todos los idiomas

### Base de Datos
- ✅ Scripts SQL preparados para limpiar monedas obsoletas
- ✅ Estructura JSON actualizada para nuevas monedas
- ✅ Compatibilidad hacia atrás mantenida
