import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/server/jwt-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Asegurar que no se cachee

export async function GET(request: NextRequest) {
    try {
        const authResult = authenticateRequest(request);

        if (!authResult.isAuthenticated || !authResult.user) {
            return NextResponse.json({
                authenticated: false,
                error: authResult.error || 'Not authenticated',
                user: null
            }, { status: 401 });
        }

        // Retornar información completa para diagnóstico
        return NextResponse.json({
            authenticated: true,
            user: {
                id: authResult.user.userId, // jwt-utils usa userId en el payload
                username: authResult.user.username,
                email: authResult.user.email,
                role: authResult.user.role,
                isActive: authResult.user.isActive,
                // Incluir claims del token para ver expiración
                iat: authResult.user.iat,
                exp: authResult.user.exp
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
