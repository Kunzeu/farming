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
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const query = `
      SELECT id, email, username, password, role, is_active as "isActive",
             created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const row = result.rows[0];
    return NextResponse.json({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('Updating user with data:', body);
    
    // Validar que el rol sea válido
    const validRoles = ['user', 'admin', 'moderator'];
    if (body.role && !validRoles.includes(body.role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be one of: user, admin, moderator' 
      }, { status: 400 });
    }
    
    // Construir query dinámicamente
    const updateFields: string[] = [];
    const values: (string | boolean | null)[] = [];
    let paramIndex = 1;
    
    if (body.email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      values.push(body.email);
    }
    
    if (body.username !== undefined) {
      updateFields.push(`username = $${paramIndex++}`);
      values.push(body.username);
    }
    
    if (body.password !== undefined) {
      updateFields.push(`password = $${paramIndex++}`);
      values.push(body.password);
    }
    
    if (body.role !== undefined) {
      updateFields.push(`role = $${paramIndex++}`);
      values.push(body.role);
    }
    
    if (body.isActive !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      values.push(body.isActive);
    }
    
    if (body.discordId !== undefined) {
      updateFields.push(`discord_id = $${paramIndex++}`);
      values.push(body.discordId);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Agregar updated_at automáticamente
    updateFields.push(`updated_at = NOW()`);
    
    // Agregar el ID al final para la condición WHERE
    values.push(params.id);
    
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, username, password, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
    `;
    
    console.log('Executing update query:', query);
    console.log('With values:', values);
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const row = result.rows[0];
    const user = {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
    
    console.log('User updated successfully:', user);
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
} 