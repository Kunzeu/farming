import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Discord Token API: Iniciando solicitud...');
    
    const { code } = await request.json();
    console.log('📝 Código recibido:', code ? '✅ Presente' : '❌ Ausente');

    if (!code) {
      console.error('❌ Error: Código de autorización requerido');
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    // Verificar que las variables de entorno estén definidas
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    console.log('🔧 Variables de entorno:');
    console.log('  - DISCORD_CLIENT_ID:', clientId ? '✅ Presente' : '❌ Ausente');
    console.log('  - DISCORD_CLIENT_SECRET:', clientSecret ? '✅ Presente' : '❌ Ausente');
    console.log('  - DISCORD_REDIRECT_URI:', redirectUri ? '✅ Presente' : '❌ Ausente');

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('❌ Error: Configuración de Discord OAuth incompleta');
      console.error('  - clientId:', !!clientId);
      console.error('  - clientSecret:', !!clientSecret);
      console.error('  - redirectUri:', !!redirectUri);
      return NextResponse.json(
        { error: 'Configuración de Discord OAuth incompleta' },
        { status: 500 }
      );
    }

    console.log('🌐 URL de redirección configurada:', redirectUri);
    console.log('🆔 Client ID configurado:', clientId);

    // Intercambiar el código por un token de acceso
    console.log('🔄 Intercambiando código por token...');
    
    const tokenRequestBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    });

    console.log('📤 Enviando solicitud a Discord con:');
    console.log('  - grant_type: authorization_code');
    console.log('  - redirect_uri:', redirectUri);
    console.log('  - code length:', code.length);

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    console.log('📥 Respuesta de Discord recibida:');
    console.log('  - Status:', tokenResponse.status);
    console.log('  - Status Text:', tokenResponse.statusText);
    console.log('  - Headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Error de Discord OAuth:');
      console.error('  - Status:', tokenResponse.status);
      console.error('  - Error Data:', errorData);
      
      // Intentar parsear el error como JSON para más detalles
      try {
        const errorJson = JSON.parse(errorData);
        console.error('  - Error JSON:', errorJson);
        return NextResponse.json(
          { 
            error: 'Error al obtener token de Discord',
            details: errorJson.error_description || errorJson.error || 'Error desconocido',
            discord_status: tokenResponse.status
          },
          { status: 400 }
        );
      } catch {
        return NextResponse.json(
          { 
            error: 'Error al obtener token de Discord',
            details: errorData,
            discord_status: tokenResponse.status
          },
          { status: 400 }
        );
      }
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token obtenido exitosamente:');
    console.log('  - Token Type:', tokenData.token_type);
    console.log('  - Expires In:', tokenData.expires_in);
    console.log('  - Access Token Length:', tokenData.access_token?.length || 0);

    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });

  } catch (error) {
    console.error('💥 Error interno en Discord token API:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 