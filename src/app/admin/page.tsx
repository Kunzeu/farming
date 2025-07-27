'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import { Plus, Edit, Trash2, Save, X, Map, Clock, DollarSign, Shield, Users } from 'lucide-react';
import { useDatabase, FarmItem, User } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';

type AdminSection = 'farms' | 'users';

export default function AdminPanel() {
  const { dbService } = useDatabase();
  const [activeSection, setActiveSection] = useState<AdminSection>('farms');
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmItem | null>(null);
  const [newFarm, setNewFarm] = useState<Omit<FarmItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    estimatedTime: '',
    estimatedGold: '',
    expansion: 'core',
    selected: false,
    type: 'farm'
  });



  // Estados para gestión de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
    email: '',
    username: '',
    password: '',
    role: 'user',
    isActive: true
  });

  // Cargar farms desde la base de datos
  const loadFarms = useCallback(async () => {
    if (!dbService) return;
    try {
      setIsLoading(true);
      setError(null);
      const farmsData = await dbService.getAllFarms();
      setFarms(farmsData);
    } catch (err) {
      console.error('Error loading farms:', err);
      setError('Error al cargar los farms desde la base de datos');
    } finally {
      setIsLoading(false);
    }
  }, [dbService]);

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    if (!dbService) return;
    try {
      setIsLoadingUsers(true);
      const usersData = await dbService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [dbService]);

  useEffect(() => {
    if (activeSection === 'farms') {
      loadFarms();
    } else if (activeSection === 'users') {
      loadUsers();
    }
  }, [activeSection, loadFarms, loadUsers]);

  // Crear nuevo farm
  const handleCreateFarm = async () => {
    // Validar campos requeridos
    if (!newFarm.name.trim() || !newFarm.description.trim() || !newFarm.estimatedTime.trim() || !newFarm.estimatedGold.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await dbService.createFarm(newFarm);
      setNewFarm({
        name: '',
        description: '',
        estimatedTime: '',
        estimatedGold: '',
        expansion: 'core',
        selected: false,
        type: 'farm'
      });

      setIsCreating(false);
      setError(null);
      await loadFarms();
    } catch (err) {
      console.error('Error creating farm:', err);
      setError('Error al crear el farm');
    }
  };

  // Editar farm
  const handleEditFarm = async () => {
    if (!editingFarm) return;
    
    // Validar campos requeridos
    if (!editingFarm.name.trim() || !editingFarm.description.trim() || !editingFarm.estimatedTime.trim() || !editingFarm.estimatedGold.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }
    
    try {
      await dbService.updateFarm(editingFarm);
      setEditingFarm(null);
      setError(null);
      await loadFarms();
    } catch (err) {
      console.error('Error updating farm:', err);
      setError('Error al actualizar el farm');
    }
  };

  // Actualizar farm
  const handleUpdateFarm = async () => {
    if (!editingFarm) return;
    
    if (!editingFarm.name.trim() || !editingFarm.description.trim() || !editingFarm.estimatedTime.trim() || !editingFarm.estimatedGold.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await dbService.updateFarm(editingFarm.id, {
        name: editingFarm.name,
        description: editingFarm.description,
        estimatedTime: editingFarm.estimatedTime,
        estimatedGold: editingFarm.estimatedGold,
        expansion: editingFarm.expansion,
        type: editingFarm.type
      });
      setEditingFarm(null);
      setError(null);
      await loadFarms();
    } catch (err) {
      console.error('Error updating farm:', err);
      setError('Error al actualizar el farm');
    }
  };

  // Eliminar farm
  const handleDeleteFarm = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este farm?')) {
      try {
        await dbService.deleteFarm(id);
        await loadFarms();
      } catch (err) {
        console.error('Error deleting farm:', err);
        setError('Error al eliminar el farm');
      }
    }
  };

  // Crear usuario
  const handleCreateUser = async () => {
    if (!newUser.email.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      setError('Email, username y contraseña son requeridos');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError('El formato del email no es válido');
      return;
    }

    try {
      await dbService.createUser(newUser);
      setNewUser({
        email: '',
        username: '',
        password: '',
        role: 'user',
        isActive: true
      });
      setIsCreatingUser(false);
      setError(null);
      await loadUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el usuario';
      setError(errorMessage);
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    if (!editingUser.email.trim() || !editingUser.username.trim()) {
      setError('Email y username son requeridos');
      return;
    }
    
    try {
      await dbService.updateUser(editingUser);
      setEditingUser(null);
      setError(null);
      await loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error al actualizar el usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await dbService.deleteUser(id);
        await loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Error al eliminar el usuario');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-900/20';
      case 'moderator':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'user':
        return 'text-green-400 bg-green-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      case 'user':
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  };

  const renderFarmsManager = () => (
    <>
      {/* Botón para crear nuevo farm */}
      <motion.button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg mb-6"
      >
        <Plus className="w-5 h-5" />
        Crear Nuevo Farm
      </motion.button>

      {/* Modal Crear Farm */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Farm</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newFarm.name}
                  onChange={(e) => setNewFarm({...newFarm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Nombre del farm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newFarm.description}
                  onChange={(e) => setNewFarm({...newFarm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="Descripción del farm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tiempo Estimado
                  </label>
                  <input
                    type="text"
                    value={newFarm.estimatedTime}
                    onChange={(e) => setNewFarm({...newFarm, estimatedTime: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="30 min"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Oro Estimado
                  </label>
                  <input
                    type="text"
                    value={newFarm.estimatedGold}
                    onChange={(e) => setNewFarm({...newFarm, estimatedGold: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="8g/h"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expansión Requerida
                </label>
                <select
                  value={newFarm.expansion}
                  onChange={(e) => setNewFarm({...newFarm, expansion: e.target.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="core">Core Game</option>
                  <option value="hot">Heart of Thorns</option>
                  <option value="pof">Path of Fire</option>
                  <option value="eod">End of Dragons</option>
                  <option value="soto">Secrets of the Obscure</option>
                  <option value="jw">Janthir Wilds</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateFarm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Crear
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Editar Farm */}
      {editingFarm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Editar Farm</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingFarm.name}
                  onChange={(e) => setEditingFarm({...editingFarm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Nombre del farm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingFarm.description}
                  onChange={(e) => setEditingFarm({...editingFarm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="Descripción del farm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tiempo Estimado
                  </label>
                  <input
                    type="text"
                    value={editingFarm.estimatedTime}
                    onChange={(e) => setEditingFarm({...editingFarm, estimatedTime: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="30 min"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Oro Estimado
                  </label>
                  <input
                    type="text"
                    value={editingFarm.estimatedGold}
                    onChange={(e) => setEditingFarm({...editingFarm, estimatedGold: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="8g/h"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expansión Requerida
                </label>
                <select
                  value={editingFarm.expansion}
                  onChange={(e) => setEditingFarm({...editingFarm, expansion: e.target.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="core">Core Game</option>
                  <option value="hot">Heart of Thorns</option>
                  <option value="pof">Path of Fire</option>
                  <option value="eod">End of Dragons</option>
                  <option value="soto">Secrets of the Obscure</option>
                  <option value="jw">Janthir Wilds</option>
                </select>
              </div>


            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateFarm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={() => setEditingFarm(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Cargando farms...</p>
        </div>
      )}

      {/* Lista de farms */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {farms.map((farm) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {editingFarm?.id === farm.id ? (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Editar Farm</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editingFarm.name}
                        onChange={(e) => setEditingFarm({...editingFarm, name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={editingFarm.description}
                        onChange={(e) => setEditingFarm({...editingFarm, description: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tiempo
                        </label>
                        <input
                          type="text"
                          value={editingFarm.estimatedTime}
                          onChange={(e) => setEditingFarm({...editingFarm, estimatedTime: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Oro
                        </label>
                        <input
                          type="text"
                          value={editingFarm.estimatedGold}
                          onChange={(e) => setEditingFarm({...editingFarm, estimatedGold: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expansión
                      </label>
                      <select
                        value={editingFarm.expansion}
                        onChange={(e) => setEditingFarm({...editingFarm, expansion: e.target.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw'})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="core">Core Game</option>
                        <option value="hot">Heart of Thorns</option>
                        <option value="pof">Path of Fire</option>
                        <option value="eod">End of Dragons</option>
                        <option value="soto">Secrets of the Obscure</option>
                        <option value="jw">Janthir Wilds</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleEditFarm}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingFarm(null)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{farm.name}</h3>
                    <div className="flex items-center gap-2">
                      <ExpansionIcon expansion={farm.expansion} size="lg" variant="compact" />
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{farm.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{farm.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{farm.estimatedGold}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Creado: {new Date(farm.createdAt).toLocaleDateString('es-ES')}
                    {farm.updatedAt !== farm.createdAt && 
                      ` | Actualizado: ${new Date(farm.updatedAt).toLocaleDateString('es-ES')}`
                    }
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setEditingFarm(farm)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteFarm(farm.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay farms */}
      {!isLoading && farms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No hay farms creados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comienza creando tu primer farm.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );

  const renderUsersManager = () => (
    <>
      {/* Botón para crear nuevo usuario */}
      <motion.button
        onClick={() => setIsCreatingUser(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg mb-6"
      >
        <Plus className="w-5 h-5" />
        Crear Nuevo Usuario
      </motion.button>

      {/* Modal Crear Usuario */}
      {isCreatingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Usuario</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Nombre de usuario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Contraseña"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin' | 'moderator'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="user">Usuario</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newUser.isActive}
                  onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Usuario activo
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Crear
              </button>
              <button
                onClick={() => setIsCreatingUser(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoadingUsers && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Cargando usuarios...</p>
        </div>
      )}

      {/* Lista de usuarios */}
      {!isLoadingUsers && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              {editingUser?.id === user.id ? (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Editar Usuario</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                        placeholder="Dejar vacío para mantener la actual"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rol
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'user' | 'admin' | 'moderator'})}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="user">Usuario</option>
                        <option value="moderator">Moderador</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`isActive-${user.id}`}
                        checked={editingUser.isActive}
                        onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
                        className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`isActive-${user.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                        Usuario activo
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleUpdateUser}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Creado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    {user.updatedAt !== user.createdAt && 
                      ` | Actualizado: ${new Date(user.updatedAt).toLocaleDateString('es-ES')}`
                    }
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay usuarios */}
      {!isLoadingUsers && users.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comienza creando tu primer usuario.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Panel Administrativo</h1>
            <p className="text-gray-300">Gestiona los farms y usuarios de la aplicación</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveSection('farms')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'farms'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Map className="w-5 h-5" />
                Gestor de Farms
              </button>
              <button
                onClick={() => setActiveSection('users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'users'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Users className="w-5 h-5" />
                Gestor de Usuarios
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'farms' && renderFarmsManager()}
            {activeSection === 'users' && renderUsersManager()}
          </motion.div>
        </div>
      </div>
          </AdminRoute>
  );
} 