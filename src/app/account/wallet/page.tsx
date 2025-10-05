'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

interface WalletItem {
  id: number;
  value: number;
}

interface Currency {
  id: number;
  name: string;
  description: string;
  order: number;
  icon: string;
}

const WalletPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  usePageTitle('pageTitles.wallet', t('account.wallet', 'Wallet'));
  const [walletData, setWalletData] = useState<WalletItem[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // No mostrar modal aquí; solo en /account

  // Important currency IDs (ordered with Spirit Shards after Coin)
  const importantCurrencyIds = useMemo(() => [
    1, 23, 2, 3, 4, 7, 15, 19, 20, 22, 24, 26, 28, 29, 30, 32, 33, 45, 50, 59, 61, 62, 63, 66, 68, 69, 70, 72, 73, 75, 76, 77, 78, 79, 80
  ], []);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const apiKey = localStorage.getItem('gw2_api_key');
        if (!apiKey || apiKey.trim().length < 10) {
          // Sin API key: no llamamos, pero no mostramos modal en subpáginas
          return;
        }
        
        // Fetch wallet data
        const walletResponse = await fetch(`/api/gw2/wallet?api_key=${apiKey}`);
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          // Filter only important currencies
          const filteredWalletData = walletData.filter((item: WalletItem) => 
            importantCurrencyIds.includes(item.id)
          );
          setWalletData(filteredWalletData);
        } else {
          console.error('Error response:', walletResponse.status, walletResponse.statusText);
        }

        // Fetch only important currencies data
        const currenciesResponse = await fetch(`https://api.guildwars2.com/v2/currencies?ids=${importantCurrencyIds.join(',')}`, {
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br'
          }
        });
        if (currenciesResponse.ok) {
          const currenciesData = await currenciesResponse.json();
          setCurrencies(currenciesData);
        } else {
          console.error('Error fetching currencies:', currenciesResponse.status, currenciesResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWalletData();
    }
  }, [isAuthenticated, importantCurrencyIds]);

  const formatGold = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    return `${gold}g ${silver}s ${copperRemaining}c`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
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
            {t('account.back', 'Back to My Account')}
          </Link>
          <h1 className="text-3xl font-bold mb-2">{t('account.wallet', 'Wallet')}</h1>
          <p className="text-gray-400">{t('account.walletSubtitle', 'Your coins and resources')}</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('account.loadingWallet', 'Loading wallet...')}</p>
          </div>
                 ) : (
                       <div className="space-y-4">
              {importantCurrencyIds.map((currencyId) => {
                const walletItem = walletData.find(item => item.id === currencyId);
                const currency = currencies.find(c => c.id === currencyId);
                
                if (!walletItem) return null;
                
                return (
                  <div key={currencyId} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {currency?.icon && (
                          <Image 
                            src={currency.icon} 
                            alt={currency.name}
                            width={32}
                            height={32}
                            className="mr-3"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {currency?.name || `Moneda ${currencyId}`}
                          </h3>
                          {currency?.description && (
                            <p className="text-gray-400 text-sm">{currency.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          {currencyId === 1 ? formatGold(walletItem.value) : walletItem.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
         )}
      </div>
    </div>
  );
};

export default WalletPage; 