'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Database, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';

interface Material {
  id: number;
  name: string;
  icon?: string;
  count: number;
  max_count: number;
  category?: string;
}

const StoragePage = () => {
  const { isAuthenticated } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterialsData = async () => {
      try {
        setIsLoading(true);
        const apiKey = localStorage.getItem('gw2_api_key');
        if (!apiKey) {
          console.error('No API key found');
          return;
        }
        
        const response = await fetch(`/api/gw2/materials?api_key=${apiKey}`);
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
        } else {
          console.error('Error response:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMaterialsData();
    }
  }, [isAuthenticated]);

  const filteredMaterials = materials.filter(material => 
    material && material.name && material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
          <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Go to Login
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
            Back to My Account
          </Link>
          <h1 className="text-3xl font-bold mb-2">Material Storage</h1>
          <p className="text-gray-400">Your Material Storage</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading materials...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                 <div className="flex items-center mb-3">
                   {material.icon && (
                     <Image 
                       src={material.icon} 
                       alt={material.name}
                       width={32}
                       height={32}
                       className="mr-3"
                     />
                   )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{material.name}</h3>
                    <p className="text-gray-400 text-xs">ID: {material.id}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-semibold">
                    {material.count || 0}
                  </span>
                  <span className="text-gray-400 text-xs">
                    / {material.max_count || 250}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(((material.count || 0) / (material.max_count || 250)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No materials</h3>
            <p className="text-gray-400">There are no materials in your storage</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoragePage; 