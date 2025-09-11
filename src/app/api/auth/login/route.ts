import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/lib/server/password-utils';
import { pool } from '@/lib/postgres-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Get user from database
    const query = `
      SELECT id, email, username, password, role, is_active as "isActive",
             created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
      FROM users 
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.isActive) {
      return NextResponse.json({ 
        error: 'Account is deactivated' 
      }, { status: 401 });
    }

    // Compare password - handle both plain text and hashed passwords
    let isPasswordValid = false;
    
    // Check if password is hashed (starts with $2a$ or $2b$)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is hashed, use bcrypt comparison
      isPasswordValid = await comparePassword(password, user.password);
    } else {
      // Password is plain text (legacy), compare directly
      isPasswordValid = password === user.password;
      
      // If login is successful with plain text password, hash it for future use
      if (isPasswordValid) {
        const { hashPassword } = await import('@/lib/server/password-utils');
        const hashedPassword = await hashPassword(password);
        
        // Update the password in database to hashed version
        try {
          await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, user.id]
          );
          console.log(`Updated password for user ${user.email} to hashed version`);
        } catch (updateError) {
          console.error('Error updating password to hashed version:', updateError);
          // Don't fail the login, just log the error
        }
      }
    }
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
