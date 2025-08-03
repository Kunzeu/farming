'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Search, Shield, Sword, Zap } from 'lucide-react';
import Link from 'next/link';

interface Character {
  name: string;
  profession: string;
  level: number;
  race: string;
  specialization?: string;
  world: number;
  equipment?: unknown[];
}

const CharactersPage = () => {
  const { isAuthenticated } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCharactersData = async () => {
      try {
        setIsLoading(true);
        const apiKey = localStorage.getItem('gw2_api_key');
        if (!apiKey) {
          console.error('No API key found');
          return;
        }
        
        const response = await fetch(`/api/gw2/characters?api_key=${apiKey}`);
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        } else {
          console.error('Error response:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
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
            Volver a Mi Cuenta
          </Link>
          <h1 className="text-3xl font-bold mb-2">Personajes</h1>
          <p className="text-gray-400">Tus personajes y equipamiento</p>
        </div>

        {/* Search */}
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando personajes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <div key={character.name} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  {getProfessionIcon(character.profession)}
                  <div className="ml-3">
                    <h3 className="text-xl font-semibold">{character.name}</h3>
                    <p className="text-gray-400 text-sm">{character.profession}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <p><strong>Nivel:</strong> {character.level}</p>
                  <p><strong>Raza:</strong> {character.race}</p>
                  <p><strong>Especialización:</strong> {character.specialization || 'Ninguna'}</p>
                  <p><strong>Mundo:</strong> {character.world}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Equipamiento</span>
                    <span className="text-blue-400">{character.equipment?.length || 0} items</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Sin personajes</h3>
            <p className="text-gray-400">No se encontraron personajes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersPage; 