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
    
    if (body.name) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(body.name);
      paramIndex++;
    }
    
    if (body.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(body.description);
      paramIndex++;
    }
    
    if (body.estimatedTime) {
      updateFields.push(`estimated_time = $${paramIndex}`);
      values.push(body.estimatedTime);
      paramIndex++;
    }
    
    if (body.estimatedGold) {
      updateFields.push(`estimated_gold = $${paramIndex}`);
      values.push(body.estimatedGold);
      paramIndex++;
    }
    
    if (body.expansion) {
      updateFields.push(`expansion = $${paramIndex}`);
      values.push(body.expansion);
      paramIndex++;
    }
    
    if (body.selected !== undefined) {
      updateFields.push(`selected = $${paramIndex}`);
      values.push(body.selected);
      paramIndex++;
    }
    
    if (body.map) {
      updateFields.push(`map = $${paramIndex}`);
      values.push(body.map);
      paramIndex++;
    }
    
    if (body.requirements) {
      updateFields.push(`requirements = $${paramIndex}`);
      values.push(JSON.stringify(body.requirements));
      paramIndex++;
    }
    
    if (body.tags) {
      updateFields.push(`tags = $${paramIndex}`);
      values.push(JSON.stringify(body.tags));
      paramIndex++;
    }
    
    if (body.waypoints) {
      updateFields.push(`waypoints = $${paramIndex}`);
      values.push(JSON.stringify(body.waypoints));
      paramIndex++;
    }
    
    if (body.type) {
      updateFields.push(`type = $${paramIndex}`);
      values.push(body.type);
      paramIndex++;
    }
    
    // Agregar updated_at automáticamente
    updateFields.push(`updated_at = NOW()`);
    
    // Agregar el ID al final
    values.push(id);
    
    const query = `
      UPDATE farm_items 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, description, estimated_time as "estimatedTime", 
                estimated_gold as "estimatedGold", expansion, selected, 
                map, requirements, tags, waypoints, type, 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Farm no encontrado' }, { status: 404 });
    }
    
    const row = result.rows[0];
    const farm = {
      ...row,
      requirements: row.requirements || [],
      tags: row.tags || [],
      waypoints: row.waypoints || [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

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