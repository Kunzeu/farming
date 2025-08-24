-- Script para limpiar monedas obsoletas y preparar para las nuevas
-- Ejecutar en PostgreSQL

-- 1. ELIMINAR MONEDAS OBSOLETAS DEL JSON estimated_rewards
-- NOTA: imperialFavor NO se elimina - es una moneda válida de GW2
UPDATE farm_items 
SET estimated_rewards = estimated_rewards - 'experience' - 'laurels' - 'otherCurrency'
WHERE estimated_rewards IS NOT NULL 
  AND (
    estimated_rewards ? 'experience' OR 
    estimated_rewards ? 'laurels' OR 
    estimated_rewards ? 'otherCurrency'
  );

-- 2. VERIFICAR QUE SE HAYAN ELIMINADO
-- Esta consulta debe devolver 0 filas si la limpieza fue exitosa
SELECT COUNT(*) as farms_con_monedas_obsoletas
FROM farm_items 
WHERE estimated_rewards ? 'experience' 
   OR estimated_rewards ? 'laurels' 
   OR estimated_rewards ? 'otherCurrency';

-- 3. MOSTRAR ESTRUCTURA ACTUAL DE MONEDAS
-- Ver qué monedas quedan en la base de datos
SELECT 
    jsonb_object_keys(estimated_rewards) as monedas_disponibles,
    COUNT(*) as cantidad_farms
FROM farm_items 
WHERE estimated_rewards IS NOT NULL
GROUP BY jsonb_object_keys(estimated_rewards)
ORDER BY monedas_disponibles;

-- 4. LIMPIAR CAMPOS LEGACY (OPCIONAL - DESCOMENTAR SI ESTÁS SEGURO)
-- ALTER TABLE farm_items DROP COLUMN IF EXISTS estimated_gold;
-- ALTER TABLE farm_items DROP COLUMN IF EXISTS estimated_spirit;

-- 5. VERIFICAR INTEGRIDAD DE LA BASE DE DATOS
-- Mostrar un resumen de farms y sus monedas
SELECT 
    COUNT(*) as total_farms,
    COUNT(CASE WHEN estimated_rewards IS NOT NULL THEN 1 END) as farms_con_recompensas,
    COUNT(CASE WHEN estimated_rewards IS NULL THEN 1 END) as farms_sin_recompensas
FROM farm_items;
