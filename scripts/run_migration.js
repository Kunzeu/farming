const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configurar la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
  try {
    console.log('🔄 Ejecutando migración para agregar campos de edición por moderadores...');
    
    // Leer el archivo SQL
    const migrationPath = path.join(__dirname, '..', 'add_farm_editing_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Ejecutar la migración
    const result = await pool.query(migrationSQL);
    
    console.log('✅ Migración ejecutada exitosamente');
    console.log('📋 Resultados de verificación:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar la migración
runMigration(); 