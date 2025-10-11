'use client';

import { motion } from 'framer-motion';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useApiStatus } from '@/hooks/useApiStatus';

interface ServiceUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export default function ServiceUnavailableModal({ 
  isOpen, 
  onClose, 
  onRetry,
  title,
  description 
}: ServiceUnavailableModalProps) {
  const { t } = useI18n();
  const { hasApiIssues, isApiHealthy } = useApiStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-md w-[90%] bg-gray-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 mr-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {title || t('serviceUnavailable.title', 'Service Not Available')}
          </h3>
        </div>
        
        <p className="text-gray-300 mb-4">
          {description || t('serviceUnavailable.description', 'The Guild Wars 2 API service is currently unavailable. Please try again later.')}
        </p>
        
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-blue-300 text-sm">
            <strong>{t('serviceUnavailable.statusUpdate', 'Status Update:')}</strong> {t('serviceUnavailable.statusMessage', 'ArenaNet is working on resolving API issues. Some routes are temporarily disabled.')}
          </p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {t('common.close', 'Close')}
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('common.retry', 'Retry')}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
