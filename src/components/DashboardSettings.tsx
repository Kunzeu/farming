'use client';

import { useState, useEffect } from 'react';
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Grid, List, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableCards = [
  { id: 'farms', name: 'Rutas de Farming' },
  { id: 'dailyRoutine', name: 'Rutina Diaria' },
  { id: 'salvaging', name: 'Reciclaje' },
    { id: 'magic', name: 'Análisis de Magia' },
  { id: 'festivals', name: 'Festivales' },
  { id: 'farmingTracker', name: 'Fractales' },
  { id: 'glossary', name: 'Glosario' },
  { id: 'orrianJewelry', name: 'Caja de Joyas Orrianas' },
  { id: 'giftOfMastery', name: 'Gift of Mastery' },
  { id: 'giftOfJadeMastery', name: 'Gift of Jade Mastery' },
  { id: 'garden', name: 'Jardín' }
];

export default function DashboardSettings({ isOpen, onClose }: DashboardSettingsProps) {
  const { user } = useAuth();
  const {
    preferences,
    isLoading,
    updateCardOrder,
    toggleCardVisibility,
    updateCardSize,
    setGlobalCardSize,
    setLayout,
    resetToDefault
  } = useDashboardPreferences();

  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    
    if (!draggedCard || draggedCard === targetCardId) return;

    const newOrder = [...preferences.cardOrder];
    const draggedIndex = newOrder.indexOf(draggedCard);
    const targetIndex = newOrder.indexOf(targetCardId);

    // Mover la tarjeta
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedCard);

    updateCardOrder(newOrder);
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Configuración del Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Layout Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Diseño</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setLayout('grid')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                preferences.layout === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Grid className="w-4 h-4 mr-2" />
              Cuadrícula
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                preferences.layout === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </button>
          </div>
        </div>

        {/* Global Size Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Tamaño de Tarjetas</h3>
          <p className="text-gray-400 text-sm mb-4">
            Cambia el tamaño de todas las tarjetas del dashboard.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setGlobalCardSize('small')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                Object.values(preferences.cardSizes).every(size => size === 'small') || Object.keys(preferences.cardSizes).length === 0
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="w-3 h-3 bg-current rounded mr-2"></div>
              Pequeño
            </button>
            <button
              onClick={() => setGlobalCardSize('medium')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                Object.values(preferences.cardSizes).every(size => size === 'medium')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="w-4 h-4 bg-current rounded mr-2"></div>
              Mediano
            </button>
            <button
              onClick={() => setGlobalCardSize('large')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                Object.values(preferences.cardSizes).every(size => size === 'large')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="w-5 h-5 bg-current rounded mr-2"></div>
              Grande
            </button>
          </div>
        </div>

        {/* Card Order and Visibility */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Orden y Visibilidad de Tarjetas
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Arrastra para reordenar las tarjetas. Haz clic en el ojo para mostrar/ocultar.
          </p>
          
          <div className="space-y-2">
            {availableCards.map((card) => {
              const cardId = card.id;
              const isHidden = preferences.hiddenCards.includes(cardId);
              const cardSize = preferences.cardSizes[cardId] || 'medium';
              const isInOrder = preferences.cardOrder.includes(cardId);

              return (
                <div
                  key={cardId}
                  draggable={isInOrder}
                  onDragStart={(e) => isInOrder && handleDragStart(e, cardId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, cardId)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                    isInOrder ? 'border-dashed border-gray-500' : 'border-solid border-gray-600'
                  } ${
                    isHidden ? 'bg-gray-700' : 'bg-gray-700'
                  } ${draggedCard === cardId ? 'opacity-50' : ''} ${
                    !isInOrder ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {isInOrder && <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 cursor-move" />}
                    <span className={`${isHidden ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {card.name}
                    </span>
                    {!isInOrder && (
                      <span className="ml-2 text-xs text-gray-400">(No disponible)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Visibility Toggle - Solo si está en el orden */}
                    {isInOrder && (
                      <button
                        onClick={() => toggleCardVisibility(cardId)}
                        className={`p-2 rounded ${
                          isHidden ? 'text-gray-500 hover:text-gray-400' : 'text-blue-400 hover:text-blue-300'
                        }`}
                      >
                        {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            onClick={resetToDefault}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar por Defecto
          </button>
        </div>
      </div>
    </div>
  );
}
