import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Obtener el ID de campaña de los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId') || '12496802'; // ID por defecto

    // Validar que el campaignId sea válido
    if (!campaignId || !/^\d+$/.test(campaignId)) {
      return NextResponse.json(
        { error: 'ID de campaña inválido' },
        { status: 400 }
      );
    }

    // Obtener los tiers de la campaña de Patreon
    const tiersResponse = await fetch(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/tiers?` + new URLSearchParams({
        'fields[tier]': 'amount_cents,title,description,image_url,patron_count,published,published_at,url,created_at,edited_at',
        'include': 'tier',
      }),
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!tiersResponse.ok) {
      const errorData = await tiersResponse.text();
      console.error('❌ Error obteniendo tiers de campaña de Patreon:', {
        status: tiersResponse.status,
        statusText: tiersResponse.statusText,
        errorData: errorData,
        campaignId: campaignId
      });
      
      let errorMessage = 'Error al obtener tiers de la campaña de Patreon';
      
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error_description || parsedError.error || errorMessage;
      } catch {
        // Si no se puede parsear como JSON, usar el texto crudo
        errorMessage = errorData || errorMessage;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: tiersResponse.status }
      );
    }

    const tiersData = await tiersResponse.json();

    return NextResponse.json(tiersData);

  } catch (error) {
    console.error('Error en Patreon campaign tiers API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
