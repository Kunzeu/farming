'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Users } from 'lucide-react';

const AdminLoginSimulator = () => {
  const { user, login, logout, hasPermission } = useAuth();
  const [showSimulator, setShowSimulator] = useState(false);

  const handleLogin = (role: 'admin' | 'moderator' | 'user') => {
    login({
      id: `test-${role}-${Date.now()}`,
      username: `Test${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role
    });
  };

  if (!showSimulator) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowSimulator(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Simulador de Login"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg min-w-[280px]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-sm">Simulador de Login</h3>
          <button
            onClick={() => setShowSimulator(false)}
            className="text-gray-400 hover:text-white text-sm"
          >
            ×
          </button>
        </div>
        
        {user ? (
          <div className="space-y-3">
            <div className="bg-gray-700 rounded p-2">
              <div className="text-white text-sm">
                <strong>Usuario:</strong> {user.username}
              </div>
              <div className="text-gray-300 text-xs">
                <strong>Rol:</strong> {user.role}
              </div>
              <div className="text-gray-300 text-xs">
                <strong>Permisos:</strong> {hasPermission('admin') ? 'Admin' : hasPermission('moderator') ? 'Moderador' : 'Usuario'}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleLogin('user')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <User className="w-3 h-3 inline mr-1" />
                User
              </button>
              <button
                onClick={() => handleLogin('moderator')}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <Users className="w-3 h-3 inline mr-1" />
                Mod
              </button>
              <button
                onClick={() => handleLogin('admin')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <Shield className="w-3 h-3 inline mr-1" />
                Admin
              </button>
            </div>
            
            <button
              onClick={logout}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-300 text-xs mb-3">
              No hay usuario autenticado
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleLogin('user')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <User className="w-3 h-3 inline mr-1" />
                User
              </button>
              <button
                onClick={() => handleLogin('moderator')}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <Users className="w-3 h-3 inline mr-1" />
                Mod
              </button>
              <button
                onClick={() => handleLogin('admin')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                <Shield className="w-3 h-3 inline mr-1" />
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginSimulator; 