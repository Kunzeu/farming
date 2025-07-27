-- Setup de producción para Supabase
-- Ejecutar en Supabase SQL Editor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de farm items
CREATE TABLE IF NOT EXISTS farm_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_time VARCHAR(50),
    estimated_gold VARCHAR(50),
    expansion VARCHAR(20) CHECK (expansion IN ('core', 'hot', 'pof', 'eod', 'soto', 'jw')),
    selected BOOLEAN DEFAULT false,
    map VARCHAR(255),
    requirements JSONB,
    tags JSONB,
    waypoints JSONB,
    type VARCHAR(20) DEFAULT 'farm' CHECK (type IN ('farm', 'route')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_farm_items_expansion ON farm_items(expansion);
CREATE INDEX IF NOT EXISTS idx_farm_items_type ON farm_items(type);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_farm_items_updated_at ON farm_items;
CREATE TRIGGER update_farm_items_updated_at BEFORE UPDATE ON farm_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar estructura
SELECT 'Setup completado exitosamente!' as status;
SELECT 'users' as tabla, COUNT(*) as registros FROM users;
SELECT 'farm_items' as tabla, COUNT(*) as registros FROM farm_items; 