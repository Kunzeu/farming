'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Settings, Key, Save, CheckCircle, AlertCircle, Moon, Sun, Monitor } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';

const SettingsPage = () => {
  const { isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('gw2_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('gw2_theme') as 'light' | 'dark' | 'auto';
    if (savedTheme) {
      setTheme(savedTheme);
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

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    localStorage.setItem('gw2_theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
          <Link href="/account" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al perfil
          </Link>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* API Key Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">API Key de GW2</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API key de GW2"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleTestApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Validando...' : 'Validar'}
                </button>
                
                <button
                  onClick={handleSaveApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
              
              {message && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isValid ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                }`}>
                  {isValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Theme Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Moon className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold">Theme</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Choose the visual theme of the application.
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <span className="text-sm">Light</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <span className="text-sm">Dark</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('auto')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'auto' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm">Auto</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-400">
                The theme will be applied automatically and saved for future visits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 