'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { CheckCircle, AlertCircle, ExternalLink, Link, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatreonSection() {
  const { user, linkPatreon } = useAuth();
  const { t } = useI18n();
  const [isLinking, setIsLinking] = useState(false);

  const hasPatreon = !!user?.patreonId;
  const isActivePatron = user?.patreonStatus === 'active_patron';

  const handleLinkPatreon = () => {
    // Redirigir a Patreon OAuth
    const redirectUri = process.env.NEXT_PUBLIC_PATREON_REDIRECT_URI || 'https://www.true-farming.com/auth/patreon/link';
    const patreonAuthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_PATREON_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identity identity[email] identity.memberships`;
    window.location.href = patreonAuthUrl;
  };

  const getPatreonStatusColor = () => {
    if (!hasPatreon) return 'gray';
    if (isActivePatron) return 'green';
    if (user?.patreonStatus === 'declined_patron') return 'red';
    if (user?.patreonStatus === 'former_patron') return 'yellow';
    return 'gray';
  };

  const getPatreonStatusText = () => {
    if (!hasPatreon) return t('profile.patreon.notConnected', 'No vinculado');
    if (isActivePatron) return t('profile.patreon.activePatron', 'Patreon Activo');
    if (user?.patreonStatus === 'declined_patron') return t('profile.patreon.declined', 'Pago Rechazado');
    if (user?.patreonStatus === 'former_patron') return t('profile.patreon.former', 'Ex-Patreon');
    return t('profile.patreon.connected', 'Vinculado');
  };

  const statusColor = getPatreonStatusColor();
  const statusText = getPatreonStatusText();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF424D] to-[#E03238] rounded-xl flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">{t('profile.patreon.title', 'Patreon')}</h3>
          <p className="text-gray-400 text-sm">{t('profile.patreon.subtitle', 'Apoya el proyecto y obtén beneficios exclusivos')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status Display */}
        {hasPatreon ? (
          <div className={`bg-gradient-to-r from-${statusColor}-900/20 to-${statusColor}-900/20 rounded-xl p-4 border border-${statusColor}-500/30`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {t('profile.patreon.status', 'Estado de Patreon')}
              </span>
              <div className="flex items-center gap-2">
                {isActivePatron ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className={`w-4 h-4 text-${statusColor}-400`} />
                )}
                <span className={`text-xs text-${statusColor}-400 font-semibold`}>{statusText}</span>
              </div>
            </div>
            
            {user?.patreonTier && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-300">
                  {t('profile.patreon.tier', 'Nivel')}
                </span>
                <span className="text-sm text-[#FF424D] font-bold">{user.patreonTier}</span>
              </div>
            )}

            {/* Benefits */}
            {isActivePatron && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-2">
                  {t('profile.patreon.benefits', 'Beneficios Activos')}
                </h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{t('profile.patreon.benefit1', 'Acceso a contenido exclusivo')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{t('profile.patreon.benefit2', 'Sin anuncios')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{t('profile.patreon.benefit3', 'Rol especial en Discord')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{t('profile.patreon.benefit4', 'Prioridad en soporte')}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-xl p-4 border border-gray-600/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {t('profile.patreon.status', 'Estado de Patreon')}
              </span>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-semibold">{statusText}</span>
              </div>
            </div>

            {/* Why Patreon section */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-white mb-2">
                {t('profile.patreon.whyPatreon', '¿Por qué convertirte en Patreon?')}
              </h4>
              <ul className="space-y-1">
                <li className="flex items-start gap-2 text-xs text-gray-300">
                  <Crown className="w-3 h-3 text-[#FF424D] mt-0.5 flex-shrink-0" />
                  <span>{t('profile.patreon.reason1', 'Apoya el desarrollo continuo del proyecto')}</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-300">
                  <Crown className="w-3 h-3 text-[#FF424D] mt-0.5 flex-shrink-0" />
                  <span>{t('profile.patreon.reason2', 'Obtén beneficios exclusivos')}</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-300">
                  <Crown className="w-3 h-3 text-[#FF424D] mt-0.5 flex-shrink-0" />
                  <span>{t('profile.patreon.reason3', 'Sé parte de la comunidad de patrocinadores')}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          {!hasPatreon ? (
            <>
              <button
                onClick={handleLinkPatreon}
                disabled={isLinking}
                className="group inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF424D] to-[#E03238] hover:from-[#E03238] hover:to-[#C02830] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                <Link className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm">{t('profile.patreon.linkAccount', 'Vincular Cuenta de Patreon')}</span>
              </button>
              
              <a
                href="https://www.patreon.com/truefarming"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm">{t('profile.patreon.becomePat patron', 'Conviértete en Patreon')}</span>
              </a>
            </>
          ) : (
            <a
              href="https://www.patreon.com/truefarming"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF424D] to-[#E03238] hover:from-[#E03238] hover:to-[#C02830] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm">{t('profile.patreon.managePatreon', 'Gestionar en Patreon')}</span>
            </a>
          )}
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500 text-center mt-2">
          {t('profile.patreon.infoText', 'Los beneficios se actualizan automáticamente cuando vinculas tu cuenta')}
        </p>
      </div>
    </motion.div>
  );
}
