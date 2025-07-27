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
      SELECT id, name, description, estimated_time as "estimatedTime", 
             estimated_gold as "estimatedGold", expansion, selected, 
             map, requirements, tags, waypoints, type, 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM farm_items 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    const farms = result.rows.map(row => ({
      ...row,
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
                             expansion, selected, map, requirements, tags, waypoints, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, name, description, estimated_time as "estimatedTime", 
                estimated_gold as "estimatedGold", expansion, selected, 
                map, requirements, tags, waypoints, type, 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const values = [
      id, body.name, body.description, body.estimatedTime, body.estimatedGold,
      body.expansion, body.selected, body.map, 
      JSON.stringify(body.requirements || []),
      JSON.stringify(body.tags || []),
      JSON.stringify(body.waypoints || []),
      body.type
    ];
    
    const result = await pool.query(query, values);
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
    console.error('Error creating farm:', error);
    return NextResponse.json({ 
      error: 'Error creating farm', 
      details: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
    }, { status: 500 });
  }
} 