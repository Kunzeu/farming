'use client'

import { motion } from '@/lib/framer-motion-optimized'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
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
  BookOpen,
  Award,
  TreePine,
  Trophy,
  Box,
  Dice6,
  RefreshCw,
  Map,
  Sparkles,
  Crown
} from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useI18n } from '@/contexts/I18nContext'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences'
import Slogan from '@/components/ui/Slogan'
import { getActiveFestivalEvents } from '@/lib/festival-dates'
import { getUtilityOrder } from '@/lib/page-usage-tracker'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Modal from '@/components/ui/Modal'

// Lazy loading para componentes pesados
const DashboardSettings = lazy(() => import('@/components/DashboardSettings'))


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

// Configuración inicial de las tarjetas 
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
    id: "magic",
    title: "dashboard.magic.title",
    description: "dashboard.magic.description",
    href: "/magic",
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
    id: "giftOfMastery",
    title: "dashboard.giftOfMastery.title",
    description: "dashboard.giftOfMastery.description",
    href: "/gift-of-mastery",
    icon: <Award className="w-8 h-8" />,
    color: "from-amber-500 to-yellow-600",
    delay: 1.0,
    visible: true,
    order: 7
  },
  {
    id: "giftOfJadeMastery",
    title: "dashboard.giftOfJadeMastery.title",
    description: "dashboard.giftOfJadeMastery.description",
    href: "/gift-of-jade-mastery",
    icon: <Gift className="w-8 h-8" />,
    color: "from-cyan-500 to-teal-600",
    delay: 1.1,
    visible: true,
    order: 8
  },
  {
    id: "garden",
    title: "dashboard.garden.title",
    description: "dashboard.garden.description",
    href: "/garden",
    icon: <TreePine className="w-8 h-8" />,
    color: "from-emerald-500 to-green-600",
    delay: 1.2,
    visible: true,
    order: 9
  },
  {
    id: "giveaways",
    title: "dashboard.giveaways.title",
    description: "dashboard.giveaways.description",
    href: "/giveaways",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-600",
    delay: 1.3,
    visible: true,
    order: 10
  },
  {
    id: "opened",
    title: "dashboard.opened.title",
    description: "dashboard.opened.description",
    href: "/opened",
    icon: <Box className="w-8 h-8" />,
    color: "from-violet-500 to-purple-600",
    delay: 1.4,
    visible: true,
    order: 11
  },
  {
    id: "ectogambling",
    title: "dashboard.ectogambling.title",
    description: "dashboard.ectogambling.description",
    href: "/ectogambling",
    icon: <Dice6 className="w-8 h-8" />,
    color: "from-red-500 to-pink-600",
    delay: 1.5,
    visible: true,
    order: 12
  },
  {
    id: "conversionGuide",
    title: "dashboard.conversionGuide.title",
    description: "dashboard.conversionGuide.description",
    href: "/conversion-guide",
    icon: <RefreshCw className="w-8 h-8" />,
    color: "from-sky-500 to-blue-600",
    delay: 1.6,
    visible: true,
    order: 13
  },
  {
    id: "altParking",
    title: "dashboard.altParking.title",
    description: "dashboard.altParking.description",
    href: "/alt-parking",
    icon: <Map className="w-8 h-8" />,
    color: "from-lime-500 to-green-600",
    delay: 1.7,
    visible: true,
    order: 14
  },
  {
    id: "orrianJewelry",
    title: "dashboard.orrianJewelry.title",
    description: "dashboard.orrianJewelry.description",
    href: "/orrian-jewelry-box",
    icon: <Gift className="w-8 h-8" />,
    color: "from-rose-500 to-rose-600",
    delay: 1.8,
    visible: true,
    order: 15
  },
  {
    id: "glossary",
    title: "dashboard.glossary.title",
    description: "dashboard.glossary.description",
    href: "/glossary",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-teal-500 to-teal-600",
    delay: 1.9,
    visible: true,
    order: 16
  },
  {
    id: "magicMirrors",
    title: "nav.magicMirrors",
    description: "magicMirrors.interactiveMap",
    href: "/castora/magic-mirrors",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-purple-500 to-indigo-600",
    delay: 2.0,
    visible: true,
    order: 17
  },

];

export default function HomePage() {
  usePageTitle('pageTitles.home', 'Home');
  const { t } = useI18n();
  const { user } = useAuth();
  const { preferences, isLoading, toggleCardVisibility: toggleVisibility, updateCardOrder } = useDashboardPreferences();

  // Estados para personalización
  const [isEditMode, setIsEditMode] = useState(false);
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);
  const [originalCards, setOriginalCards] = useState<DashboardCard[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mostUsedDashboard, setMostUsedDashboard] = useState<DashboardCard | null>(null);
  const [showNewToolMessage, setShowNewToolMessage] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener el icono según el ID y tamaño
  const getIcon = (cardId: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const iconSizeMap = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8',
      large: 'w-10 h-10'
    };
    const iconClass = iconSizeMap[size];

    const iconMap: Record<string, React.ReactNode> = {
      "farms": <Route className={iconClass} />,
      "dailyRoutine": <Clock className={iconClass} />,
      "salvaging": <Package className={iconClass} />,
      "magic": <Hammer className={iconClass} />,
      "festivals": <Gift className={iconClass} />,
      "farmingTracker": <BarChart3 className={iconClass} />,
      "glossary": <BookOpen className={iconClass} />,
      "orrianJewelry": <Gift className={iconClass} />,
      "giftOfMastery": <Award className={iconClass} />,
      "giftOfJadeMastery": <Gift className={iconClass} />,
      "garden": <TreePine className={iconClass} />,
      "giveaways": <Trophy className={iconClass} />,
      "opened": <Box className={iconClass} />,
      "ectogambling": <Dice6 className={iconClass} />,
      "conversionGuide": <RefreshCw className={iconClass} />,
      "altParking": <Map className={iconClass} />,
      "magicMirrors": <Sparkles className={iconClass} />,
      "orphanRoute": <Map className={iconClass} />,

    };

    return iconMap[cardId] || <Package className={iconClass} />;
  };

  // Función para reconstruir iconos y colores desde los datos guardados
  const reconstructCardWithIcon = (savedCard: Omit<DashboardCard, 'icon'>): DashboardCard => {
    const iconMap: Record<string, React.ReactNode> = {
      "farms": <Route className="w-8 h-8" />,
      "dailyRoutine": <Clock className="w-8 h-8" />,
      "salvaging": <Package className="w-8 h-8" />,
      "magic": <Hammer className="w-8 h-8" />,
      "festivals": <Gift className="w-8 h-8" />,
      "farmingTracker": <BarChart3 className="w-8 h-8" />,
      "glossary": <BookOpen className="w-8 h-8" />,
      "orrianJewelry": <Gift className="w-8 h-8" />,
      "giftOfMastery": <Award className="w-8 h-8" />,
      "giftOfJadeMastery": <Gift className="w-8 h-8" />,
      "garden": <TreePine className="w-8 h-8" />,
      "giveaways": <Trophy className="w-8 h-8" />,
      "opened": <Box className="w-8 h-8" />,
      "ectogambling": <Dice6 className="w-8 h-8" />,
      "conversionGuide": <RefreshCw className="w-8 h-8" />,
      "altParking": <Map className="w-8 h-8" />,
      "magicMirrors": <Sparkles className="w-8 h-8" />,
      "orphanRoute": <Map className="w-8 h-8" />,

    };

    const colorMap: Record<string, string> = {
      "farms": "from-blue-500 to-blue-600",
      "dailyRoutine": "from-green-500 to-green-600",
      "salvaging": "from-orange-500 to-orange-600",
      "magic": "from-purple-500 to-purple-600",
      "festivals": "from-pink-500 to-pink-600",
      "farmingTracker": "from-indigo-500 to-indigo-600",
      "glossary": "from-teal-500 to-teal-600",
      "orrianJewelry": "from-rose-500 to-rose-600",
      "giftOfMastery": "from-amber-500 to-yellow-600",
      "giftOfJadeMastery": "from-cyan-500 to-teal-600",
      "garden": "from-emerald-500 to-green-600",
      "giveaways": "from-yellow-500 to-orange-600",
      "opened": "from-violet-500 to-purple-600",
      "ectogambling": "from-red-500 to-pink-600",
      "conversionGuide": "from-sky-500 to-blue-600",
      "altParking": "from-lime-500 to-green-600",
      "magicMirrors": "from-purple-500 to-indigo-600",
      "orphanRoute": "from-cyan-500 to-blue-600",

    };

    return {
      ...savedCard,
      icon: iconMap[savedCard.id] || <Package className="w-8 h-8" />,
      color: colorMap[savedCard.id] || "from-gray-500 to-gray-600"
    };
  };

  // Cargar configuración basada en preferencias del usuario y orden por utilidad
  useEffect(() => {
    if (isLoading) return;

    // Filtrar tarjetas basado en preferencias del usuario
    const filteredCards = initialCards.filter(card =>
      !preferences.hiddenCards.includes(card.id)
    );

    // Reconstruir todas las tarjetas filtradas para asegurar colores correctos
    const reconstructedFilteredCards = filteredCards.map(card => reconstructCardWithIcon(card));

    // SIEMPRE usar orden por utilidad basado en las visitas (cookies/localStorage)
    // El orden se actualiza automáticamente cuando cambian las estadísticas de uso
    const cardHrefs: Record<string, string> = {};
    reconstructedFilteredCards.forEach(card => {
      cardHrefs[card.id] = card.href;
    });

    const utilityOrder = getUtilityOrder(
      reconstructedFilteredCards.map(card => card.id),
      cardHrefs
    );

    // Si el usuario ha personalizado el orden manualmente, combinar ambos:
    // Mantener las tarjetas ocultas según preferencias del usuario
    // Pero usar el orden por utilidad para las tarjetas visibles
    const finalOrder = utilityOrder;

    // Ordenar tarjetas según el orden final
    const orderedCards = finalOrder
      .map(cardId => {
        const foundCard = reconstructedFilteredCards.find(card => card.id === cardId);
        return foundCard || null;
      })
      .filter(Boolean) as DashboardCard[];

    // Agregar tarjetas que no están en el orden final
    const remainingCards = reconstructedFilteredCards.filter(card =>
      !finalOrder.includes(card.id)
    );

    const finalCards = [...orderedCards, ...remainingCards];
    setDashboardCards(finalCards);
    setOriginalCards(finalCards);
  }, [preferences.hiddenCards, isLoading]);

  // Función helper para actualizar el orden basado en utilidad
  const updateOrderByUtility = useRef(() => {
    if (isLoading) return;

    const filteredCards = initialCards.filter(card =>
      !preferences.hiddenCards.includes(card.id)
    );
    const reconstructedFilteredCards = filteredCards.map(card => reconstructCardWithIcon(card));

    const cardHrefs: Record<string, string> = {};
    reconstructedFilteredCards.forEach(card => {
      cardHrefs[card.id] = card.href;
    });

    const utilityOrder = getUtilityOrder(
      reconstructedFilteredCards.map(card => card.id),
      cardHrefs
    );

    const orderedCards = utilityOrder
      .map(cardId => {
        const foundCard = reconstructedFilteredCards.find(card => card.id === cardId);
        return foundCard || null;
      })
      .filter(Boolean) as DashboardCard[];

    const remainingCards = reconstructedFilteredCards.filter(card =>
      !utilityOrder.includes(card.id)
    );

    const finalCards = [...orderedCards, ...remainingCards];
    setDashboardCards(finalCards);
    setOriginalCards(finalCards);
  });

  // Actualizar la referencia cuando cambien las dependencias
  useEffect(() => {
    updateOrderByUtility.current = () => {
      if (isLoading) return;

      const filteredCards = initialCards.filter(card =>
        !preferences.hiddenCards.includes(card.id)
      );
      const reconstructedFilteredCards = filteredCards.map(card => reconstructCardWithIcon(card));

      const cardHrefs: Record<string, string> = {};
      reconstructedFilteredCards.forEach(card => {
        cardHrefs[card.id] = card.href;
      });

      const utilityOrder = getUtilityOrder(
        reconstructedFilteredCards.map(card => card.id),
        cardHrefs
      );

      const orderedCards = utilityOrder
        .map(cardId => {
          const foundCard = reconstructedFilteredCards.find(card => card.id === cardId);
          return foundCard || null;
        })
        .filter(Boolean) as DashboardCard[];

      const remainingCards = reconstructedFilteredCards.filter(card =>
        !utilityOrder.includes(card.id)
      );

      const finalCards = [...orderedCards, ...remainingCards];
      setDashboardCards(finalCards);
      setOriginalCards(finalCards);
    };
  }, [preferences.hiddenCards, isLoading]);

  // Actualizar el orden cuando cambien las estadísticas de uso
  useEffect(() => {
    if (isLoading) return;

    const handleUsageUpdate = () => {
      // Actualizar el orden cuando se actualicen las estadísticas de uso
      updateOrderByUtility.current();
    };

    // Escuchar el evento personalizado cuando se actualiza el tracking
    window.addEventListener('pageUsageUpdated', handleUsageUpdate);

    // También escuchar cambios en localStorage (para otros tabs)
    window.addEventListener('storage', handleUsageUpdate);

    return () => {
      window.removeEventListener('pageUsageUpdated', handleUsageUpdate);
      window.removeEventListener('storage', handleUsageUpdate);
    };
  }, [isLoading]);

  // Obtener el último dashboard agregado (garden)
  useEffect(() => {
    // Crear tarjeta para garden (última agregada)
    const gardenCard: DashboardCard = {
      id: "garden",
      title: "dashboard.garden.title",
      description: "dashboard.garden.description",
      href: "/garden",
      icon: <TreePine className="w-8 h-8" />,
      color: "from-emerald-500 to-green-600",
      delay: 0,
      visible: true,
      order: 17
    };

    setMostUsedDashboard(reconstructCardWithIcon(gardenCard));
  }, []);

  // Mostrar mensaje "Check our new tool" cada 6 segundos
  useEffect(() => {
    // Función para mostrar y ocultar el mensaje
    const showMessage = () => {
      // Limpiar timeout anterior si existe
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Mostrar el mensaje
      setShowNewToolMessage(true);

      // Ocultar después de 4 segundos
      hideTimeoutRef.current = setTimeout(() => {
        setShowNewToolMessage(false);
        hideTimeoutRef.current = null;
      }, 4000);
    };

    // Mostrar inmediatamente al inicio
    showMessage();

    // Configurar intervalo para repetir cada 6 segundos
    const interval = setInterval(() => {
      showMessage();
    }, 6000);

    return () => {
      clearInterval(interval);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

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
    // Las preferencias se guardan automáticamente en useDashboardPreferences
    setIsEditMode(false);
  };

  const resetDashboard = () => {
    setDashboardCards(initialCards);
    setOriginalCards(initialCards);
    // Las preferencias se guardan automáticamente en useDashboardPreferences
    setIsEditMode(false);
  };

  const toggleCardVisibility = (cardId: string) => {
    toggleVisibility(cardId);
    setDashboardCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, visible: !preferences.hiddenCards.includes(cardId) }
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

    // Actualizar el orden en las preferencias
    const newOrder = updatedCards.map(card => card.id);
    updateCardOrder(newOrder);

    setDashboardCards(updatedCards);
  };

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

  // Obtener eventos activos desde la configuración centralizada
  const activeFestivalEvents = getActiveFestivalEvents();
  const activeEvent = activeFestivalEvents[0]; // Mostrar el primer evento activo si hay múltiples


  return (
    <div className="home-page">
      <Head>
        <link
          rel="preload"
          href="/images/backgrounds/voe-background.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </Head>
      <Navigation />

      {/* Container principal */}
      <div className="container mx-auto px-4 pb-8 pt-16">

        {/* Hero Section - Banner Promocional */}
        <section className="relative overflow-hidden rounded-xl mb-2 h-72 md:h-96">
          {/* Imagen de fondo de Visions of Eternity */}
          <div className="absolute inset-0 rounded-xl">
            <Image
              src="/images/backgrounds/voe-background.webp"
              alt="Guild Wars 2: Visions of Eternity Background"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover rounded-xl"
              priority
              fetchPriority="high"
              quality={95}
              placeholder="empty"
            />
            {/* Overlay mejorado */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent rounded-xl"></div>
          </div>

          {/* Logo a la derecha */}
          <div className="absolute top-1/2 right-0 md:right-4 lg:right-8 transform -translate-y-1/2 -mt-8 md:-mt-10">
            <Image
              src="/images/backgrounds/GuildWars2.webp"
              alt="Guild Wars 2: Visions of Eternity"
              width={295}
              height={295}
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 250px, 295px"
              className="max-w-[180px] md:max-w-[250px] lg:max-w-[295px] h-auto drop-shadow-2xl"
            />
          </div>

          {/* Dashboard más utilizado - Centro */}
          {mostUsedDashboard && (() => {
            const cardSize = preferences.cardSizes[mostUsedDashboard.id] || 'medium';
            const sizeClasses = {
              small: 'p-4',
              medium: 'p-6',
              large: 'p-8'
            };
            const titleSizeClasses = {
              small: 'text-lg',
              medium: 'text-xl',
              large: 'text-2xl'
            };
            const descriptionSizeClasses = {
              small: 'text-xs',
              medium: 'text-sm',
              large: 'text-base'
            };

            return (
              <div className="absolute top-[0%] left-1/2 transform -translate-x-1/2 hidden md:block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Icono con contenedor para el mensaje */}
                  <div className="flex-shrink-0 relative">
                    <div className="transform translate-y-12">
                      <Image
                        src="/images/icons/icoon.webp"
                        alt="Icon"
                        width={128}
                        height={128}
                        className="w-32 h-32 drop-shadow-2xl"
                      />
                    </div>

                    {/* Nube de mensaje debajo del icono - posicionamiento absoluto para no afectar el layout */}
                    {showNewToolMessage && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-10">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="relative"
                        >
                          {/* Nube */}
                          <div className="bg-gradient-to-r from-blue-500/95 to-purple-600/95 backdrop-blur-sm border-2 border-blue-400 rounded-lg px-4 py-2 shadow-2xl">
                            <p className="text-white font-bold text-sm md:text-base text-center whitespace-nowrap">
                              {t('cta.checkNewTool', 'Check our new tool')}
                            </p>
                          </div>

                          {/* Cola de la nube que apunta al icono - más grande */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                            <div className="w-0 h-0 border-l-12 border-r-12 border-b-12 border-l-transparent border-r-transparent border-b-blue-500/95"></div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Espacio fijo reservado para el mensaje (mantiene el dashboard fijo) */}
                  <div className="h-[40px]"></div>

                  {/* Tarjeta del dashboard */}
                  <div className="w-64 mt-4">
                    <Link href={mostUsedDashboard.href}>
                      <div className={`bg-gradient-to-br ${mostUsedDashboard.color} ${sizeClasses[cardSize]} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border border-white/10`}>
                        <div className="text-white">
                          {getIcon(mostUsedDashboard.id, cardSize)}
                        </div>
                        <div>
                          <h3 className={`${titleSizeClasses[cardSize]} font-bold text-white mb-2`}>
                            {t(mostUsedDashboard.title, mostUsedDashboard.title)}
                          </h3>
                          <p className={`${descriptionSizeClasses[cardSize]} text-gray-100 leading-relaxed`}>
                            {t(mostUsedDashboard.description, mostUsedDashboard.description)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* Slogan aleatorio - Móvil */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block md:hidden">
            <Slogan
              variant="random"
              className="text-yellow-400 drop-shadow-2xl font-bold text-base"
            />
          </div>

          {/* Slogan aleatorio - Desktop */}
          <div className="absolute top-1/2 left-6 ml-12 transform -translate-y-1/2 hidden md:block" style={{ transform: 'translateY(-50%) rotate(-20deg)' }}>
            <Slogan
              variant="random"
              className="text-yellow-400 drop-shadow-2xl font-bold text-base md:text-lg lg:text-xl"
            />
          </div>

          {/* Contenido principal */}
          <div className="absolute bottom-8 right-0 md:right-4 lg:right-8 translate-y-[0.5cm] translate-x-[-1.5cm]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4">

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
        </section>

        {/* Sección de herramientas principales */}
        <section className="mb-12 pb-8">
          {/* Evento Activo arriba del título (solo cuando hay evento activo) */}
          {activeEvent && (
            <div className="mb-6 flex flex-col items-center">
              <Link href={activeEvent.path}>
                <span className={`inline-block bg-gradient-to-r ${activeEvent.color} hover:opacity-95 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10`}>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!user) {
                          setShowLoginModal(true);
                        } else {
                          setShowSettings(true);
                        }
                      }}
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                      <Settings className="w-3 h-3" />
                      <span className="hidden sm:inline">{t('dashboard.advancedSettings', 'Configuración Avanzada')}</span>
                      <span className="sm:hidden">{t('dashboard.advancedSettingsShort', 'Config')}</span>
                    </button>
                  </div>
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
          <div className={preferences.layout === 'list'
            ? 'space-y-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }>
            {dashboardCards
              .filter(card => isEditMode || card.visible)
              .map((card, index) => {
                const cardSize = preferences.cardSizes[card.id] || 'medium';
                const sizeClasses = {
                  small: 'p-4',
                  medium: 'p-6',
                  large: 'p-8'
                };
                const titleSizeClasses = {
                  small: 'text-lg',
                  medium: 'text-xl',
                  large: 'text-2xl'
                };
                const descriptionSizeClasses = {
                  small: 'text-xs',
                  medium: 'text-sm',
                  large: 'text-base'
                };

                return (
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
                    className={`relative ${isEditMode ? 'cursor-move' : ''} ${preferences.layout === 'list' ? 'w-full' : ''
                      }`}
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
                      <div className={`bg-gradient-to-br ${card.color} ${sizeClasses[cardSize]} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border border-white/10 ${preferences.layout === 'list' ? 'flex items-center space-x-4' : ''
                        } ${isEditMode
                          ? card.visible
                            ? 'opacity-90'
                            : 'opacity-50 border-dashed border-2 border-gray-500'
                          : ''
                        }`}>
                        <div className={`text-white ${preferences.layout === 'list' ? 'flex-shrink-0' : ''}`}>
                          {getIcon(card.id, cardSize)}
                        </div>
                        <div className={preferences.layout === 'list' ? 'flex-1' : ''}>
                          <h3 className={`${titleSizeClasses[cardSize]} font-bold text-white mb-2`}>
                            {t(card.title, card.title)}
                          </h3>
                          <p className={`${descriptionSizeClasses[cardSize]} text-gray-100 leading-relaxed`}>
                            {t(card.description, card.description)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </section>

      </div>

      {/* Modal de configuración avanzada */}
      <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="text-white">Cargando...</div></div>}>
        <DashboardSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </Suspense>

      {/* Modal de login requerido */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        type="error"
        title={t('dashboard.loginRequired.title', 'Inicio de sesión requerido')}
        message={t('dashboard.loginRequired.message', 'Debes estar logueado para usar esta opción.')}
      />
    </div>
  )
} 