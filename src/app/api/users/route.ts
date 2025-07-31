// API Route para users con PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value;
      }
    });
    
    return envVars;
  }
  return {};
}

const envVars = loadEnvFile();
const databaseUrl = envVars.DATABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
pool.query('SELECT NOW()', (err) => {
  if (err) {
    
  } else {
    
  }
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const username = searchParams.get('username');
  const discordId = searchParams.get('discordId');

  try {
    if (email) {
      // Buscar por email
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
        FROM users 
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const row = result.rows[0];
      return NextResponse.json({
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
      
    } else if (username) {
      // Buscar por username
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
        FROM users 
        WHERE username = $1
      `;
      
      const result = await pool.query(query, [username]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const row = result.rows[0];
      return NextResponse.json({
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
      
    } else if (discordId) {
      // Buscar por Discord ID
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
        FROM users 
        WHERE discord_id = $1
      `;
      
      const result = await pool.query(query, [discordId]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const row = result.rows[0];
      return NextResponse.json({
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
      
    } else {
      // Obtener todos los usuarios
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
        FROM users 
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      const users = result.rows.map(row => ({
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      error: 'Error fetching users', 
      details: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    // Validar que email, username y discordId sean únicos
    const checkQuery = `
      SELECT email, username, discord_id FROM users 
      WHERE email = $1 OR username = $2 OR (discord_id = $3 AND $3 IS NOT NULL)
    `;
    
    const checkResult = await pool.query(checkQuery, [body.email, body.username, body.discordId]);
    
    if (checkResult.rows.length > 0) {
      const existingUser = checkResult.rows[0];
      let errorMessage = '';
      let field = '';
      
      if (existingUser.email === body.email) {
        errorMessage = 'El email ya está registrado';
        field = 'email';
      } else if (existingUser.username === body.username) {
        errorMessage = 'El username ya está en uso';
        field = 'username';
      } else if (existingUser.discord_id === body.discordId) {
        errorMessage = 'Esta cuenta de Discord ya está vinculada';
        field = 'discordId';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        field: field
      }, { status: 409 }); // 409 Conflict
    }
    
    const id = crypto.randomUUID();
    
    const query = `
      INSERT INTO users (id, email, username, password, role, is_active, discord_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, username, password, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
    `;
    
    const values = [id, body.email, body.username, body.password, body.role, body.isActive, body.discordId];
    
    const result = await pool.query(query, values);
    const row = result.rows[0];
    
    const user = {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
} 