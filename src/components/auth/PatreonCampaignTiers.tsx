'use client';

import { usePatreonCampaignTiers } from '@/hooks/usePatreonCampaignTiers';
import { useState } from 'react';
import { Loader2, Crown, Users, DollarSign } from 'lucide-react';

export default function PatreonCampaignTiers() {
  const { tiers, loading, error, fetchTiers, clearError } = usePatreonCampaignTiers();
  const [campaignId, setCampaignId] = useState('12496802');
  const [accessToken, setAccessToken] = useState<string>('');

  const handleFetchTiers = async () => {
    if (!accessToken) {
      alert('Por favor, ingresa un token de acceso de Patreon válido');
      return;
    }
    
    await fetchTiers(accessToken, campaignId);
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Tiers de Campaña de Patreon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Obtén información sobre los tiers disponibles en tu campaña de Patreon
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Token de Acceso de Patreon
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Ingresa tu token de acceso de Patreon"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="ID de campaña"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button 
              onClick={handleFetchTiers} 
              disabled={loading || !accessToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              {loading ? 'Cargando...' : 'Obtener Tiers'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              <button 
                onClick={clearError}
                className="mt-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
              >
                Limpiar error
              </button>
            </div>
          )}

          {!accessToken && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Ingresa un token de acceso de Patreon válido para usar esta funcionalidad.
              </p>
            </div>
          )}
        </div>
      </div>

      {tiers && tiers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tier.attributes.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatAmount(tier.attributes.amount_cents)}€/mes
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tier.attributes.published 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {tier.attributes.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {tier.attributes.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {tier.attributes.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{tier.attributes.patron_count}</span>
                      <span>{tier.attributes.patron_count === 1 ? 'patrón' : 'patrones'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{formatAmount(tier.attributes.amount_cents)}€</span>
                      <span>/mes</span>
                    </div>
                  </div>
                  
                  {/* Ingresos estimados del tier */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span className="font-medium">
                      Ingresos estimados: {formatAmount(tier.attributes.amount_cents * tier.attributes.patron_count)}€/mes
                    </span>
                  </div>
                </div>

                {tier.attributes.published_at && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Publicado: {formatDate(tier.attributes.published_at)}
                  </p>
                )}

                {tier.attributes.url && (
                  <button 
                    onClick={() => window.open(tier.attributes.url, '_blank')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Ver en Patreon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tiers && tiers.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron tiers para esta campaña.</p>
        </div>
      )}

      {/* Resumen de estadísticas */}
      {tiers && tiers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumen de la Campaña
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {tiers.reduce((total, tier) => total + tier.attributes.patron_count, 0)}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Total Patrones</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {tiers.filter(tier => tier.attributes.published).length}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">Tiers Activos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatAmount(tiers.reduce((total, tier) => 
                  total + (tier.attributes.amount_cents * tier.attributes.patron_count), 0
                ))}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">€/mes Ingresos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}