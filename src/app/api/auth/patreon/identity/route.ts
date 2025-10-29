import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Obtener información del usuario y su membresía de Patreon
    // Incluimos fields y includes para obtener toda la información necesaria
    const identityResponse = await fetch(
      'https://www.patreon.com/api/oauth2/v2/identity?' + new URLSearchParams({
        'include': 'memberships,memberships.currently_entitled_tiers',
        'fields[user]': 'email,first_name,full_name,image_url,thumb_url,url,vanity',
        'fields[member]': 'patron_status,currently_entitled_amount_cents,lifetime_support_cents,campaign_lifetime_support_cents,last_charge_status,last_charge_date,pledge_relationship_start',
        'fields[tier]': 'amount_cents,title,description,image_url',
      }),
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!identityResponse.ok) {
      const errorData = await identityResponse.text();
      console.error('❌ Error obteniendo identidad de Patreon:', {
        status: identityResponse.status,
        statusText: identityResponse.statusText,
        errorData: errorData
      });
      return NextResponse.json(
        { error: 'Error al obtener información del usuario de Patreon' },
        { status: 400 }
      );
    }

    const identityData = await identityResponse.json();

    // DEBUG: Log completo de la respuesta de Patreon en el servidor
    console.log('🔍 SERVER - Respuesta completa de Patreon:', {
      data: identityData.data,
      included: identityData.included?.map((item: { type: string; id: string; attributes?: Record<string, unknown>; relationships?: Record<string, unknown> }) => ({
        type: item.type,
        id: item.id,
        attributes: item.attributes
      }))
    });

    // Extraer información de la membresía en el servidor
    const included = identityData.included || [];
    const membership = included.find((item: { type: string; id: string; attributes?: Record<string, unknown>; relationships?: Record<string, unknown> }) => item.type === 'member');
    
    if (membership) {
      console.log('🔍 SERVER - Membership encontrada:', membership);
      const patreonStatus = membership.attributes?.patron_status;
      console.log('🔍 SERVER - Patreon Status:', patreonStatus);
      
      const tierRelationship = membership.relationships?.currently_entitled_tiers;
      if (tierRelationship?.data?.length > 0) {
        const tierId = tierRelationship.data[0].id;
        const tier = included.find((item: { type: string; id: string; attributes?: Record<string, unknown>; relationships?: Record<string, unknown> }) => item.type === 'tier' && item.id === tierId);
        if (tier) {
          console.log('🔍 SERVER - Tier encontrado:', tier);
          const patreonTier = tier.attributes?.title;
          console.log('🔍 SERVER - Tier Title:', patreonTier);
        }
      }
    }

    return NextResponse.json(identityData);

  } catch (error) {
    console.error('Error en Patreon identity API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
