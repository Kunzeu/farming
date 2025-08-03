'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Settings, Key, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';

const SettingsPage = () => {
  const { isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('gw2_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) return false;

    try {
      const response = await fetch(`/api/gw2/validate?api_key=${encodeURIComponent(key)}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);

      if (valid) {
        localStorage.setItem('gw2_api_key', apiKey);
        setMessage('API key guardada correctamente');
      } else {
        setMessage('API key inválida. Verifica que tenga los permisos correctos.');
      }
    } catch {
      setIsValid(false);
      setMessage('Error al validar la API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage('Ingresa una API key primero');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);

      if (valid) {
        setMessage('API key válida ✓');
      } else {
        setMessage('API key inválida ✗');
      }
    } catch {
      setIsValid(false);
      setMessage('Error al validar la API key');
    } finally {
      setIsLoading(false);
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
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mi Cuenta
          </Link>
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-gray-400">Configura tu API key de GW2</p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <Key className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">API Key de Guild Wars 2</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API key de GW2"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleTestApiKey}
                  disabled={isLoading || !apiKey.trim()}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isLoading ? 'Validando...' : 'Validar'}
                </button>
                
                <button
                  onClick={handleSaveApiKey}
                  disabled={isLoading || !apiKey.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </button>
              </div>

              {message && (
                <div className={`flex items-center p-3 rounded-lg ${
                  isValid === true 
                    ? 'bg-green-900 border border-green-700 text-green-200' 
                    : isValid === false 
                    ? 'bg-red-900 border border-red-700 text-red-200'
                    : 'bg-blue-900 border border-blue-700 text-blue-200'
                }`}>
                  {isValid === true ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : isValid === false ? (
                    <AlertCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <Settings className="w-5 h-5 mr-2" />
                  )}
                  {message}
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">¿Cómo obtener tu API key?</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Ve a <a href="https://account.arena.net/applications" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">account.arena.net/applications</a></li>
                <li>Inicia sesión con tu cuenta de GW2</li>
                <li>Crea una nueva aplicación</li>
                <li>Selecciona los permisos: <code className="bg-gray-800 px-1 rounded">account</code>, <code className="bg-gray-800 px-1 rounded">characters</code>, <code className="bg-gray-800 px-1 rounded">inventories</code></li>
                <li>Copia la API key generada</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 