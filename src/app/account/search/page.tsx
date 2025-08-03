'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Search, Package, Users, Database } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

const SearchPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'bank' | 'characters' | 'storage'>('all');

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('gw2_api_key');
      if (!apiKey) {
        console.error('No API key found');
        return;
      }
      
      const response = await fetch(`/api/gw2/search?q=${encodeURIComponent(searchTerm)}&scope=${searchScope}&api_key=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, searchScope]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(handleSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [handleSearch, searchTerm]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Account
          </Link>
                      <h1 className="text-3xl font-bold mb-2">Search</h1>
                      <p className="text-gray-400">Search items in your account</p>
        </div>

        {/* Search Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSearchScope('all')}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  searchScope === 'all' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setSearchScope('bank')}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  searchScope === 'bank' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSearchScope('characters')}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  searchScope === 'characters' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSearchScope('storage')}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  searchScope === 'storage' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                 <div className="flex items-center mb-4">
                   {item.icon && (
                     <Image 
                       src={item.icon} 
                       alt={item.name}
                       width={32}
                       height={32}
                       className="mr-3"
                     />
                   )}
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong>Cantidad:</strong> {item.count}</p>
                  <p><strong>Ubicación:</strong> {item.location}</p>
                  {item.rarity && <p><strong>Rareza:</strong> {item.rarity}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 