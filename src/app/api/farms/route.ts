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
             f.expansion, f.selected, f.status, f.created_by as "createdBy", 
             f.created_at as "createdAt", f.updated_at as "updatedAt",
             u.username as "createdByUsername"
      FROM farm_items f
      LEFT JOIN users u ON f.created_by = u.id
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(query);
    const farms = result.rows.map(row => ({
      ...row,
      expansion: typeof row.expansion === 'string' ? JSON.parse(row.expansion) : row.expansion,
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
    
    // Debug: Log the received data
    console.log('Received farm data:', JSON.stringify(body, null, 2));

    // Validar campos requeridos
    if (!body.name || !body.description || !body.estimatedTime) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: 'Name, description, and estimatedTime are required fields'
      }, { status: 400 });
    }

    // Validar que al menos uno de estimatedGold o estimatedSpirit esté presente
    if (!body.estimatedGold && !body.estimatedSpirit) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: 'At least one of estimatedGold or estimatedSpirit must be provided'
      }, { status: 400 });
    }

    // Validar que createdBy esté presente
    if (!body.createdBy) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: 'createdBy is required'
      }, { status: 400 });
    }

    // Validar que createdByRole esté presente y sea válido
    if (!body.createdByRole) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: 'createdByRole is required'
      }, { status: 400 });
    }

    // Validar que solo moderadores y admins puedan crear farms
    if (body.createdByRole === 'user') {
      return NextResponse.json({ 
        error: 'Permission denied', 
        details: 'Regular users cannot create farms. Only moderators and admins can create farms.'
      }, { status: 403 });
    }

    const id = crypto.randomUUID();
    
    const query = `
      INSERT INTO farm_items (id, name, description, estimated_time, estimated_gold, 
                             estimated_spirit, expansion, selected, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, description, estimated_time as "estimatedTime", 
                estimated_gold as "estimatedGold", estimated_spirit as "estimatedSpirit",
                expansion, selected, status, created_by as "createdBy", 
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    // Determinar el status basado en el rol del usuario
    const status = body.createdByRole === 'admin' ? 'approved' : 'pending';
    
    const values = [
      id, body.name, body.description, body.estimatedTime, body.estimatedGold,
      body.estimatedSpirit, JSON.stringify(body.expansion), body.selected, status, body.createdBy
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
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error creating farm:', error);
    
    // Proporcionar información más detallada del error
    let errorDetails = 'Unknown error';
    let errorCode = 'UNKNOWN';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      if ('code' in error) {
        errorCode = String(error.code);
      }
    } else {
      errorDetails = String(error);
    }
    
    // Log adicional para debugging
    console.error('Error details:', {
      message: errorDetails,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({ 
      error: 'Error creating farm', 
      details: errorDetails,
      code: errorCode
    }, { status: 500 });
  }
} 