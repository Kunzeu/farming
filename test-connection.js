const { Pool } = require('pg');

const connectionString = 'postgresql://postgres.haxfdeqtkbptiwlkikdk:Kunsexy35@aws-0-us-east-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔌 Intentando conectar a Supabase...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa!');
    
    // Probar una query simple
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Tiempo actual de la DB:', result.rows[0].current_time);
    
    // Verificar si existen las tablas
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'farm_items')
    `);
    console.log('📋 Tablas encontradas:', tables.rows.map(row => row.table_name));
    
    client.release();
    
    // Probar la API de users
    console.log('\n🧪 Probando consulta de usuarios...');
    const users = await pool.query('SELECT COUNT(*) as user_count FROM users');
    console.log('👥 Cantidad de usuarios:', users.rows[0].user_count);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('🔍 Código de error:', error.code);
    console.error('📍 Detalles:', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 