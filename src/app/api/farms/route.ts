// API Route para farms con PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    const query = `
      SELECT f.id, f.name, f.description, f.estimated_time as "estimatedTime", 
             f.estimated_gold as "estimatedGold", f.estimated_spirit as "estimatedSpirit",
             f.expansion, f.selected, f.map, f.requirements, f.tags, f.waypoints, f.type, 
             f.status, f.created_by as "createdBy", f.created_at as "createdAt", f.updated_at as "updatedAt",
             f.is_important as "isImportant",
             u.username as "createdByUsername"
      FROM farm_items f
      LEFT JOIN users u ON f.created_by = u.id
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(query);
    const farms = result.rows.map(row => ({
      ...row,
      expansion: typeof row.expansion === 'string' ? JSON.parse(row.expansion) : row.expansion,
      requirements: row.requirements || [],
      tags: row.tags || [],
      waypoints: row.waypoints || [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));

    return NextResponse.json(farms);
  } catch (error) {
    console.error('Error fetching farms:', error);
    return NextResponse.json({ 
      error: 'Error fetching farms', 
      details: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = crypto.randomUUID();
    
    const query = `
      INSERT INTO farm_items (id, name, description, estimated_time, estimated_gold, 
                             estimated_spirit, expansion, selected, map, requirements, tags, waypoints, type,
                             status, created_by, is_important)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, name, description, estimated_time as "estimatedTime", 
                estimated_gold as "estimatedGold", estimated_spirit as "estimatedSpirit",
                expansion, selected, map, requirements, tags, waypoints, type, 
                status, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt",
                is_important as "isImportant"
    `;
    
    // Determinar el status basado en el rol del usuario
    const status = body.createdByRole === 'admin' ? 'approved' : 'pending';
    
    const values = [
      id, body.name, body.description, body.estimatedTime, body.estimatedGold,
      body.estimatedSpirit, JSON.stringify(body.expansion), body.selected, body.map, 
      JSON.stringify(body.requirements || []),
      JSON.stringify(body.tags || []),
      JSON.stringify(body.waypoints || []),
      body.type, status, body.createdBy, body.isImportant || false
    ];
    
    const result = await pool.query(query, values);
    const row = result.rows[0];
    
    // Obtener el username del creador
    const userQuery = 'SELECT username FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [row.createdBy]);
    const createdByUsername = userResult.rows[0]?.username || null;
    
    const farm = {
      ...row,
      createdByUsername,
      requirements: row.requirements || [],
      tags: row.tags || [],
      waypoints: row.waypoints || [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error creating farm:', error);
    return NextResponse.json({ 
      error: 'Error creating farm', 
      details: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
    }, { status: 500 });
  }
} 