'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Settings, Key, Save, CheckCircle, AlertCircle, Info, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
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
  const [showApiKey, setShowApiKey] = useState(false);
  const [accountId, setAccountId] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [copyMessage, setCopyMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('gw2_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // Fetch account ID when API key is loaded
      fetchAccountId(savedApiKey);
    }
  }, []);

  const fetchAccountId = async (key: string) => {
    try {
      console.log('Fetching account data for API key...');
      const response = await fetch(`/api/gw2/account?api_key=${encodeURIComponent(key)}`);
      console.log('Account API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Account data received:', data);
        setAccountId(data.account_id || '');
        setAccountName(data.name || '');
      } else {
        console.error('Account API error:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching account ID:', error);
    }
  };

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
        // Fetch account ID when API key is saved
        fetchAccountId(apiKey);
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

  const handleCopyApiKey = async () => {
    if (!apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopyMessage(t('settings.apiKey.copied', 'Copied!'));
      setTimeout(() => setCopyMessage(''), 2000);
    } catch (error) {
      console.error('Failed to copy API key:', error);
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleDeleteApiKey = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteApiKey = () => {
    // Clear all API key related data
    setApiKey('');
    setAccountId('');
    setAccountName('');
    setIsValid(null);
    setMessage('');
    setShowApiKey(false);
    
    // Remove from localStorage
    localStorage.removeItem('gw2_api_key');
    
    // Show success message
    setMessage(t('settings.apiKey.deleted', 'API key deleted successfully'));
    setTimeout(() => setMessage(''), 3000);
    
    // Close modal
    setShowDeleteModal(false);
  };

  const cancelDeleteApiKey = () => {
    setShowDeleteModal(false);
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
          {/* API Key Seccion */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">{t('settings.apiKey.title', 'GW2 API Key')}</h2>
            </div>
            
            <div className="space-y-4">
              {/* Account Info Display */}
              {(accountId || accountName) && (
                <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                  {accountName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        {t('settings.apiKey.accountName', 'Account Name')}
                      </span>
                      <span className="text-sm text-green-400 font-medium">{accountName}</span>
                    </div>
                  )}
                  {accountId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        {t('settings.apiKey.accountId', 'Account ID')}
                      </span>
                      <span className="text-sm text-blue-400 font-mono">{accountId}</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('settings.apiKey.label', 'API Key')}
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t('settings.apiKey.placeholder', 'Enter your GW2 API key')}
                    className="w-full px-4 py-2 pr-20 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    name="api-key"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      type="button"
                      onClick={toggleShowApiKey}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title={showApiKey ? t('settings.apiKey.hide', 'Hide') : t('settings.apiKey.show', 'Show')}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title={t('settings.apiKey.copy', 'Copy')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {copyMessage && (
                  <div className="mt-2 text-sm text-green-400">
                    {copyMessage}
                  </div>
                )}
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

                {apiKey && (
                  <button
                    onClick={handleDeleteApiKey}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('settings.apiKey.delete', 'Delete')}</span>
                  </button>
                )}
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

          {/* Instructions Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">{t('settings.apiKey.instructions.title', 'Instructions')}</h2>
            </div>
            
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>{t('settings.apiKey.instructions.step1', 'Open the Guild Wars 2 API key management panel.')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>{t('settings.apiKey.instructions.step2', 'Click the "new key" button or copy your existing APIKey.')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>{t('settings.apiKey.instructions.step3', 'Enter a name and check all permission boxes.')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>{t('settings.apiKey.instructions.step4', 'Copy your new API key. CTRL + C')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <span>{t('settings.apiKey.instructions.step5', 'Paste it in the form above. CTRL + V')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                <span>{t('settings.apiKey.instructions.step6', 'Click the "Save new API key" button.')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                <span className="text-green-400 font-medium">{t('settings.apiKey.instructions.step7', 'Ready! You can now use all your account features.')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {t('settings.apiKey.deleteModal.title', 'Confirm Deletion')}
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                {t('settings.apiKey.deleteModal.message', 'Are you sure you want to delete the API key? This action cannot be undone.')}
              </p>
              
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={cancelDeleteApiKey}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  {t('settings.apiKey.deleteModal.cancel', 'Cancel')}
                </button>
                <button
                  onClick={confirmDeleteApiKey}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('settings.apiKey.deleteModal.confirm', 'Yes, Delete')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 