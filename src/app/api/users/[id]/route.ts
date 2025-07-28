import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    // Construir la query dinámicamente solo con los campos que se envían
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (body.email) {
      updateFields.push(`email = $${paramIndex}`);
      values.push(body.email);
      paramIndex++;
    }
    
    if (body.username) {
      updateFields.push(`username = $${paramIndex}`);
      values.push(body.username);
      paramIndex++;
    }
    
    if (body.password) {
      updateFields.push(`password = $${paramIndex}`);
      values.push(body.password);
      paramIndex++;
    }
    
    if (body.role) {
      updateFields.push(`role = $${paramIndex}`);
      values.push(body.role);
      paramIndex++;
    }
    
    if (body.isActive !== undefined) {
      updateFields.push(`is_active = $${paramIndex}`);
      values.push(body.isActive);
      paramIndex++;
    }
    
    if (body.preferences) {
      updateFields.push(`preferences = $${paramIndex}`);
      values.push(JSON.stringify(body.preferences));
      paramIndex++;
    }
    
    // Agregar updated_at automáticamente
    updateFields.push(`updated_at = NOW()`);
    
    // Agregar el ID al final
    values.push(id);
    
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, username, password, role, is_active as "isActive",
                preferences, created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    const row = result.rows[0];
    const user = {
      ...row,
      preferences: row.preferences || {},
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      error: 'Error updating user', 
      details: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      error: 'Error deleting user', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 