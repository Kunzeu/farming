import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      console.error('No authorization code provided');
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    // Verificar que las variables de entorno estén definidas
    const clientId = process.env.PATREON_CLIENT_ID;
    const clientSecret = process.env.PATREON_CLIENT_SECRET;
    
    // Detectar el entorno y construir la URI de redirección apropiada
    const host = request.headers.get('host') || '';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = process.env.PATREON_REDIRECT_URI || 
      (host ? `${protocol}://${host}/auth/patreon/callback` : 'https://www.true-farming.com/auth/patreon/callback');

    console.log('Patreon OAuth Config:', {
      clientId: clientId ? `Set (${clientId.substring(0, 10)}...)` : 'Missing',
      clientSecret: clientSecret ? 'Set' : 'Missing',
      redirectUri: redirectUri || 'Missing',
      host: host
    });
    const codePreview = typeof code === 'string' ? `${code.slice(0, 6)}...${code.slice(-6)}` : null;
    console.log('Patreon token request debug:', {
      hasCode: !!code,
      codeLength: typeof code === 'string' ? code.length : null,
      codePreview,
      redirectUriUsed: redirectUri,
      referer: request.headers.get('referer') || null,
      origin: request.headers.get('origin') || null,
    });

    if (!clientId || !clientSecret) {
      console.error('Missing Patreon OAuth environment variables:', {
        clientId: !!clientId,
        clientSecret: !!clientSecret,
        redirectUri: redirectUri
      });
      return NextResponse.json(
        { error: 'Configuración de Patreon OAuth incompleta' },
        { status: 500 }
      );
    }

    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch('https://www.patreon.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Error de Patreon OAuth:', errorData);
      let errorMessage = 'Error al obtener token de Patreon';
      
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error_description || parsedError.error || errorMessage;
        console.error('Patreon OAuth Error Details:', {
          error: parsedError.error,
          error_description: parsedError.error_description,
          error_uri: parsedError.error_uri
        });
      } catch {
        console.error('Raw error response:', errorData);
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });

  } catch (error) {
    console.error('Error en Patreon token API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
