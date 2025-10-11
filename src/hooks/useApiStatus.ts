'use client';

import { useState, useEffect, useCallback } from 'react';

interface ApiStatus {
  isHealthy: boolean;
  hasIssues: boolean;
  lastChecked: number;
  errorCount: number;
}

const API_CHECK_INTERVAL = 15000; // 15 seconds - more frequent checks
const ERROR_THRESHOLD = 1; // Show banner after 1 error - more sensitive
const HEALTH_CHECK_TIMEOUT = 8000; // 8 seconds timeout

export function useApiStatus() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isHealthy: true,
    hasIssues: false,
    lastChecked: 0,
    errorCount: 0
  });

  const checkApiHealth = useCallback(async () => {
    try {
      // Test multiple API endpoints to get a better picture of API health
      // Using endpoints that are more likely to be affected by current API issues
      const endpoints = [
        'https://api.guildwars2.com/v2/commerce/listings?ids=1', // Trading post listings
        'https://api.guildwars2.com/v2/commerce/prices?ids=1',   // Trading post prices
        'https://api.guildwars2.com/v2/account',                 // Account endpoint (requires API key but tests auth)
        'https://api.guildwars2.com/v2/worlds?ids=1001'          // Basic endpoint as fallback
      ];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);
      
      // Test all endpoints in parallel
      const responses = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(endpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            signal: controller.signal
          })
        )
      );
      
      clearTimeout(timeoutId);
      
      // Count successful responses
      const successfulResponses = responses.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      ).length;
      
      // If less than half of the endpoints are working, consider it an issue
      const isHealthy = successfulResponses >= endpoints.length / 2;
      
      if (isHealthy) {
        setApiStatus(prev => ({
          isHealthy: true,
          hasIssues: false,
          lastChecked: Date.now(),
          errorCount: 0
        }));
      } else {
        setApiStatus(prev => {
          const newErrorCount = prev.errorCount + 1;
          const hasIssues = newErrorCount >= ERROR_THRESHOLD;
          return {
            isHealthy: false,
            hasIssues,
            lastChecked: Date.now(),
            errorCount: newErrorCount
          };
        });
      }
    } catch (error) {
      setApiStatus(prev => ({
        isHealthy: false,
        hasIssues: prev.errorCount + 1 >= ERROR_THRESHOLD,
        lastChecked: Date.now(),
        errorCount: prev.errorCount + 1
      }));
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkApiHealth();
    
    // Set up interval for periodic checks
    const interval = setInterval(checkApiHealth, API_CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  // Reset error count when API becomes healthy
  useEffect(() => {
    if (apiStatus.isHealthy && apiStatus.errorCount > 0) {
      setApiStatus(prev => ({
        ...prev,
        errorCount: 0,
        hasIssues: false
      }));
    }
  }, [apiStatus.isHealthy]);

  return {
    isApiHealthy: apiStatus.isHealthy,
    hasApiIssues: apiStatus.hasIssues,
    lastChecked: apiStatus.lastChecked,
    errorCount: apiStatus.errorCount,
    checkApiHealth
  };
}
