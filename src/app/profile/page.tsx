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
  Heart, 
  Bell,

  Save,
  Edit
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ProfilePage() {
  const { user } = useAuth();
  usePageTitle('My Profile');
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
            alert('You must enter a new password');
            return;
          }
          
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
          }
          
          if (passwordData.newPassword.length < 6) {
            alert('New password must be at least 6 characters long');
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
        alert('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving settings');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              My Profile
            </h1>
            <p className="text-xl text-gray-300">
              Manage your account and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información del Usuario */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Last access</p>
                      <p className="text-white">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Configuraciones */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Settings</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Cambio de contraseña */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Change Password</h4>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        New password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Notificaciones */}
                  <div>
                    <label className="flex items-center gap-2 text-white font-medium mb-3">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.priceAlerts}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              priceAlerts: e.target.checked
                            }
                          })}
                          disabled={!isEditing}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className="text-gray-300">Price alerts</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.eventReminders}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              eventReminders: e.target.checked
                            }
                          })}
                          disabled={!isEditing}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className="text-gray-300">Event reminders</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.buildUpdates}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              buildUpdates: e.target.checked
                            }
                          })}
                          disabled={!isEditing}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className="text-gray-300">Build updates</span>
                      </label>
                    </div>
                  </div>

                  {/* Botón de guardar */}
                  {isEditing && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Favorite Items</p>
                      <p className="text-white font-bold text-xl">
                        {user?.preferences?.favoriteItems?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Saved Routes</p>
                      <p className="text-white font-bold text-xl">
                        {user?.preferences?.favoriteRoutes?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Notifications</p>
                      <p className="text-white font-bold text-xl">
                        {Object.values(preferences.notifications).filter(Boolean).length}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 