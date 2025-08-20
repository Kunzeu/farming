import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    // Verificar que las variables de entorno estén definidas
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Discord OAuth environment variables');
      return NextResponse.json(
        { error: 'Configuración de Discord OAuth incompleta' },
        { status: 500 }
      );
    }

    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Error de Discord OAuth:', errorData);
      return NextResponse.json(
        { error: 'Error al obtener token de Discord' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });

  } catch (error) {
    console.error('Error en Discord token API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 