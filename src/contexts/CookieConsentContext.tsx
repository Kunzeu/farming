'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
}

export interface CookieConsentContextType {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  showSettings: () => void;
  hideSettings: () => void;
  isSettingsOpen: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

const defaultPreferences: CookiePreferences = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  advertising: false,
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [showBanner, setShowBanner] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load consent status and preferences on mount
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consent === 'true') {
      setHasConsented(true);
      setShowBanner(false);
      
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({ ...defaultPreferences, ...parsed });
        } catch (error) {
          console.error('Error parsing cookie preferences:', error);
          setPreferences(defaultPreferences);
        }
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Update Google Analytics based on preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      if (preferences.analytics) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      } else {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }
  }, [preferences.analytics]);

  // Update Google AdSense based on preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      if (preferences.advertising) {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else {
        window.gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  }, [preferences.advertising]);

  const acceptAll = () => {
    const newPreferences: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    
    setPreferences(newPreferences);
    setHasConsented(true);
    setShowBanner(false);
    setIsSettingsOpen(false);
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
  };

  const rejectAll = () => {
    const newPreferences: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    
    setPreferences(newPreferences);
    setHasConsented(true);
    setShowBanner(false);
    setIsSettingsOpen(false);
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    // Ensure essential cookies are always enabled
    const finalPreferences: CookiePreferences = {
      ...newPreferences,
      essential: true,
    };
    
    setPreferences(finalPreferences);
    setHasConsented(true);
    setShowBanner(false);
    setIsSettingsOpen(false);
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
  };

  const showSettings = () => {
    setIsSettingsOpen(true);
  };

  const hideSettings = () => {
    setIsSettingsOpen(false);
  };

  const value: CookieConsentContextType = {
    hasConsented,
    preferences,
    showBanner,
    acceptAll,
    rejectAll,
    savePreferences,
    showSettings,
    hideSettings,
    isSettingsOpen,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
