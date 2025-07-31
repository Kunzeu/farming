'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ModeratorRoute from '@/components/auth/ModeratorRoute';
import { Plus, Edit, Eye, CheckCircle, XCircle, Map, AlertCircle, Save, X } from 'lucide-react';
import { useDatabase, FarmItem } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';
import GW2Icon from '@/components/ui/GW2Icon';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

type ModeratorSection = 'my-farms' | 'pending-farms' | 'published-farms';

export default function ModeratorPanel() {
  const { dbService } = useDatabase();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<ModeratorSection>('my-farms');
               const [farms, setFarms] = useState<FarmItem[]>([]);
  const [pendingFarms, setPendingFarms] = useState<FarmItem[]>([]);
  const [publishedFarms, setPublishedFarms] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmItem | null>(null);
  const [viewingFarm, setViewingFarm] = useState<FarmItem | null>(null);
  const [newFarm, setNewFarm] = useState<Omit<FarmItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    estimatedTime: '',
    estimatedGold: '',
    estimatedSpirit: '',
    expansion: ['core'],
    selected: false,
    type: 'farm',
    status: 'pending',
    createdBy: '',
    map: '',
    requirements: [],
    tags: [],
    waypoints: []
  });
  
  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Helper functions for notifications
  const showSuccess = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'success',
      title,
      message
    });
  };

  const showError = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'error',
      title,
      message
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Función para formatear tiempo (HHMMSS -> HH:MM:SS)
  const formatTimeInput = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '');
    
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4)}`;
    
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4, 6)}`;
  };

  // Función para formatear oro a formato GW2 (G S C)
  const formatGoldInput = (value: string): string => {
    const cleaned = value.replace(/[^\d\s]/g, '').trim();
    if (!cleaned) return '';
    
    if (/^\d+$/.test(cleaned)) {
      const copper = parseInt(cleaned);
      const gold = Math.floor(copper / 10000);
      const silver = Math.floor((copper % 10000) / 100);
      const remainingCopper = copper % 100;
      
      const goldStr = gold.toString();
      const silverStr = silver.toString().padStart(2, '0');
      const copperStr = remainingCopper.toString().padStart(2, '0');
      
      return `${goldStr}g ${silverStr}s ${copperStr}c`;
    }
    
    return value;
  };

  // Manejar cambio de oro con formato GW2
  const handleGoldChange = (value: string) => {
    setNewFarm({...newFarm, estimatedGold: value});
  };

  const formatGoldOnBlur = (value: string) => {
    const formatted = formatGoldInput(value);
    setNewFarm({...newFarm, estimatedGold: formatted});
  };

  const handleTimeChange = (value: string) => {
    const formatted = formatTimeInput(value);
    setNewFarm({...newFarm, estimatedTime: formatted});
  };

  const handleSpiritChange = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    setNewFarm({...newFarm, estimatedSpirit: cleaned});
  };

  const handleExpansionToggle = (expansionValue: 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw') => {
    const currentExpansions = newFarm.expansion;
    const newExpansions = currentExpansions.includes(expansionValue)
      ? currentExpansions.filter(exp => exp !== expansionValue)
      : [...currentExpansions, expansionValue];
    
    setNewFarm({...newFarm, expansion: newExpansions});
  };

  // Cargar datos
  const loadData = useCallback(async () => {
    if (!dbService) return;
    
    try {
      setIsLoading(true);
      
      // Cargar farms del moderador
      const allFarms = await dbService.getAllFarms();
      const myFarms = allFarms.filter((farm: FarmItem) => farm.createdBy === user?.id);
      const pending = allFarms.filter((farm: FarmItem) => farm.status === 'pending');
      const published = allFarms.filter((farm: FarmItem) => farm.status === 'approved');
      
      setFarms(myFarms);
      setPendingFarms(pending);
      setPublishedFarms(published);
      
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, [dbService, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actualizar farm
  const handleUpdateFarm = async () => {
    console.log('🔄 Iniciando actualización de farm...');
    console.log('📝 editingFarm:', editingFarm);
    console.log('👤 user:', user);
    
    if (!editingFarm) {
      console.log('❌ No hay farm en edición');
      return;
    }
    
    if (!editingFarm.name.trim() || !editingFarm.description.trim() || !editingFarm.estimatedTime.trim()) {
      console.log('❌ Validación fallida: campos requeridos vacíos');
      showError('Error de validación', 'Nombre, descripción y tiempo son campos requeridos');
      return;
    }

    if (!editingFarm.estimatedGold.trim() && !editingFarm.estimatedSpirit?.trim()) {
      console.log('❌ Validación fallida: no hay oro ni spirit shards');
      showError('Error de validación', 'Debe especificar al menos oro estimado o spirit shards');
      return;
    }

    try {
      // Determinar si es edición limitada (farm aprobado que no es del moderador)
      const isLimitedEdit = editingFarm.status === 'approved' && editingFarm.createdBy !== user?.id;
      console.log('🔍 Es edición limitada:', isLimitedEdit);
      console.log('📊 Estado del farm:', editingFarm.status);
      console.log('👤 Creador del farm:', editingFarm.createdBy);
      console.log('👤 Usuario actual:', user?.id);
      
      const updateData = isLimitedEdit ? {
        // Solo campos editables para farms publicados
        description: editingFarm.description,
        estimatedTime: editingFarm.estimatedTime,
        estimatedGold: editingFarm.estimatedGold,
        estimatedSpirit: editingFarm.estimatedSpirit
        // Campos de tracking comentados hasta que se ejecute la migración
        // lastEditedBy: user?.id,
        // lastEditedAt: new Date().toISOString()
      } : {
        // Edición completa para farms propios o pendientes
        name: editingFarm.name,
        description: editingFarm.description,
        estimatedTime: editingFarm.estimatedTime,
        estimatedGold: editingFarm.estimatedGold,
        estimatedSpirit: editingFarm.estimatedSpirit,
        expansion: editingFarm.expansion,
        type: editingFarm.type
      };

      console.log('📤 Datos a enviar:', updateData);
      console.log('🆔 ID del farm:', editingFarm.id);

      await dbService.updateFarm(editingFarm.id, updateData);
      
      console.log('✅ Farm actualizado exitosamente');
      await loadData();
      setEditingFarm(null);
      showSuccess('Éxito', 'Farm actualizado correctamente.');
    } catch (err) {
      console.error('❌ Error updating farm:', err);
      showError('Error', 'No se pudo actualizar el farm. Intenta nuevamente.');
    }
  };

  // Crear farm
  const handleCreateFarm = async () => {
    if (!newFarm.name.trim() || !newFarm.description.trim() || !newFarm.estimatedTime.trim()) {
      showError('Error de validación', 'Nombre, descripción y tiempo son campos requeridos');
      return;
    }

    if (!newFarm.estimatedGold.trim() && !newFarm.estimatedSpirit?.trim()) {
      showError('Error de validación', 'Debe especificar al menos oro estimado o spirit shards');
      return;
    }

    try {
      console.log('Creating farm with data:', newFarm);
      await dbService.createFarm({
        ...newFarm,
        createdBy: user?.id || '',
        createdByRole: 'moderator'
      });
      
      // Reset form
      setNewFarm({
        name: '',
        description: '',
        estimatedTime: '',
        estimatedGold: '',
        estimatedSpirit: '',
        expansion: ['core'],
        selected: false,
        type: 'farm',
        status: 'pending',
        createdBy: '',
        map: '',
        requirements: [],
        tags: [],
        waypoints: []
      });
      setIsCreating(false);
      await loadData();
      
      showSuccess('¡Creado!', `Farm "${newFarm.name}" creado y enviado para aprobación`);
    } catch (err) {
      console.error('Error creating farm:', err);
      showError('Error', 'No se pudo crear el farm. Intenta nuevamente.');
    }
  };



  // Renderizar sección de mis farms
  const renderMyFarms = () => (
    <div className="space-y-6">
      {/* Create Farm Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mis Farms</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Crear Farm
        </button>
      </div>

             {/* Loading State */}
       {isLoading && (
         <div className="text-center py-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
           <p className="text-gray-400">Cargando farms...</p>
         </div>
       )}

       {/* Farms List */}
       {!isLoading && farms.length === 0 ? (
         <div className="text-center py-12">
           <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
           <p className="text-gray-400">No has creado ningún farm aún</p>
         </div>
       ) : !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
                             <div className="mb-4">
                                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="text-lg font-semibold text-white">{farm.name}</h3>
                    <div className="flex gap-1">
                      {(Array.isArray(farm.expansion) ? farm.expansion : [farm.expansion]).map((exp) => (
                        <ExpansionIcon key={exp} expansion={exp} size="sm" variant="compact" />
                      ))}
                    </div>
                  </div>
                 <p className="text-gray-400 text-sm">{farm.description}</p>
                 <div className="flex items-center gap-1 mt-2">
                   {farm.status === 'approved' && (
                     <CheckCircle className="w-5 h-5 text-green-500" />
                   )}
                                      {farm.status === 'pending' && (
                      <div className="relative group">
                        <AlertCircle className="w-5 h-5 text-yellow-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          En estado pendiente
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                   {farm.status === 'rejected' && (
                     <XCircle className="w-5 h-5 text-red-500" />
                   )}
                 </div>
               </div>

                             <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <GW2Icon type="time" size="sm" />
                   <span>{farm.estimatedTime}</span>
                 </div>
                 {farm.estimatedGold && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="gold" size="sm" />
                     <span>{farm.estimatedGold}</span>
                   </div>
                 )}
                 {farm.estimatedSpirit && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="spirit-shard" size="sm" />
                     <span>{farm.estimatedSpirit} Spirit Shards</span>
                   </div>
                 )}
               </div>

              <div className="flex gap-2">
                                 <button
                   onClick={() => {
                     const farmToEdit = {
                       ...farm,
                       expansion: Array.isArray(farm.expansion) ? farm.expansion : [farm.expansion]
                     };
                     setEditingFarm(farmToEdit);
                   }}
                   className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 transition-colors ${
                     editingFarm?.id === farm.id 
                       ? 'bg-green-600 hover:bg-green-700 text-white' 
                       : 'bg-blue-600 hover:bg-blue-700 text-white'
                   }`}
                 >
                   <Edit className="w-4 h-4" />
                   {editingFarm?.id === farm.id ? 'Editando...' : 'Editar'}
                 </button>
                                 <button
                   onClick={() => setViewingFarm(farm)}
                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                 >
                   <Eye className="w-4 h-4" />
                   Ver
                 </button>
               </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Farm Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 mt-6"
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
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: Silverwastes RIBA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={newFarm.description}
                onChange={(e) => setNewFarm({...newFarm, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                rows={3}
                placeholder="Descripción del farm..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tiempo Estimado
                </label>
                <input
                  type="text"
                  value={newFarm.estimatedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="010000 → 01:00:00"
                />
                <p className="text-xs text-gray-400 mt-1">6 dígitos: HHMMSS (ej: 013000 = 01:30:00)</p>
              </div>
              
                              <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <GW2Icon type="gold" size="sm" />
                    Oro Estimado <span className="text-yellow-500">(opcional*)</span>
                  </label>
                <input
                  type="text"
                  value={newFarm.estimatedGold}
                  onChange={(e) => handleGoldChange(e.target.value)}
                  onBlur={(e) => formatGoldOnBlur(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="15g 50s 25c/h"
                />
                <p className="text-xs text-gray-400 mt-1">Formato: XgYsZc</p>
              </div>

                              <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <GW2Icon type="spirit-shard" size="sm" />
                    Spirit Shards <span className="text-purple-500">(opcional*)</span>
                  </label>
                <input
                  type="text"
                  value={newFarm.estimatedSpirit}
                  onChange={(e) => handleSpiritChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="25"
                />
                <p className="text-xs text-gray-400 mt-1">Cantidad por hora</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expansiones Requeridas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'core', label: 'Core Game' },
                  { value: 'hot', label: 'Heart of Thorns' },
                  { value: 'pof', label: 'Path of Fire' },
                  { value: 'eod', label: 'End of Dragons' },
                  { value: 'soto', label: 'Secrets of the Obscure' },
                  { value: 'jw', label: 'Janthir Wilds' }
                ].map((expansion) => (
                  <label key={expansion.value} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFarm.expansion.includes(expansion.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')}
                      onChange={() => handleExpansionToggle(expansion.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white text-sm">{expansion.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Selecciona todas las expansiones requeridas</p>
            </div>

            {/* Nota explicativa */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-4">
              <p className="text-blue-300 text-sm">
                <strong>*</strong> Debe especificar al menos oro <strong>o</strong> spirit shards. Algunos farms generan solo oro, otros solo spirit shards, y algunos ambos.
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateFarm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
                 </motion.div>
       )}
     </div>
   );

     // Renderizar sección de farms publicados
   const renderPublishedFarms = () => (
     <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white">Farms Publicados - Edición Limitada</h2>
       <p className="text-gray-400 text-sm">
         Puedes editar descripción, tiempo y recompensas de farms publicados. 
         Los cambios se marcarán como &quot;editado por moderador&quot;.
       </p>

       {publishedFarms.length === 0 ? (
         <div className="text-center py-12">
           <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
           <p className="text-gray-400">No hay farms publicados disponibles</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {publishedFarms.map((farm) => (
             <motion.div
               key={farm.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-slate-800 rounded-lg p-6 border border-green-500/30"
             >
               <div className="flex items-start justify-between mb-4">
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-1">{farm.name}</h3>
                   <p className="text-gray-400 text-sm">{farm.description}</p>
                   <p className="text-green-400 text-xs mt-1">
                     Creado por: {farm.createdByUsername || 'Usuario'}
                   </p>
                   {/* Indicador de edición por moderador (comentado hasta que se ejecute la migración) */}
                   {/* {farm.lastEditedBy && (
                     <p className="text-blue-400 text-xs mt-1">
                       Editado por moderador
                     </p>
                   )} */}
                 </div>
                 <div className="flex items-center gap-1">
                   <CheckCircle className="w-5 h-5 text-green-500" />
                 </div>
               </div>

               <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <GW2Icon type="time" size="sm" />
                   <span>{farm.estimatedTime}</span>
                 </div>
                 {farm.estimatedGold && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="gold" size="sm" />
                     <span>{farm.estimatedGold}</span>
                   </div>
                 )}
                 {farm.estimatedSpirit && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="spirit-shard" size="sm" />
                     <span>{farm.estimatedSpirit} Spirit Shards</span>
                   </div>
                 )}
               </div>

               <div className="flex gap-2">
                 <button
                   onClick={() => setViewingFarm(farm)}
                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                 >
                   <Eye className="w-4 h-4" />
                   Ver
                 </button>
                 <button
                   onClick={() => setEditingFarm(farm)}
                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                 >
                   <Edit className="w-4 h-4" />
                   Editar
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       )}
     </div>
   );

   // Renderizar sección de farms pendientes
   const renderPendingFarms = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Farms Pendientes de Aprobación</h2>

      {pendingFarms.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-gray-400">No hay farms pendientes de aprobación</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingFarms.map((farm) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg p-6 border border-yellow-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                                 <div>
                   <h3 className="text-lg font-semibold text-white mb-1">{farm.name}</h3>
                   <p className="text-gray-400 text-sm">{farm.description}</p>
                   <p className="text-yellow-400 text-xs mt-1">
                     Creado por: {farm.createdByUsername || 'Usuario'}
                   </p>
                 </div>
                 <div className="relative group">
                   <AlertCircle className="w-5 h-5 text-yellow-500 cursor-help" />
                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                     En estado pendiente
                     <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                   </div>
                 </div>
              </div>

                                                         <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <GW2Icon type="time" size="sm" />
                   <span>{farm.estimatedTime}</span>
                 </div>
                 {farm.estimatedGold && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="gold" size="sm" />
                     <span>{farm.estimatedGold}</span>
                   </div>
                 )}
                 {farm.estimatedSpirit && (
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <GW2Icon type="spirit-shard" size="sm" />
                     <span>{farm.estimatedSpirit} Spirit Shards</span>
                   </div>
                 )}
               </div>

              <div className="flex gap-2">
                                 <button
                   onClick={() => setViewingFarm(farm)}
                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                 >
                   <Eye className="w-4 h-4" />
                   Revisar
                 </button>
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  

  return (
    <ModeratorRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Panel de Moderación</h1>
            <p className="text-gray-300">Gestiona tus farms y revisa contenido pendiente</p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
                         <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
               <button
                 onClick={() => setActiveSection('my-farms')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                   activeSection === 'my-farms'
                     ? 'bg-blue-600 text-white'
                     : 'text-gray-400 hover:text-white'
                 }`}
               >
                 <Map className="w-5 h-5" />
                 Mis Farms
               </button>
               <button
                 onClick={() => setActiveSection('pending-farms')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors relative ${
                   activeSection === 'pending-farms'
                     ? 'bg-blue-600 text-white'
                     : 'text-gray-400 hover:text-white'
                 }`}
               >
                 <AlertCircle className="w-5 h-5" />
                 Pendientes
                 {pendingFarms.length > 0 && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                     {pendingFarms.length}
                   </span>
                 )}
               </button>
               <button
                 onClick={() => setActiveSection('published-farms')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                   activeSection === 'published-farms'
                     ? 'bg-blue-600 text-white'
                     : 'text-gray-400 hover:text-white'
                 }`}
               >
                 <CheckCircle className="w-5 h-5" />
                 Publicados
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
             {activeSection === 'my-farms' && renderMyFarms()}
             {activeSection === 'pending-farms' && renderPendingFarms()}
             {activeSection === 'published-farms' && renderPublishedFarms()}
           </motion.div>
        </div>
      </div>



             {/* Modal de notificaciones */}
       <Modal
         isOpen={modal.isOpen}
         onClose={closeModal}
         type={modal.type}
         title={modal.title}
         message={modal.message}
       />

       {/* Modal para ver detalles del farm */}
       {viewingFarm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4">
               <h2 className="text-2xl font-bold text-white">Detalles del Farm</h2>
               <button
                 onClick={() => setViewingFarm(null)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
             </div>

             <div className="space-y-4">
               {/* Header con nombre y expansiones */}
               <div className="flex items-center gap-4 mb-4">
                 <h3 className="text-xl font-semibold text-white">{viewingFarm.name}</h3>
                 <div className="flex gap-1">
                   {(Array.isArray(viewingFarm.expansion) ? viewingFarm.expansion : [viewingFarm.expansion]).map((exp) => (
                     <ExpansionIcon key={exp} expansion={exp} size="sm" variant="compact" />
                   ))}
                 </div>
               </div>

               {/* Estado del farm */}
               <div className="flex items-center gap-2 mb-4">
                 {viewingFarm.status === 'approved' && (
                   <div className="flex items-center gap-2 text-green-400">
                     <CheckCircle className="w-5 h-5" />
                     <span className="text-sm font-medium">Aprobado</span>
                   </div>
                 )}
                 {viewingFarm.status === 'pending' && (
                   <div className="flex items-center gap-2 text-yellow-400">
                     <AlertCircle className="w-5 h-5" />
                     <span className="text-sm font-medium">Pendiente de aprobación</span>
                   </div>
                 )}
                 {viewingFarm.status === 'rejected' && (
                   <div className="flex items-center gap-2 text-red-400">
                     <XCircle className="w-5 h-5" />
                     <span className="text-sm font-medium">Rechazado</span>
                   </div>
                 )}
               </div>

               {/* Descripción */}
               <div>
                 <h4 className="text-sm font-medium text-gray-300 mb-2">Descripción</h4>
                 <p className="text-white text-sm leading-relaxed">{viewingFarm.description}</p>
               </div>

                                               {/* Información de tiempo y recompensas */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-slate-700 rounded-lg p-3">
                     <div className="flex items-center gap-2 mb-2">
                       <GW2Icon type="time" size="sm" />
                       <span className="text-sm font-medium text-gray-300">Tiempo Estimado</span>
                     </div>
                     <p className="text-white font-semibold">{viewingFarm.estimatedTime}</p>
                   </div>

                   {viewingFarm.estimatedGold && (
                     <div className="bg-slate-700 rounded-lg p-3">
                       <div className="flex items-center gap-2 mb-2">
                         <GW2Icon type="gold" size="sm" />
                         <span className="text-sm font-medium text-gray-300">Oro Estimado</span>
                       </div>
                       <p className="text-white font-semibold">{viewingFarm.estimatedGold}</p>
                     </div>
                   )}

                   {viewingFarm.estimatedSpirit && (
                     <div className="bg-slate-700 rounded-lg p-3">
                       <div className="flex items-center gap-2 mb-2">
                         <GW2Icon type="spirit-shard" size="sm" />
                         <span className="text-sm font-medium text-gray-300">Spirit Shards</span>
                       </div>
                       <p className="text-white font-semibold">{viewingFarm.estimatedSpirit}</p>
                     </div>
                   )}
                 </div>

               {/* Información del creador */}
               <div className="bg-slate-700 rounded-lg p-3">
                 <h4 className="text-sm font-medium text-gray-300 mb-2">Información del Creador</h4>
                 <p className="text-white text-sm">
                   <span className="text-gray-400">Creado por:</span> {viewingFarm.createdByUsername || 'Usuario desconocido'}
                 </p>
                 {viewingFarm.createdAt && (
                   <p className="text-white text-sm mt-1">
                     <span className="text-gray-400">Fecha de creación:</span> {new Date(viewingFarm.createdAt).toLocaleDateString('es-ES')}
                   </p>
                 )}
               </div>

               {/* Botones de acción */}
               <div className="flex gap-3 pt-4 border-t border-slate-600">
                 <button
                   onClick={() => {
                     setViewingFarm(null);
                     setEditingFarm(viewingFarm);
                   }}
                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                 >
                   <Edit className="w-4 h-4" />
                   Editar
                 </button>
                 <button
                   onClick={() => setViewingFarm(null)}
                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                 >
                   <X className="w-4 h-4" />
                   Cerrar
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Farm Modal */}
       {editingFarm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4">
               <h2 className="text-2xl font-bold text-white">
                 Editar Farm: {editingFarm.name}
                 {editingFarm.status === 'approved' && editingFarm.createdBy !== user?.id && (
                   <span className="text-blue-400 text-sm ml-2">(Edición Limitada)</span>
                 )}
               </h2>
               <button
                 onClick={() => setEditingFarm(null)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
             </div>
            
             <div className="space-y-4">
               {/* Solo mostrar nombre si no es edición limitada */}
               {!(editingFarm.status === 'approved' && editingFarm.createdBy !== user?.id) && (
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Nombre
                   </label>
                   <input
                     type="text"
                     value={editingFarm.name}
                     onChange={(e) => setEditingFarm({...editingFarm, name: e.target.value})}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                     placeholder="Ej: Silverwastes RIBA"
                   />
                 </div>
               )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingFarm.description}
                  onChange={(e) => setEditingFarm({...editingFarm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Descripción del farm..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Tiempo Estimado
                   </label>
                   <input
                     type="text"
                     value={editingFarm.estimatedTime}
                     onChange={(e) => {
                       const formatted = formatTimeInput(e.target.value);
                       setEditingFarm({...editingFarm, estimatedTime: formatted});
                     }}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                     placeholder="010000 → 01:00:00"
                   />
                   <p className="text-xs text-gray-400 mt-1">6 dígitos: HHMMSS (ej: 013000 = 01:30:00)</p>
                 </div>
                
                                <div>
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                     <GW2Icon type="gold" size="sm" />
                     Oro Estimado <span className="text-yellow-500">(opcional*)</span>
                   </label>
                   <input
                     type="text"
                     value={editingFarm.estimatedGold}
                     onChange={(e) => {
                       setEditingFarm({...editingFarm, estimatedGold: e.target.value});
                     }}
                     onBlur={(e) => {
                       const formatted = formatGoldInput(e.target.value);
                       setEditingFarm({...editingFarm, estimatedGold: formatted});
                     }}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                     placeholder="15g 50s 25c/h"
                   />
                   <p className="text-xs text-gray-400 mt-1">Formato: XgYsZc</p>
                 </div>

                                <div>
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                     <GW2Icon type="spirit-shard" size="sm" />
                     Spirit Shards <span className="text-purple-500">(opcional*)</span>
                   </label>
                   <input
                     type="text"
                     value={editingFarm.estimatedSpirit || ''}
                     onChange={(e) => {
                       const cleaned = e.target.value.replace(/[^\d]/g, '');
                       setEditingFarm({...editingFarm, estimatedSpirit: cleaned});
                     }}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                     placeholder="25"
                   />
                   <p className="text-xs text-gray-400 mt-1">Cantidad por hora</p>
                 </div>
              </div>
              
                            {/* Solo mostrar expansiones si no es edición limitada */}
               {!(editingFarm.status === 'approved' && editingFarm.createdBy !== user?.id) && (
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Expansiones Requeridas
                   </label>
                   <div className="grid grid-cols-2 gap-2">
                     {[
                       { value: 'core', label: 'Core Game' },
                       { value: 'hot', label: 'Heart of Thorns' },
                       { value: 'pof', label: 'Path of Fire' },
                       { value: 'eod', label: 'End of Dragons' },
                       { value: 'soto', label: 'Secrets of the Obscure' },
                       { value: 'jw', label: 'Janthir Wilds' }
                     ].map((expansion) => (
                       <label key={expansion.value} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-500 cursor-pointer">
                         <input
                           type="checkbox"
                           checked={Array.isArray(editingFarm.expansion) ? editingFarm.expansion.includes(expansion.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw') : editingFarm.expansion === expansion.value}
                           onChange={() => {
                             const currentExpansions = Array.isArray(editingFarm.expansion) ? editingFarm.expansion : [editingFarm.expansion];
                             const newExpansions = currentExpansions.includes(expansion.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')
                               ? currentExpansions.filter(exp => exp !== expansion.value)
                               : [...currentExpansions, expansion.value as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw'];
                             setEditingFarm({...editingFarm, expansion: newExpansions});
                           }}
                           className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                         />
                         <span className="text-white text-sm">{expansion.label}</span>
                       </label>
                     ))}
                   </div>
                   <p className="text-xs text-gray-400 mt-1">Selecciona todas las expansiones requeridas</p>
                 </div>
                              )}

                {/* Nota explicativa */}
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-4">
                  <p className="text-blue-300 text-sm">
                    <strong>*</strong> Debe especificar al menos oro <strong>o</strong> spirit shards. Algunos farms generan solo oro, otros solo spirit shards, y algunos ambos.
                  </p>
                  {editingFarm.status === 'approved' && editingFarm.createdBy !== user?.id && (
                    <p className="text-yellow-300 text-sm mt-2">
                      <strong>⚠️ Edición Limitada:</strong> Solo puedes editar descripción, tiempo y recompensas. 
                      Los cambios se marcarán como &quot;editado por moderador&quot;.
                    </p>
                  )}
                </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-600">
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
            </div>
          </div>
        </div>
      )}
    </ModeratorRoute>
  );
} 