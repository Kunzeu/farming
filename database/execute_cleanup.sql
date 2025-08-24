-- EJECUTAR ESTE SCRIPT PARA LIMPIAR LAS MONEDAS OBSOLETAS
-- Copia y pega este script en tu cliente de PostgreSQL

-- 1. ELIMINAR MONEDAS OBSOLETAS (NO imperialFavor - es válida)
UPDATE farm_items 
SET estimated_rewards = estimated_rewards - 'experience' - 'laurels' - 'otherCurrency'
WHERE estimated_rewards IS NOT NULL;

-- 2. VERIFICAR QUE SE HAYAN ELIMINADO
SELECT 'Monedas obsoletas eliminadas' as resultado;

-- 3. MOSTRAR MONEDAS DISPONIBLES
SELECT 
    jsonb_object_keys(estimated_rewards) as monedas_disponibles,
    COUNT(*) as cantidad_farms
FROM farm_items 
WHERE estimated_rewards IS NOT NULL
GROUP BY jsonb_object_keys(estimated_rewards)
ORDER BY monedas_disponibles;

-- 4. MOSTRAR RESUMEN
SELECT 
    COUNT(*) as total_farms,
    COUNT(CASE WHEN estimated_rewards IS NOT NULL THEN 1 END) as farms_con_recompensas
FROM farm_items;
