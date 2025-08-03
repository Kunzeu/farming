'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Wallet, 
  Search, 
  Package, 
  Database, 
  Users, 
  Shield,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';

interface SearchResult {
  id: number;
  name: string;
  icon?: string;
  count: number;
  location: string;
  rarity?: string;
  character?: string;
  slot?: string;
  bag?: number;
  category?: string;
}

const AccountPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'bank' | 'characters' | 'storage'>('all');

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) return;

    setIsSearching(true);
    console.log(`Searching for: "${searchTerm}" in scope: ${searchScope}`);
    
    try {
      const apiKey = localStorage.getItem('gw2_api_key');
      if (!apiKey) {
        console.error('No API key found');
        return;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const response = await fetch(
        `/api/gw2/search?q=${encodeURIComponent(searchTerm)}&scope=${searchScope}&api_key=${apiKey}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Search completed. Found ${data.length} results:`, data);
        setSearchResults(data);
      } else {
        const errorText = await response.text();
        console.error('Error response:', response.status, response.statusText, errorText);
        setSearchResults([]);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Search request cancelled');
      } else {
        console.error('Error searching:', error);
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, searchScope]);

  useEffect(() => {
    if (searchTerm.trim() && searchTerm.length >= 2) {
      const timeoutId = setTimeout(handleSearch, 150);
      return () => clearTimeout(timeoutId);
    } else if (searchTerm.trim() === '') {
      setSearchResults([]);
    }
  }, [searchTerm, searchScope, handleSearch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-400">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Requerido</h2>
          <p className="text-gray-400 mb-6">Necesitas iniciar sesión para acceder a tu cuenta</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  const accountSections = [
    {
      id: 'wallet',
      name: 'Billetera',
      icon: Wallet,
      description: 'Oro, karma, gems y más',
      href: '/account/wallet'
    },
    {
      id: 'bank',
      name: 'Banco',
      icon: Package,
      description: 'Inventario del banco',
      href: '/account/bank'
    },
    {
      id: 'storage',
      name: 'Almacenamiento',
      icon: Database,
      description: 'Material Storage',
      href: '/account/storage'
    },
    {
      id: 'characters',
      name: 'Personajes',
      icon: Users,
      description: 'Tus personajes y equipamiento',
      href: '/account/characters'
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: Settings,
      description: 'Configurar API key y preferencias',
      href: '/account/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Cuenta</h1>
          <p className="text-gray-400">
            Bienvenido, {user?.username || 'Usuario'}
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-500" />
                              Search Items
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search items in your account..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSearchScope('all')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    searchScope === 'all' 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Todo
                </button>
                <button
                  onClick={() => setSearchScope('bank')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    searchScope === 'bank' 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSearchScope('characters')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    searchScope === 'characters' 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSearchScope('storage')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    searchScope === 'storage' 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Database className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Buscando...</p>
              </div>
            )}

                         {!isSearching && searchResults.length > 0 && (
               <div className="space-y-2 max-h-64 overflow-y-auto">
                 {searchResults.slice(0, 10).map((item) => (
                   <div key={item.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                     <div className="flex items-center">
                       {item.icon && (
                         <Image 
                           src={item.icon} 
                           alt={item.name}
                           width={24}
                           height={24}
                           className="mr-3"
                         />
                       )}
                       <div className="flex-1">
                         <h3 className="text-sm font-semibold">{item.name}</h3>
                         <p className="text-gray-400 text-xs">
                           {item.location === 'bank' && 'Banco'}
                           {item.location === 'character' && `Personaje: ${item.character}`}
                           {item.location === 'storage' && 'Almacenamiento'}
                           {item.location === 'character' && item.slot && ` • Slot: ${item.slot}`}
                           {item.location === 'character' && item.bag && ` • Bolsa: ${item.bag}`}
                           {item.location === 'storage' && item.category && ` • ${item.category}`}
                           {item.count > 0 && ` • ${item.count} unidades`}
                         </p>
                       </div>
                     </div>
                   </div>
                 ))}
                 {searchResults.length > 10 && (
                   <p className="text-gray-400 text-sm text-center">
                     Mostrando 10 de {searchResults.length} resultados
                   </p>
                 )}
               </div>
             )}

            {!isSearching && searchTerm && searchResults.length === 0 && (
              <div className="text-center py-4">
                <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No se encontraron resultados</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.id}
                href={section.href}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors border border-gray-700 hover:border-gray-600"
              >
                <div className="flex items-center mb-4">
                  <IconComponent className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold">{section.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 