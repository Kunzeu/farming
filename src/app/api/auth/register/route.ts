import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/server/password-utils';
import { generateToken } from '@/lib/server/jwt-utils';
import { pool } from '@/lib/postgres-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, confirmPassword } = body;

    // Validaciones básicas
    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json({ 
        error: 'Todos los campos son requeridos' 
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ 
        error: 'Las contraseñas no coinciden' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    if (password.length > 50) {
      return NextResponse.json({ 
        error: 'La contraseña no puede tener más de 50 caracteres' 
      }, { status: 400 });
    }

    // Verificar si es el primer usuario (será admin)
    const countQuery = 'SELECT COUNT(*) as count FROM users';
    const countResult = await pool.query(countQuery);
    const isFirstUser = parseInt(countResult.rows[0].count) === 0;

    // Verificar que email y username sean únicos
    const checkQuery = `
      SELECT email, username FROM users 
      WHERE email = $1 OR username = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [email, username]);
    
    if (checkResult.rows.length > 0) {
      const existingUser = checkResult.rows[0];
      let errorMessage = '';
      let field = '';
      
      if (existingUser.email === email) {
        errorMessage = 'El email ya está registrado';
        field = 'email';
      } else if (existingUser.username === username) {
        errorMessage = 'El username ya está en uso';
        field = 'username';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        field: field
      }, { status: 409 });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear usuario en la base de datos
    const id = crypto.randomUUID();
    const role = isFirstUser ? 'admin' : 'user';
    
    const insertQuery = `
      INSERT INTO users (id, email, username, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, username, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    const values = [id, email, username, hashedPassword, role, true];
    
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    // Generar token JWT real
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive
    });

    // Retornar usuario (sin contraseña) y token JWT
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token: token,
      message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}