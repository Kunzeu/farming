-- Script para actualizar las monedas de farm en la base de datos
-- Ejecutar este script para limpiar monedas obsoletas y agregar las nuevas

-- 1. LIMPIAR MONEDAS OBSOLETAS
-- NOTA: imperialFavor NO se elimina - es una moneda válida de GW2
UPDATE farm_items 
SET estimated_rewards = estimated_rewards - 'experience' - 'laurels' - 'otherCurrency'
WHERE estimated_rewards IS NOT NULL;

-- 2. AGREGAR NUEVAS MONEDAS (opcional - se pueden agregar dinámicamente)
-- Las nuevas monedas se pueden agregar automáticamente cuando se creen farms
-- pero si quieres asegurarte de que existan en farms existentes, puedes ejecutar:

-- Agregar karma a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"karma": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'karma');

-- Agregar fractalRelics a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"fractalRelics": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'fractalRelics');

-- Agregar volatileMagic a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"volatileMagic": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'volatileMagic');

-- Agregar unboundMagic a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"unboundMagic": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'unboundMagic');

-- Agregar riftEssences a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"riftEssences": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'riftEssences');

-- Agregar mysticClovers a farms que no lo tengan (ejemplo)
UPDATE farm_items 
SET estimated_rewards = COALESCE(estimated_rewards, '{}'::jsonb) || '{"mysticClovers": null}'::jsonb
WHERE estimated_rewards IS NULL OR NOT (estimated_rewards ? 'mysticClovers');

-- 3. VERIFICAR CAMBIOS
-- Verificar que las monedas obsoletas se hayan eliminado
SELECT 
    id,
    name,
    estimated_rewards
FROM farm_items 
WHERE estimated_rewards ? 'experience' 
   OR estimated_rewards ? 'laurels' 
   OR estimated_rewards ? 'otherCurrency';

-- Verificar que las nuevas monedas estén disponibles
SELECT 
    id,
    name,
    estimated_rewards
FROM farm_items 
LIMIT 5;

-- 4. LIMPIAR CAMPOS LEGACY (opcional)
-- Si quieres eliminar completamente los campos legacy estimated_gold y estimated_spirit:
-- ALTER TABLE farm_items DROP COLUMN IF EXISTS estimated_gold;
-- ALTER TABLE farm_items DROP COLUMN IF EXISTS estimated_spirit;

-- NOTA: Los campos legacy se mantienen por compatibilidad hacia atrás
-- pero se pueden eliminar si estás seguro de que no se usan
