'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Settings, Key, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

const SettingsPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  usePageTitle('pageTitles.settings', t('pageTitles.settings', 'Account Settings'));
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
        setMessage(t('settings.apiKey.saved', 'API key saved successfully'));
      } else {
        setMessage(t('settings.apiKey.invalid', 'Invalid API key. Check permissions.'));
      }
    } catch {
      setIsValid(false);
      setMessage(t('settings.apiKey.errorValidate', 'Error validating API key'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage(t('settings.apiKey.enterFirst', 'Enter an API key first'));
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);

      if (valid) {
        setMessage(t('settings.apiKey.valid', 'Valid API key ✓'));
      } else {
        setMessage(t('settings.apiKey.invalidShort', 'Invalid API key ✗'));
      }
    } catch {
      setIsValid(false);
      setMessage(t('settings.apiKey.errorValidate', 'Error validating API key'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t('auth.accessRequired', 'Access Required')}</h2>
          <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            {t('auth.goToLogin', 'Go to Login')}
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
            {t('account.back', 'Back to My Account')}
          </Link>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">{t('settings.title', 'Settings')}</h1>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          {/* API Key Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">{t('settings.apiKey.title', 'GW2 API Key')}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('settings.apiKey.label', 'API Key')}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t('settings.apiKey.placeholder', 'Enter your GW2 API key')}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleTestApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? t('settings.apiKey.validating', 'Validating...') : t('settings.apiKey.validate', 'Validate')}
                </button>
                
                <button
                  onClick={handleSaveApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('settings.apiKey.save', 'Save')}</span>
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 