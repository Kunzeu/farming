-- Migración para agregar campos de edición por moderadores
-- Ejecutar este script en tu base de datos PostgreSQL

-- Agregar columnas para tracking de ediciones por moderadores
ALTER TABLE farm_items 
ADD COLUMN IF NOT EXISTS last_edited_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP;

-- Agregar comentarios para documentar los nuevos campos
COMMENT ON COLUMN farm_items.last_edited_by IS 'ID del moderador que realizó la última edición limitada';
COMMENT ON COLUMN farm_items.last_edited_at IS 'Fecha y hora de la última edición por moderador';

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'farm_items' 
AND column_name IN ('last_edited_by', 'last_edited_at'); 