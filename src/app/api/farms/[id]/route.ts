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
    
    console.log('🔄 PUT /api/farms/[id] - Iniciando actualización...');
    console.log('🆔 ID:', id);
    console.log('📝 Body:', body);
    
    // Construir la query dinámicamente solo con los campos que se envían
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (body.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(body.name);
      paramIndex++;
    }
    
    if (body.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(body.description);
      paramIndex++;
    }
    
    if (body.estimatedTime !== undefined) {
      updateFields.push(`estimated_time = $${paramIndex}`);
      values.push(body.estimatedTime);
      paramIndex++;
    }
    
    if (body.estimatedGold !== undefined) {
      updateFields.push(`estimated_gold = $${paramIndex}`);
      values.push(body.estimatedGold);
      paramIndex++;
    }
    
    if (body.estimatedSpirit !== undefined) {
      updateFields.push(`estimated_spirit = $${paramIndex}`);
      values.push(body.estimatedSpirit);
      paramIndex++;
    }
    
    if (body.expansion !== undefined) {
      updateFields.push(`expansion = $${paramIndex}`);
      values.push(JSON.stringify(body.expansion));
      paramIndex++;
    }
    
    if (body.selected !== undefined) {
      updateFields.push(`selected = $${paramIndex}`);
      values.push(body.selected);
      paramIndex++;
    }
    
    if (body.map !== undefined) {
      updateFields.push(`map = $${paramIndex}`);
      values.push(body.map);
      paramIndex++;
    }
    
    if (body.requirements !== undefined) {
      updateFields.push(`requirements = $${paramIndex}`);
      values.push(JSON.stringify(body.requirements));
      paramIndex++;
    }
    
    if (body.tags !== undefined) {
      updateFields.push(`tags = $${paramIndex}`);
      values.push(JSON.stringify(body.tags));
      paramIndex++;
    }
    
    if (body.waypoints !== undefined) {
      updateFields.push(`waypoints = $${paramIndex}`);
      values.push(JSON.stringify(body.waypoints));
      paramIndex++;
    }
    
    if (body.type !== undefined) {
      updateFields.push(`type = $${paramIndex}`);
      values.push(body.type);
      paramIndex++;
    }
    
    if (body.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(body.status);
      paramIndex++;
    }
    
    if (body.isImportant !== undefined) {
      updateFields.push(`is_important = $${paramIndex}`);
      values.push(body.isImportant);
      paramIndex++;
    }
    
    // Campos de edición por moderadores (comentados hasta que se ejecute la migración)
    // if (body.lastEditedBy !== undefined) {
    //   updateFields.push(`last_edited_by = $${paramIndex}`);
    //   values.push(body.lastEditedBy);
    //   paramIndex++;
    // }
    
    // if (body.lastEditedAt !== undefined) {
    //   updateFields.push(`last_edited_at = $${paramIndex}`);
    //   values.push(body.lastEditedAt);
    //   paramIndex++;
    // }
    
    // Agregar updated_at automáticamente
    updateFields.push(`updated_at = NOW()`);
    
    // Agregar el ID al final
    values.push(id);
    
    const query = `
      UPDATE farm_items 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, description, estimated_time as "estimatedTime", 
                estimated_gold as "estimatedGold", estimated_spirit as "estimatedSpirit",
                expansion, selected, map, requirements, tags, waypoints, type, 
                status, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt",
                is_important as "isImportant"
    `;
    
    console.log('🔍 Query:', query);
    console.log('📊 Values:', values);
    
    const result = await pool.query(query, values);
    
    console.log('📋 Query result rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('❌ Farm no encontrado');
      return NextResponse.json({ error: 'Farm no encontrado' }, { status: 404 });
    }
    
    const row = result.rows[0];
    
    // Obtener el username del creador
    const userQuery = 'SELECT username FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [row.createdBy]);
    const createdByUsername = userResult.rows[0]?.username || null;
    
    const farm = {
      ...row,
      createdByUsername,
      expansion: typeof row.expansion === 'string' ? JSON.parse(row.expansion) : row.expansion,
      requirements: row.requirements || [],
      tags: row.tags || [],
      waypoints: row.waypoints || [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

    console.log('✅ Farm actualizado exitosamente:', farm);
    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error updating farm:', error);
    return NextResponse.json({ 
      error: 'Error updating farm', 
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
    
    const query = 'DELETE FROM farm_items WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Farm no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Farm eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    return NextResponse.json({ 
      error: 'Error deleting farm', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 