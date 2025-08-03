'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Search, Shield, Sword, Zap, Key, AlertCircle, Package, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';

interface Character {
  name: string;
  profession: string;
  level: number;
  race: string;
  specialization?: string;
  world: number;
  equipment?: unknown[];
  inventory?: {
    bags?: Array<{
      id: number;
      size: number;
      inventory: Array<{
        id: number;
        count: number;
        binding?: string;
        bound_to?: string;
        charges?: number;
        infusions?: number[];
        upgrades?: number[];
        upgrade_slot_indices?: number[];
        skin?: number;
        dyes?: number[];
        stats?: {
          id: number;
          attributes: Record<string, number>;
        };
        name?: string;
        icon?: string;
        rarity?: string;
        level?: number;
        vendor_value?: number;
        description?: string;
      } | null>;
    }>;
  } | null;
}

const CharactersPage = () => {
  const { isAuthenticated } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [expandedInventories, setExpandedInventories] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<{ id: number; name?: string; icon?: string; rarity?: string; count: number; vendor_value?: number; description?: string; level?: number; binding?: string; bound_to?: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('gw2_api_key');
      setHasApiKey(!!apiKey);
      return apiKey;
    };

    const fetchCharactersData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiKey = checkApiKey();
        if (!apiKey) {
          setError('No hay API key configurada');
          return;
        }
        
        const response = await fetch(`/api/gw2/characters?api_key=${apiKey}`);
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        } else {
          console.error('Error response:', response.status, response.statusText);
          if (response.status === 401) {
            setError('API key inválida o sin permisos suficientes');
          } else {
            setError('Error al cargar los personajes');
          }
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        setError('Error de conexión al cargar los personajes');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCharactersData();
    }
  }, [isAuthenticated]);

  const filteredCharacters = characters.filter(character => 
    character && character.name && character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProfessionIcon = (profession: string) => {
    switch (profession.toLowerCase()) {
      case 'guardian': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'warrior': return <Sword className="w-5 h-5 text-red-500" />;
      case 'ranger': return <Zap className="w-5 h-5 text-green-500" />;
      default: return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRarityBorderColor = (rarity: string | undefined) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'border-yellow-400';
      case 'ascended': return 'border-purple-400';
      case 'exotic': return 'border-orange-400';
      case 'rare': return 'border-blue-400';
      case 'masterwork': return 'border-green-400';
      case 'fine': return 'border-blue-300';
      case 'basic': return 'border-gray-400';
      default: return 'border-gray-600';
    }
  };

  const getRarityTextColor = (rarity: string | undefined) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'text-yellow-400';
      case 'ascended': return 'text-purple-400';
      case 'exotic': return 'text-orange-400';
      case 'rare': return 'text-blue-400';
      case 'masterwork': return 'text-green-400';
      case 'fine': return 'text-blue-300';
      case 'basic': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const formatGold = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    
    let result = '';
    if (gold > 0) result += `${gold}g `;
    if (silver > 0) result += `${silver}s `;
    if (copperRemaining > 0 || result === '') result += `${copperRemaining}c`;
    
    return result.trim();
  };

  const toggleInventory = (characterName: string) => {
    const newExpanded = new Set(expandedInventories);
    if (newExpanded.has(characterName)) {
      newExpanded.delete(characterName);
    } else {
      newExpanded.add(characterName);
    }
    setExpandedInventories(newExpanded);
  };

  const handleItemClick = (item: { id: number; name?: string; icon?: string; rarity?: string; count: number; vendor_value?: number; description?: string; level?: number; binding?: string; bound_to?: string } | null) => {
    if (item) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };



  const renderInventory = (character: Character) => {
    if (!character.inventory?.bags) {
      return (
        <div className="text-center py-4 text-gray-400">
          <Package className="w-8 h-8 mx-auto mb-2" />
          <p>No hay inventario disponible</p>
        </div>
      );
    }

    if (character.inventory.bags.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">
          <Package className="w-8 h-8 mx-auto mb-2" />
          <p>Inventario vacío</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {character.inventory.bags.map((bag, bagIndex) => (
          <div key={`${character.name}-bag-${bagIndex}`} className="bg-gray-800 rounded-lg p-4">
                         <div className="flex items-center justify-between mb-3">
               <div className="flex items-center">
                 <Package className="w-4 h-4 text-gray-400 mr-2" />
                 <h5 className="text-sm font-semibold text-gray-300">
                   Bolsa {bag.id || bagIndex + 1}
                 </h5>
               </div>
              <span className="text-xs text-gray-400">
                {bag.inventory?.filter(item => item !== null).length || 0}/{bag.size || 0} slots
              </span>
            </div>
            
            <div className="grid grid-cols-10 gap-0.5">
              {Array.from({ length: bag.size || 0 }, (_, slotIndex) => {
                const item = bag.inventory?.[slotIndex];
                const uniqueKey = `${character.name}-bag-${bagIndex}-slot-${slotIndex}`;
                
                return (
                  <div 
                    key={uniqueKey} 
                    className={`
                      w-12 h-16 rounded border-2 flex flex-col items-center justify-center p-0.5 relative
                      ${item 
                        ? `${getRarityBorderColor(item.rarity)} bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer group` 
                        : 'border-dashed border-gray-600 bg-gray-800'
                      }
                    `}
                    title={item?.name || `Slot ${slotIndex + 1}`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item && item.icon && (
                      <Image 
                        src={item.icon} 
                        alt={item.name || `Item ${item.id}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain mb-1"
                      />
                    )}

                    {/* Quantity display */}
                    {item && item.count > 1 && (
                      <span className="text-lg text-white font-bold absolute inset-0 flex items-center justify-center drop-shadow-lg">
                        {item.count}
                      </span>
                    )}

                    {/* Price display at bottom */}
                    {item && item.vendor_value !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-xs py-0.5 flex items-center justify-center">
                        <div className="flex items-center">
                          {formatGold(item.vendor_value)}
                          <Image 
                            src="/images/expansions/Copper.png" 
                            alt="Copper" 
                            width={8} 
                            height={8} 
                            className="ml-1" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Requerido</h2>
          <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mi Cuenta
          </Link>
          <h1 className="text-3xl font-bold mb-2">Personajes</h1>
          <p className="text-gray-400">Tus personajes y equipamiento</p>
        </div>

        {/* API Key Warning */}
        {hasApiKey === false && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">API Key Requerida</h3>
                <p className="text-yellow-300 text-sm mb-3">
                  Para ver tus personajes, necesitas configurar tu API key de Guild Wars 2.
                </p>
                <Link 
                  href="/account/settings" 
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
                >
                  Configurar API Key
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                <p className="text-red-300 text-sm mb-3">{error}</p>
                {error.includes('API key') && (
                  <Link 
                    href="/account/settings" 
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Revisar Configuración
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        {hasApiKey && !error && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar personajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando personajes...</p>
          </div>
        ) : hasApiKey && !error && (
          <div className="space-y-6">
            {filteredCharacters.map((character) => (
              <div key={character.name} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getProfessionIcon(character.profession)}
                    <div className="ml-3">
                      <h3 className="text-xl font-semibold">{character.name}</h3>
                      <p className="text-gray-400 text-sm">{character.profession}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleInventory(character.name)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    {expandedInventories.has(character.name) ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Ocultar Inventario
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Ver Inventario
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                  <div>
                    <strong>Nivel:</strong> {character.level}
                  </div>
                  <div>
                    <strong>Raza:</strong> {character.race}
                  </div>
                  <div>
                    <strong>Especialización:</strong> {character.specialization || 'Ninguna'}
                  </div>
                  <div>
                    <strong>Mundo:</strong> {character.world}
                  </div>
                </div>

                {/* Inventario expandible */}
                {expandedInventories.has(character.name) && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Inventario
                    </h4>
                    {renderInventory(character)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasApiKey && !error && filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Sin personajes</h3>
            <p className="text-gray-400">No se encontraron personajes</p>
          </div>
                 )}

        {/* Item Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {selectedItem.icon && (
                    <Image 
                      src={selectedItem.icon} 
                      alt={selectedItem.name || `Item ${selectedItem.id}`}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedItem.name || `Item ${selectedItem.id}`}
                    </h3>
                    <p className={`text-sm ${getRarityTextColor(selectedItem.rarity)}`}>
                      {selectedItem.rarity ? selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1) : 'Unknown'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {selectedItem.count > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cantidad:</span>
                    <span className="text-white font-semibold">{selectedItem.count}</span>
                  </div>
                )}

                {selectedItem.level && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nivel:</span>
                    <span className="text-white">{selectedItem.level}</span>
                  </div>
                )}

                {selectedItem.vendor_value !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor de Venta:</span>
                    <span className="text-white font-semibold">{formatGold(selectedItem.vendor_value)}</span>
                  </div>
                )}

                {selectedItem.description && (
                  <div>
                    <span className="text-gray-400 block mb-1">Descripción:</span>
                    <p className="text-white text-xs leading-relaxed">{selectedItem.description}</p>
                  </div>
                )}

                {selectedItem.binding && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vinculación:</span>
                    <span className="text-orange-400">{selectedItem.binding}</span>
                  </div>
                )}

                {selectedItem.bound_to && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vinculado a:</span>
                    <span className="text-orange-400">{selectedItem.bound_to}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
       </div>
     </div>
   );
 };

export default CharactersPage; 