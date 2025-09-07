'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'
import { 
  Package, 
  Gift,
  Hammer,
  Route,
  Clock,
  BarChart3,
  Settings,
  Save,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  GripVertical,
  BookOpen
} from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useI18n } from '@/contexts/I18nContext'
import { useState, useEffect, useMemo } from 'react'

interface DashboardCard {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
  delay: number
  visible: boolean
  order: number
}

// Configuración inicial de las tarjetas - movida fuera del componente para evitar recreación
const initialCards: DashboardCard[] = [
  {
    id: "farms",
    title: "dashboard.farms.title",
    description: "dashboard.farms.description",
    href: "/farming-routes",
    icon: <Route className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    delay: 0.1,
    visible: true,
    order: 0
  },
  {
    id: "dailyRoutine",
    title: "dashboard.dailyRoutine.title",
    description: "dashboard.dailyRoutine.description",
    href: "/daily-routine",
    icon: <Clock className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    delay: 0.2,
    visible: true,
    order: 1
  },
  {
    id: "salvaging",
    title: "dashboard.salvaging.title",
    description: "dashboard.salvaging.description",
    href: "/salvage",
    icon: <Package className="w-8 h-8" />,
    color: "from-orange-500 to-orange-600",
    delay: 0.3,
    visible: true,
    order: 2
  },
  {
    id: "trophy",
    title: "dashboard.trophy.title",
    description: "dashboard.trophy.description",
    href: "/trophy",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
    delay: 0.4,
    visible: true,
    order: 3
  },
  {
    id: "festivals",
    title: "dashboard.festivals.title",
    description: "dashboard.festivals.description",
    href: "/festivals",
    icon: <Gift className="w-8 h-8" />,
    color: "from-pink-500 to-pink-600",
    delay: 0.5,
    visible: true,
    order: 4
  },
  {
    id: "farmingTracker",
    title: "dashboard.farmingTracker.title",
    description: "dashboard.farmingTracker.description",
    href: "/fractals",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-600",
    delay: 0.6,
    visible: true,
    order: 5
  },
  {
    id: "glossary",
    title: "dashboard.glossary.title",
    description: "dashboard.glossary.description",
    href: "/glossary",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-teal-500 to-teal-600",
    delay: 0.8,
    visible: false,
    order: 7
  },
  {
    id: "orrianJewelry",
    title: "dashboard.orrianJewelry.title",
    description: "dashboard.orrianJewelry.description",
    href: "/orrian-jewelry-box",
    icon: <Gift className="w-8 h-8" />,
    color: "from-rose-500 to-rose-600",
    delay: 0.9,
    visible: false,
    order: 8
  }
  
];

export default function HomePage() {
  usePageTitle('pageTitles.home', 'Home');
  const { t } = useI18n();
  
  // Estados para personalización
  const [isEditMode, setIsEditMode] = useState(false);
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);
  const [originalCards, setOriginalCards] = useState<DashboardCard[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Función para reconstruir iconos desde los datos guardados
  const reconstructCardWithIcon = (savedCard: Omit<DashboardCard, 'icon'>): DashboardCard => {
    const iconMap: Record<string, React.ReactNode> = {
      "farms": <Route className="w-8 h-8" />,
      "dailyRoutine": <Clock className="w-8 h-8" />,
      "salvaging": <Package className="w-8 h-8" />,
      "trophy": <Hammer className="w-8 h-8" />,
      "festivals": <Gift className="w-8 h-8" />,
      "farmingTracker": <BarChart3 className="w-8 h-8" />,
      "glossary": <BookOpen className="w-8 h-8" />,
      "orrianJewelry": <Gift className="w-8 h-8" />
    };

    return {
      ...savedCard,
      icon: iconMap[savedCard.id] || <Package className="w-8 h-8" />
    };
  };

  // Cargar configuración guardada al inicializar
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboard-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        const reconstructedCards = parsedConfig.map(reconstructCardWithIcon);
        setDashboardCards(reconstructedCards);
        setOriginalCards(reconstructedCards);
      } catch (error) {
        console.error('Error loading dashboard config:', error);
        setDashboardCards(initialCards);
        setOriginalCards(initialCards);
      }
    } else {
      setDashboardCards(initialCards);
      setOriginalCards(initialCards);
    }
  }, []); // Array de dependencias vacío ya que initialCards es ahora una constante

  // Guardar configuración en localStorage
  const saveDashboardConfig = (cards: DashboardCard[]) => {
    // Crear una versión serializable sin los componentes React
    const serializableCards = cards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description,
      href: card.href,
      color: card.color,
      delay: card.delay,
      visible: card.visible,
      order: card.order
    }));
    localStorage.setItem('dashboard-config', JSON.stringify(serializableCards));
  };

  // Funciones de personalización
  const toggleEditMode = () => {
    if (isEditMode) {
      // Al salir del modo edición, restaurar configuración original
      setDashboardCards(originalCards);
    }
    setIsEditMode(!isEditMode);
  };

  const saveChanges = () => {
    setOriginalCards(dashboardCards);
    saveDashboardConfig(dashboardCards);
    setIsEditMode(false);
    // Mostrar notificación de éxito
    // toast.success(t('dashboard.customizationSaved', 'Personalización guardada'));
  };

  const resetDashboard = () => {
    setDashboardCards(initialCards);
    setOriginalCards(initialCards);
    saveDashboardConfig(initialCards);
    setIsEditMode(false);
    // Mostrar notificación de éxito
    // toast.success(t('dashboard.customizationReset', 'Dashboard restablecido'));
  };

  const toggleCardVisibility = (cardId: string) => {
    setDashboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, visible: !card.visible }
          : card
      )
    );
  };

  const reorderCards = (fromIndex: number, toIndex: number) => {
    const newCards = [...dashboardCards];
    const [movedCard] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, movedCard);
    
    // Actualizar el orden
    const updatedCards = newCards.map((card, index) => ({
      ...card,
      order: index
    }));
    
    setDashboardCards(updatedCards);
  };

  // Funciones de drag and drop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (e: any, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = (e: any, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderCards(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Eventos de festivales (fechas aproximadas; actualizar cada año según calendario oficial)
  const now = new Date();
  const currentYear = now.getFullYear();
  type MonthDay = { month: number; day: number };
  interface FestivalEvent {
    nameKey: string;
    path: string;
    start: MonthDay;
    end: MonthDay;
    color: string;
  }
  interface FestivalEventWithDates extends Omit<FestivalEvent, 'start' | 'end'> {
    start: Date;
    end: Date;
  }
  // UpcomingFestival type removed (CTA solo para activo)

  const festivalEvents: FestivalEvent[] = [
    {
      nameKey: 'festival.fourWinds',
      path: '/festivals/four-winds',
      start: { month: 7, day: 20 },
      end: { month: 8, day: 20 },
      color: 'from-green-600 to-cyan-600',
    },
    {
      nameKey: 'festival.halloween',
      path: '/festivals/halloween',
      start: { month: 10, day: 15 },
      end: { month: 11, day: 5 },
      color: 'from-orange-600 to-orange-700',
    },
    {
      nameKey: 'festival.lunarNewYear',
      path: '/festivals/lunar-new-year',
      start: { month: 1, day: 20 },
      end: { month: 2, day: 10 },
      color: 'from-red-600 to-yellow-500',
    },
    {
      nameKey: 'festival.dragonBash',
      path: '/festivals/dragon-bash',
      start: { month: 6, day: 20 },
      end: { month: 7, day: 10 },
      color: 'from-emerald-600 to-teal-600',
    },
    {
      nameKey: 'festival.wintersday',
      path: '/festivals/wintersday',
      start: { month: 12, day: 12 },
      end: { month: 1, day: 5 }, // cruza de año
      color: 'from-sky-600 to-cyan-500',
    },
  ];

  const addDates = (evt: FestivalEvent): FestivalEventWithDates => {
    const start = new Date(currentYear, evt.start.month - 1, evt.start.day, 0, 0, 0);
    let end = new Date(currentYear, evt.end.month - 1, evt.end.day, 23, 59, 59);
    if (end < start) {
      // Evento cruza de año
      end = new Date(currentYear + 1, evt.end.month - 1, evt.end.day, 23, 59, 59);
    }
    return { ...evt, start, end };
  };

  const eventsWithDates: FestivalEventWithDates[] = festivalEvents.map(addDates);
  const activeEvent = eventsWithDates.find(e => now >= e.start && now <= e.end);

  // Nota: lógica de próximo evento removida porque el CTA solo se muestra con evento activo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      {/* Container principal */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section - Banner Promocional */}
        <section className="relative overflow-hidden rounded-xl mb-12 h-72 md:h-96">
          {/* Imagen de fondo de Visions of Eternity */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{
              backgroundImage: 'url(/images/backgrounds/voe-background.jpg)',
            }}
          >
            {/* Overlay mejorado */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent rounded-xl"></div>
          </div>

          {/* Logo central */}
          <div className="absolute inset-0 flex items-center justify-center -mt-8 md:-mt-16">
            <Image 
              src="/images/backgrounds/GuildWars2.gif" 
              alt="Guild Wars 2: Visions of Eternity"
              width={420}
              height={420}
              priority
              unoptimized
              className="max-w-[260px] md:max-w-sm lg:max-w-md h-auto drop-shadow-2xl"
            />
          </div>

          {/* Contenido principal */}
          <div className="absolute bottom-8 left-0 right-0 text-center translate-y-[0.5cm]">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4">
        
                {/* (CTA de evento movido debajo, antes de Available Tools) */}

                {/* Botón Purchase Now */}
                <div className="pt-2">
                  <motion.a
                    href="http://guildwars2.go2cloud.org/aff_c?offer_id=28&aff_id=757"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-md text-base shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('cta.purchaseNow', 'Purchase Now')}
                  </motion.a>
                  
                  <div className="mt-3 flex justify-center">
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section> 

        {/* Sección de herramientas principales */}
        <section className="mb-12">
          {/* CTA de Evento Activo arriba del título (solo cuando hay evento activo) */}
          {activeEvent && (
            <div className="mb-6 flex flex-col items-center">
              <Link href={activeEvent.path}>
                <span className={`inline-block bg-gradient-to-r ${activeEvent.color} hover:opacity-95 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duración-300 transform hover:-translate-y-1 border border-white/10`}>
                  {t('cta.activeEvent', `Active event: {name}`).replace('{name}', t(activeEvent.nameKey))}
                </span>
              </Link>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                {t('section.availableTools')}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                {t('home.hero.subtitle')}
              </p>
              
              {/* Controles de personalización */}
              <div className="flex items-center justify-end gap-2">
                {isEditMode ? (
                  <>
                    <button
                      onClick={saveChanges}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      {t('dashboard.saveChanges', 'Guardar Cambios')}
                    </button>
                    <button
                      onClick={resetDashboard}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('dashboard.reset', 'Restablecer')}
                    </button>
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      {t('dashboard.cancel', 'Cancelar')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    {t('dashboard.customize', 'Personalizar Dashboard')}
                  </button>
                )}
              </div>
            </div>
            
            {isEditMode && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm text-center">
                  {t('dashboard.dragToReorder', 'Arrastra para reordenar')} • {t('dashboard.toggleVisibility', 'Mostrar/Ocultar')}
                </p>
              </div>
            )}
          </motion.div>

          {/* Grid de herramientas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards
              .filter(card => isEditMode || card.visible)
              .sort((a, b) => a.order - b.order)
              .map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: card.delay }}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative ${isEditMode ? 'cursor-move' : ''}`}
              >
                {isEditMode && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button
                      onClick={() => toggleCardVisibility(card.id)}
                      className="p-1 bg-black/50 hover:bg-black/70 text-white rounded transition-colors duration-200"
                      title={card.visible ? t('dashboard.toggleVisibility', 'Ocultar') : t('dashboard.toggleVisibility', 'Mostrar')}
                    >
                      {card.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <div className="p-1 bg-black/50 text-white rounded cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                <Link href={card.href} className={isEditMode ? 'pointer-events-none' : ''}>
                  <div className={`bg-gradient-to-br ${card.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border border-white/10 ${
                    isEditMode 
                      ? card.visible 
                        ? 'opacity-90' 
                        : 'opacity-50 border-dashed border-2 border-gray-500'
                      : ''
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-white">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {t(card.title, card.title)}
                        </h3>
                        <p className="text-gray-100 text-sm leading-relaxed">
                          {t(card.description, card.description)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
} 