'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';
import { useState } from 'react';
import { RefreshCw, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function SessionStatus() {
  const { user, isAuthenticated } = useAuth();
  const { dbService } = useDatabase();
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleManualCheck = async () => {
    if (!dbService || !user) return;
    
    setIsChecking(true);
    try {
      const currentUser = await dbService.getUserById(user.id);
      setLastCheck(new Date());
      
      if (!currentUser) {
        console.log('Usuario no encontrado en la base de datos');
      } else {
        console.log('Usuario encontrado:', currentUser);
      }
    } catch (error) {
      console.error('Error in manual verification:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 border border-gray-700 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-200">Session Status</h3>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Usuario:</span>
          <span className="text-gray-200">{user.username}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Rol:</span>
          <span className={`font-medium ${
            user.role === 'admin' ? 'text-red-400' : 
            user.role === 'moderator' ? 'text-yellow-400' : 
            'text-green-400'
          }`}>
            {user.role}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Estado:</span>
          <div className="flex items-center gap-1">
            {user.isActive ? (
              <CheckCircle className="h-3 w-3 text-green-400" />
            ) : (
              <AlertCircle className="h-3 w-3 text-red-400" />
            )}
            <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        
        {lastCheck && (
          <div className="flex justify-between">
            <span className="text-gray-400">Last verification:</span>
            <span className="text-gray-300">
              {lastCheck.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      <button
        onClick={handleManualCheck}
        disabled={isChecking}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded transition-colors"
      >
        <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        {isChecking ? 'Verificando...' : 'Verificar Ahora'}
      </button>
      
      <div className="mt-2 text-xs text-gray-500">
        Automatic verification every 30 seconds
      </div>
    </div>
  );
} 