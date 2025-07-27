// API Route para users con PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  try {
    // Debug: verificar que DATABASE_URL esté configurada
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL no está configurada');
      return NextResponse.json({ 
        error: 'Database configuration missing',
        details: 'DATABASE_URL environment variable not set'
      }, { status: 500 });
    }
    
    console.log('✅ DATABASE_URL configurada, conectando...');
    if (email) {
      // Buscar por email
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt"
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
               created_at as "createdAt", updated_at as "updatedAt"
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
      
    } else {
      // Obtener todos los usuarios
      const query = `
        SELECT id, email, username, password, role, is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt"
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
    
    // Validar que email y username sean únicos
    const checkQuery = `
      SELECT email, username FROM users 
      WHERE email = $1 OR username = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [body.email, body.username]);
    
    if (checkResult.rows.length > 0) {
      const existingUser = checkResult.rows[0];
      let errorMessage = '';
      
      if (existingUser.email === body.email && existingUser.username === body.username) {
        errorMessage = 'El email y username ya están en uso';
      } else if (existingUser.email === body.email) {
        errorMessage = 'El email ya está registrado';
      } else if (existingUser.username === body.username) {
        errorMessage = 'El username ya está en uso';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        field: existingUser.email === body.email ? 'email' : 'username'
      }, { status: 409 }); // 409 Conflict
    }
    
    const id = crypto.randomUUID();
    
    const query = `
      INSERT INTO users (id, email, username, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, username, password, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const values = [id, body.email, body.username, body.password, body.role, body.isActive];
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