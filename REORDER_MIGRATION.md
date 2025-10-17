# Migración: Campo de Ordenamiento para Farms

## 📋 Descripción
Esta migración agrega la funcionalidad de reordenamiento manual de farms para administradores.

## 🔧 Cambios Implementados

### 1. Base de Datos
- **Nueva columna**: `order` (INTEGER, nullable) en la tabla `farm_items`
- **Índice**: Creado para mejorar el rendimiento de consultas de ordenamiento
- **Ordenamiento**: Los farms se ordenan por `order ASC NULLS LAST, created_at DESC`

### 2. API
- **GET /api/farms**: Incluye campo `order` en la respuesta y ordena por este campo
- **PUT /api/farms/[id]**: Permite actualizar el campo `order`
- **POST /api/farms**: Incluye campo `order` al crear nuevos farms

### 3. Frontend
- **Admin Panel**: Botones "Subir" y "Bajar" para reordenar farms
- **Farming Routes**: Muestra farms ordenados por el campo `order`
- **Interfaces**: Actualizadas para incluir el campo `order`

## 🚀 Cómo Ejecutar la Migración

### Opción 1: Script Automático
```bash
cd gw2-farming-hub
node run-migration.js
```

### Opción 2: Manual (PostgreSQL)
```sql
-- Conectar a la base de datos y ejecutar:
ALTER TABLE farm_items ADD COLUMN "order" INTEGER;
CREATE INDEX idx_farm_items_order ON farm_items("order");
COMMENT ON COLUMN farm_items."order" IS 'Orden de visualización de los farms (menor número = más arriba)';
```

## ✅ Verificación
Después de ejecutar la migración:

1. **Admin Panel**: Los botones de reordenamiento deben funcionar
2. **Farming Routes**: Los farms deben aparecer en el orden correcto
3. **Base de Datos**: La columna `order` debe existir en `farm_items`

## 🔄 Funcionamiento
- **Menor número = más arriba** en la lista
- **NULL = al final** de la lista
- **Cambios inmediatos** se guardan en la base de datos
- **Compatibilidad** con farms existentes (sin `order` van al final)

## 📝 Notas
- Los farms existentes tendrán `order = NULL` inicialmente
- Los nuevos farms se asignan automáticamente al final de la lista
- El ordenamiento es persistente y se mantiene entre sesiones
