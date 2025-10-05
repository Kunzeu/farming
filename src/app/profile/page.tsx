'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  Save,
  Edit,
  Shield
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  usePageTitle('pageTitles.profile', t('profile.title'));
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: {
      priceAlerts: true,
      eventReminders: true,
      buildUpdates: false,
    }
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Cargar preferencias cuando el usuario se carga
  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        notifications: {
          priceAlerts: user.preferences.notifications?.priceAlerts ?? true,
          eventReminders: user.preferences.notifications?.eventReminders ?? true,
          buildUpdates: user.preferences.notifications?.buildUpdates ?? false,
        }
      });
    }
  }, [user?.preferences]);

  const handleSave = async () => {
    try {
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();
      
      if (user?.id) {
        const updates: { preferences?: typeof preferences; password?: string } = {};
        
        // Guardar preferencias
        updates.preferences = preferences;
        
        // Validar y cambiar contraseña si se proporcionaron datos
        if (passwordData.newPassword || passwordData.confirmPassword) {
          if (!passwordData.newPassword) {
            alert(t('profile.passwordRequired'));
            return;
          }
          
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert(t('profile.passwordsNoMatch'));
            return;
          }
          
          if (passwordData.newPassword.length < 6) {
            alert(t('profile.passwordTooShort'));
            return;
          }
          
          updates.password = passwordData.newPassword;
        }
        
        await dbService.updateUser(user.id, updates);
        
        // Actualizar localStorage
        const updatedUser = { 
          ...user, 
          preferences,
          ...(updates.password && { password: updates.password })
        };
        localStorage.setItem('gw2_user', JSON.stringify(updatedUser));
        
        // Limpiar campos de contraseña
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        });
        
        setIsEditing(false);
        alert(t('profile.saveSuccess'));
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert(t('profile.saveError'));
    }
  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10">
            <div className="relative inline-block">
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
                {t('profile.title')}
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-300 mt-6 max-w-xl mx-auto">
              {t('profile.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información del Usuario - Diseño Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/10">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{user?.username}</h2>
                </div>

                <div className="space-y-4">
                  <div className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{t('profile.email')}</p>
                      <p className="text-white font-semibold text-sm break-all">{user?.email}</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{t('profile.lastAccess')}</p>
                      <p className="text-white font-semibold text-sm">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{t('profile.memberSince')}</p>
                      <p className="text-white font-semibold text-sm">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : t('profile.dateNotAvailable')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Panel de Configuración */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2">
              
              {/* Configuraciones Principales */}
              <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{t('profile.settings')}</h3>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{isEditing ? t('profile.cancel') : t('profile.edit')}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Cambio de contraseña */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-lg font-bold text-white">{t('profile.changePassword')}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          {t('profile.newPassword')}
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t('profile.newPasswordPlaceholder')}
                          className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          {t('profile.confirmPassword')}
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t('profile.confirmPasswordPlaceholder')}
                          className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón de guardar */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center pt-4">
                      <button
                        onClick={handleSave}
                        className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <Save className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span>{t('profile.saveChanges')}</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}