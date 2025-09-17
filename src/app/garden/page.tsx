'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TreePine, 
  Flower2, 
  Star,
  Zap,
  ArrowLeft,
  Coins,
  BookOpen,
  Info,
  Target,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Hammer,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { usePageTitle } from '@/hooks/usePageTitle';

const JardinesPage = () => {
  const { t, lang } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('introduction');
  const [consortiumSickleData, setConsortiumSickleData] = useState<{name: string, icon: string} | null>(null);
  const [unboundMiningData, setUnboundMiningData] = useState<{name: string, icon: string} | null>(null);
  const [unboundLoggingData, setUnboundLoggingData] = useState<{name: string, icon: string} | null>(null);
  const [alternativeSickleData, setAlternativeSickleData] = useState<{name: string, icon: string} | null>(null);
  const [itemBoosterData, setItemBoosterData] = useState<{name: string, icon: string} | null>(null);
  const [guildBannerData, setGuildBannerData] = useState<{name: string, icon: string} | null>(null);
  const [xpBoosterData, setXpBoosterData] = useState<{name: string, icon: string} | null>(null);
  const [candyGobblerData, setCandyGobblerData] = useState<{name: string, icon: string} | null>(null);
  const [copiedWaypoint, setCopiedWaypoint] = useState<string | null>(null);
  const [list1Copied, setList1Copied] = useState(false);
  const [list2Copied, setList2Copied] = useState(false);
  const [list3Copied, setList3Copied] = useState(false);
  const [mapData, setMapData] = useState<Record<number, {name: string, region_name: string}>>({});

  // Configurar título de la página
  usePageTitle(t('gardenPage.title'), t('gardenPage.title'));

  // Obtener datos de los items de la API
  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        // Obtener datos de la Hoz del Consorcio (ID: 42594)
        const sickleResponse = await fetch(`https://api.guildwars2.com/v2/items/42594?lang=${lang}`);
        const sickleData = await sickleResponse.json();
        setConsortiumSickleData({
          name: sickleData.name,
          icon: sickleData.icon
        });

        // Obtener datos de la Herramienta de minería de magia liberada (ID: 80977)
        const miningResponse = await fetch(`https://api.guildwars2.com/v2/items/80977?lang=${lang}`);
        const miningData = await miningResponse.json();
        setUnboundMiningData({
          name: miningData.name,
          icon: miningData.icon
        });

        // Obtener datos de la Herramienta de tala de magia liberada (ID: 80979)
        const loggingResponse = await fetch(`https://api.guildwars2.com/v2/items/80979?lang=${lang}`);
        const loggingData = await loggingResponse.json();
        setUnboundLoggingData({
          name: loggingData.name,
          icon: loggingData.icon
        });

        // Obtener datos de la herramienta alternativa para plantas (ID: 102651)
        const alternativeSickleResponse = await fetch(`https://api.guildwars2.com/v2/items/102000?lang=${lang}`);
        const alternativeSickleData = await alternativeSickleResponse.json();
        setAlternativeSickleData({
          name: alternativeSickleData.name,
          icon: alternativeSickleData.icon
        });

        // Obtener datos del Item Booster (ID: 20003)
        const itemBoosterResponse = await fetch(`https://api.guildwars2.com/v2/items/20003?lang=${lang}`);
        const itemBoosterData = await itemBoosterResponse.json();
        setItemBoosterData({
          name: itemBoosterData.name,
          icon: itemBoosterData.icon
        });

        // Obtener datos del Guild Gathering Banner Booster (ID: 39699)
        const guildBannerResponse = await fetch(`https://api.guildwars2.com/v2/items/39699?lang=${lang}`);
        const guildBannerData = await guildBannerResponse.json();
        setGuildBannerData({
          name: guildBannerData.name,
          icon: guildBannerData.icon
        });

        // Obtener datos del Experience Booster (ID: 20002)
        const xpBoosterResponse = await fetch(`https://api.guildwars2.com/v2/items/20002?lang=${lang}`);
        const xpBoosterData = await xpBoosterResponse.json();
        setXpBoosterData({
          name: xpBoosterData.name,
          icon: xpBoosterData.icon
        });

        // Obtener datos del Candy Gobbler (ID: 67393)
        const candyGobblerResponse = await fetch(`https://api.guildwars2.com/v2/items/67393?lang=${lang}`);
        const candyGobblerData = await candyGobblerResponse.json();
        setCandyGobblerData({
          name: candyGobblerData.name,
          icon: candyGobblerData.icon
        });
      } catch (error) {
        console.error('Error fetching items data:', error);
      }
    };

    fetchItemsData();
  }, [lang]);

  // Obtener datos de los mapas de la API de GW2
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // IDs de los mapas que usamos en la página
        const mapIds = [21, 22, 24, 25, 26, 27, 28]; // Fields of Ruin, Kessex Hills, Gendarran Fields, Harathi Hinterlands, Blazeridge Steppes, Iron Marches, etc.
        
        const response = await fetch(`https://api.guildwars2.com/v2/maps?ids=${mapIds.join(',')}&lang=${lang}`);
        const maps = await response.json();
        
        const mapDataObj: Record<number, {name: string, region_name: string}> = {};
        maps.forEach((map: {id: number, name: string, region_name: string}) => {
          mapDataObj[map.id] = {
            name: map.name,
            region_name: map.region_name
          };
        });
        
        setMapData(mapDataObj);
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, [lang]);

  // Navegación suave con offset para el header
  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setSelectedSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const copyWaypointToClipboard = async (waypointCode: string) => {
    try {
      await navigator.clipboard.writeText(waypointCode);
      // Aquí podrías agregar una notificación de éxito si quieres
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  // Función para copiar waypoint al portapapeles
  const copyWaypoint = async (waypoint: string) => {
    try {
      await navigator.clipboard.writeText(waypoint);
      setCopiedWaypoint(waypoint);
      setTimeout(() => setCopiedWaypoint(null), 2000);
    } catch (err) {
      console.error('Error copying waypoint:', err);
    }
  };


  // Función para copiar Lista 1
  const copyList1 = async () => {
    const list1Waypoints = [
      '[&BE8BAAA=]',
      '[&BAACAAA=]',
      '[&BOwBAAA=]',
      '[&BMcDAAA=]',
      '[&BN4AAAA=]',
      '[&BB0CAAA=]',
      '[&BHgCAAA=]',
      '[&BMAAAAA=]',
      '[&BOYAAAA=]',
      '[&BF8CAAA=]',
      '[&BFECAAA=]',
      '[&BNECAAA=]',
      '[&BFgGAAA=]',
      '[&BMkBAAA=]',
      '[&BKcBAAA=]'
    ];
    
    // Organizar en bloques de 6
    const blocks = [];
    for (let i = 0; i < list1Waypoints.length; i += 6) {
      blocks.push(list1Waypoints.slice(i, i + 6).join(''));
    }
    const waypointsWithLineBreaks = blocks.join('\n');
    
    try {
      await navigator.clipboard.writeText(waypointsWithLineBreaks);
      setList1Copied(true);
      setTimeout(() => setList1Copied(false), 2000);
    } catch (err) {
      console.error('Error copying list 1:', err);
    }
  };

  // Función para copiar Lista 2
  const copyList2 = async () => {
    const list2Waypoints = [
      '[&BOQAAAA=]',
      '[&BKsAAAA=]',
      '[&BPoAAAA=]',
      '[&BBIAAAA=]',
      '[&BEIAAAA=]',
      '[&BEABAAA=]',
      '[&BFwAAAA=]',
      '[&BIYHAAA=]',
      '[&BKYCAAA=]',
      '[&BOAHAAA=]',
      '[&BA4IAAA=]',
      '[&BFcLAAA=]',
      '[&BF8JAAA=]',
      '[&BM0JAAA=]',
      '[&BH0JAAA=]'
    ];
    
    // Organizar en bloques de 6
    const blocks = [];
    for (let i = 0; i < list2Waypoints.length; i += 6) {
      blocks.push(list2Waypoints.slice(i, i + 6).join(''));
    }
    const waypointsWithLineBreaks = blocks.join('\n');
    
    try {
      await navigator.clipboard.writeText(waypointsWithLineBreaks);
      setList2Copied(true);
      setTimeout(() => setList2Copied(false), 2000);
    } catch (err) {
      console.error('Error copying list 2:', err);
    }
  };

  // Función para copiar Lista 3
  const copyList3 = async () => {
    const list3Text = '[&BNwKAAA=][&BCgKAAA=]x2[&BJEKAAA=][&BEAKAAA=][&BEMLAAA=][&BBsMAAA=][&BCcMAAA=][&BGQMAAA=]x3[&BBkNAAA=]x2[&BCANAAA=][&BNQMAAA=][&BFUOAAA=][&BNwNAAA=][&BK4OAAA=]x2';
    
    try {
      await navigator.clipboard.writeText(list3Text);
      setList3Copied(true);
      setTimeout(() => setList3Copied(false), 2000);
    } catch (err) {
      console.error('Error copying list 3:', err);
    }
  };

  // Detectar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['introduction', 'gardenTypes', 'plants', 'waypoints', 'locations', 'rewards'].includes(hash)) {
        setSelectedSection(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => { window.removeEventListener('hashchange', handleHashChange); };
  }, []);

  // Detectar scroll para actualizar sección activa
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'gardenTypes', 'plants', 'waypoints', 'locations', 'rewards'];
      const scrollPosition = window.scrollY + 100; // Offset para el header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setSelectedSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  const gardens = [
    {
      id: 'home',
      name: t('gardenPage.gardens.home.name'),
      description: t('gardenPage.gardens.home.description'),
      volatileMagic: t('gardenPage.gardens.home.volatileMagic'),
      growthTime: t('gardenPage.gardens.home.growthTime'),
      difficulty: t('gardenPage.gardens.home.difficulty'),
      requirements: [
        t('gardenPage.gardens.home.requirements.seeds'),
        t('gardenPage.gardens.home.requirements.water'),
        t('gardenPage.gardens.home.requirements.fertilizer')
      ],
      tips: [
        t('gardenPage.gardens.home.tips.dailyWatering'),
        t('gardenPage.gardens.home.tips.premiumFertilizer'),
        t('gardenPage.gardens.home.tips.optimalHarvest')
      ],
      icon: <TreePine className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      id: 'guild',
      name: t('gardenPage.gardens.guild.name'),
      description: t('gardenPage.gardens.guild.description'),
      volatileMagic: t('gardenPage.gardens.guild.volatileMagic'),
      growthTime: t('gardenPage.gardens.guild.growthTime'),
      difficulty: t('gardenPage.gardens.guild.difficulty'),
      requirements: [
        t('gardenPage.gardens.guild.requirements.guildAccess'),
        t('gardenPage.gardens.guild.requirements.contribution'),
        t('gardenPage.gardens.guild.requirements.unlockedNodes')
      ],
      tips: [
        t('gardenPage.gardens.guild.tips.coordinate'),
        t('gardenPage.gardens.guild.tips.participate'),
        t('gardenPage.gardens.guild.tips.maintainNodes')
      ],
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 'world',
      name: t('gardenPage.gardens.world.name'),
      description: t('gardenPage.gardens.world.description'),
      volatileMagic: t('gardenPage.gardens.world.volatileMagic'),
      growthTime: t('gardenPage.gardens.world.growthTime'),
      difficulty: t('gardenPage.gardens.world.difficulty'),
      requirements: [
        t('gardenPage.gardens.world.requirements.level80'),
        t('gardenPage.gardens.world.requirements.unlockedMaps'),
        t('gardenPage.gardens.world.requirements.tools')
      ],
      tips: [
        t('gardenPage.gardens.world.tips.specificTimes'),
        t('gardenPage.gardens.world.tips.extraTools'),
        t('gardenPage.gardens.world.tips.groupProtection')
      ],
      icon: <MapPin className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 'seasonal',
      name: t('gardenPage.gardens.seasonal.name'),
      description: t('gardenPage.gardens.seasonal.description'),
      volatileMagic: t('gardenPage.gardens.seasonal.volatileMagic'),
      growthTime: t('gardenPage.gardens.seasonal.growthTime'),
      difficulty: t('gardenPage.gardens.seasonal.difficulty'),
      requirements: [
        t('gardenPage.gardens.seasonal.requirements.eventParticipation'),
        t('gardenPage.gardens.seasonal.requirements.specialTools'),
        t('gardenPage.gardens.seasonal.requirements.correctTiming')
      ],
      tips: [
        t('gardenPage.gardens.seasonal.tips.markCalendar'),
        t('gardenPage.gardens.seasonal.tips.prepareResources'),
        t('gardenPage.gardens.seasonal.tips.participateFromStart')
      ],
      icon: <Calendar className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const plantTypes = [
    {
      name: t('gardenPage.plants.magicCrystals.name'),
      volatileMagic: t('gardenPage.plants.magicCrystals.volatileMagic'),
      growthTime: t('gardenPage.plants.magicCrystals.growthTime'),
      rarity: t('gardenPage.plants.magicCrystals.rarity'),
      color: 'text-green-400',
      icon: <Flower2 className="w-6 h-6" />
    },
    {
      name: t('gardenPage.plants.volatilityFlowers.name'),
      volatileMagic: t('gardenPage.plants.volatilityFlowers.volatileMagic'),
      growthTime: t('gardenPage.plants.volatilityFlowers.growthTime'),
      rarity: t('gardenPage.plants.volatilityFlowers.rarity'),
      color: 'text-blue-400',
      icon: <Flower2 className="w-6 h-6" />
    },
    {
      name: t('gardenPage.plants.energyTrees.name'),
      volatileMagic: t('gardenPage.plants.energyTrees.volatileMagic'),
      growthTime: t('gardenPage.plants.energyTrees.growthTime'),
      rarity: t('gardenPage.plants.energyTrees.rarity'),
      color: 'text-purple-400',
      icon: <TreePine className="w-6 h-6" />
    },
    {
      name: t('gardenPage.plants.legendaryPlants.name'),
      volatileMagic: t('gardenPage.plants.legendaryPlants.volatileMagic'),
      growthTime: t('gardenPage.plants.legendaryPlants.growthTime'),
      rarity: t('gardenPage.plants.legendaryPlants.rarity'),
      color: 'text-orange-400',
      icon: <Star className="w-6 h-6" />
    }
  ];


  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header Principal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Link href="/trophy#volatile-magic" className="mr-4 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Image 
                  src="/images/expansions/volatile-magic.png" 
                  alt={t('gardenPage.images.volatileMagic')} 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌱 {t('gardenPage.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('gardenPage.subtitle')}
            </p>
          </motion.div>

          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Navegación Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <BookOpen className="w-5 h-5 text-emerald-400 mr-2" />
                  <h3 className="text-white font-bold text-lg">{t('gardenPage.sidebar.title')}</h3>
                </div>
                <nav className="space-y-1">
                  <button
                    onClick={() => handleScrollTo('introduction')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'introduction'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.introduction')}</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo('gardenTypes')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'gardenTypes'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.gardenTypes')}</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo('plants')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'plants'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.plants')}</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo('waypoints')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'waypoints'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.waypoints')}</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo('locations')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'locations'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.locations')}</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo('rewards')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === 'rewards'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{t('gardenPage.sidebar.rewards')}</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Contenido Principal */}
            <main className="lg:col-span-3">
              
              {/* Sección de Introducción */}
              <section id="introduction" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Info className="w-8 h-8 text-emerald-400 mr-3" />
                    {t('gardenPage.sections.introduction.title')}
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {t('gardenPage.sections.introduction.content1')}
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {t('gardenPage.sections.introduction.content2')}
                  </p>
                  <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center">
                      <Target className="w-6 h-6 mr-2" />
                      {t('gardenPage.sections.introduction.objective')}
                    </h3>
                    <p className="text-gray-300">
                      {t('gardenPage.sections.introduction.objectiveContent')}
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Sección de Herramientas de Recolección */}
              <section id="gardenTypes" className="mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Hammer className="w-8 h-8 text-emerald-400 mr-3" />
                    {t('gardenPage.sections.gardenTypes.title')}
                  </h2>
                  
                  <p className="text-gray-300 mb-8 text-lg">
                    {t('gardenPage.sections.gardenTypes.description')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Plantas */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src="https://wiki.guildwars2.com/images/2/2d/Plant_resource_%28map_icon%29.png"
                            alt="Plant resource icon"
                            width={50}
                            height={50}
                            className="w-12 h-12"
                            unoptimized
                          />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('gardenPage.sections.gardenTypes.plants')}</h3>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 space-y-3">
                        {/* Hoz del Consorcio */}
                        <div className="flex items-center gap-3">
          {consortiumSickleData?.icon && (
            <Image
              src={consortiumSickleData.icon}
              alt={consortiumSickleData.name}
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized
            />
          )}
                          <span className="text-emerald-300 font-medium text-sm">
                            {consortiumSickleData?.name || t('gardenPage.sections.gardenTypes.consortiumSickle')}
                          </span>
                        </div>
                        
                        {/* Herramienta Alternativa */}
                        <div className="flex items-center gap-3">
          {alternativeSickleData?.icon && (
            <Image
              src={alternativeSickleData.icon}
              alt={alternativeSickleData.name}
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized
            />
          )}
                          <span className="text-emerald-300 font-medium text-sm">
                            {alternativeSickleData?.name || 'Herramienta Alternativa'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mineral */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src="https://wiki.guildwars2.com/images/3/34/Mine_resource_%28map_icon%29.png"
                            alt="Mine resource icon"
                            width={50}
                            height={50}
                            className="w-12 h-12"
                            unoptimized
                          />
                    </div>
                        <h3 className="text-xl font-bold text-white">{t('gardenPage.sections.gardenTypes.mineral')}</h3>
                  </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex items-center gap-3">
          {unboundMiningData?.icon && (
            <Image
              src={unboundMiningData.icon}
              alt={unboundMiningData.name}
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized
            />
          )}
                          <span className="text-emerald-300 font-medium text-sm">
                            {unboundMiningData?.name || t('gardenPage.sections.gardenTypes.unboundMining')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Madera */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src="https://wiki.guildwars2.com/images/f/f1/Wood_resource_%28map_icon%29.png"
                            alt="Wood resource icon"
                            width={50}
                            height={50}
                            className="w-12 h-12"
                            unoptimized
                          />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('gardenPage.sections.gardenTypes.wood')}</h3>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex items-center gap-3">
          {unboundLoggingData?.icon && (
            <Image
              src={unboundLoggingData.icon}
              alt={unboundLoggingData.name}
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized
            />
          )}
                          <span className="text-emerald-300 font-medium text-sm">
                            {unboundLoggingData?.name || t('gardenPage.sections.gardenTypes.unboundLogging')}
                          </span>
                        </div>
                      </div>
                    </div>
            </div>
          </motion.div>
              </section>

              {/* Información adicional sobre glifos */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-lg mb-16 -mt-8"
              >
                {t('gardenPage.sections.glyphs.info')}
              </motion.p>

              {/* Sección de Buffs */}
              <section id="plants" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Zap className="w-8 h-8 text-emerald-400 mr-3" />
                    {t('gardenPage.sections.buffs.title')}
            </h2>
                  
                  <div className="space-y-6">
                    {/* Item Booster */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {itemBoosterData?.icon && (
                          <Image
                            src={itemBoosterData.icon}
                            alt={itemBoosterData.name}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            unoptimized
                          />
                        )}
                        <h3 className="text-xl font-bold text-white">
                          {itemBoosterData?.name || t('gardenPage.sections.buffs.itemBooster.title')}
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-2">{t('gardenPage.sections.buffs.itemBooster.description')}</p>
                      <p className="text-gray-400 text-sm italic whitespace-pre-line">{t('gardenPage.sections.buffs.itemBooster.note')}</p>
                    </div>

                    {/* Guild Gathering Banner Booster */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {guildBannerData?.icon && (
                          <Image
                            src={guildBannerData.icon}
                            alt={guildBannerData.name}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            unoptimized
                          />
                        )}
                        <h3 className="text-xl font-bold text-white">
                          {guildBannerData?.name || t('gardenPage.sections.buffs.guildBanner.title')}
                        </h3>
                      </div>
                    </div>

                    {/* XP Booster / Candy Gobbler */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {xpBoosterData?.icon && (
                            <Image
                              src={xpBoosterData.icon}
                              alt={xpBoosterData.name}
                              width={32}
                              height={32}
                              className="w-8 h-8"
                              unoptimized
                            />
                          )}
                          <span className="text-xl font-bold text-white">
                            {xpBoosterData?.name || 'XP Booster'}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xl">/</span>
                        <div className="flex items-center gap-2">
                          {candyGobblerData?.icon && (
                            <Image
                              src={candyGobblerData.icon}
                              alt={candyGobblerData.name}
                              width={32}
                              height={32}
                              className="w-8 h-8"
                              unoptimized
                            />
                          )}
                          <span className="text-xl font-bold text-white">
                            {candyGobblerData?.name || 'Candy Gobbler'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Experience Note */}
                    <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                      <p className="text-gray-300 text-lg">{t('gardenPage.sections.buffs.experienceNote')}</p>
                </div>
            </div>
          </motion.div>
              </section>


              {/* Sección de Waypoints */}
              <section id="waypoints" className="mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Image 
                      src="https://wiki.guildwars2.com/images/d/d2/Waypoint_%28map_icon%29.png" 
                      alt="Waypoint icon" 
                      width={32} 
                      height={32} 
                      className="w-8 h-8 mr-3"
                      unoptimized
                    />
                    {t('gardenPage.sections.waypoints.title')}
                  </h2>
                  
                  <p className="text-gray-300 mb-8 text-lg">
                    {t('gardenPage.sections.waypoints.description')}
                  </p>
                  
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {t('gardenPage.sections.waypoints.title')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Primera Lista */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-emerald-300 font-semibold text-sm">
                              {t('gardenPage.sections.waypoints.chat1')}
                            </span>
                          </div>
                          <button
                            onClick={copyList1}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {list1Copied ? t('gardenPage.sections.waypoints.listCopied') : t('gardenPage.sections.waypoints.copyList')}
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="text-gray-300 text-lg font-mono break-all leading-relaxed">
                          [&BE8BAAA=][&BAACAAA=][&BOwBAAA=][&BMcDAAA=][&BN4AAAA=][&BB0CAAA=][&BHgCAAA=][&BMAAAAA=][&BOYAAAA=][&BF8CAAA=][&BFECAAA=][&BNECAAA=][&BFgGAAA=][&BMkBAAA=][&BKcBAAA=]
                        </div>
                      </div>
                    </div>
                    
                    {/* Segunda Lista */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-blue-300 font-semibold text-sm">
                              {t('gardenPage.sections.waypoints.chat2')}
                            </span>
                          </div>
                          <button
                            onClick={copyList2}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {list2Copied ? t('gardenPage.sections.waypoints.listCopied') : t('gardenPage.sections.waypoints.copyList')}
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="text-gray-300 text-lg font-mono break-all leading-relaxed">
                          [&BOQAAAA=][&BKsAAAA=][&BPoAAAA=][&BBIAAAA=][&BEIAAAA=][&BEABAAA=][&BFwAAAA=][&BIYHAAA=][&BKYCAAA=][&BOAHAAA=][&BA4IAAA=][&BFcLAAA=][&BF8JAAA=][&BM0JAAA=][&BH0JAAA=]
                        </div>
                      </div>
                    </div>
                    
                    {/* Tercera Lista */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-purple-300 font-semibold text-sm">
                              {t('gardenPage.sections.waypoints.chat3')}
                            </span>
                          </div>
                          <button
                            onClick={copyList3}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {list3Copied ? t('gardenPage.sections.waypoints.listCopied') : t('gardenPage.sections.waypoints.copyList')}
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="text-gray-300 text-lg font-mono break-all leading-relaxed">
                          [&BNwKAAA=][&BCgKAAA=]<span className="text-yellow-400 font-bold">x2</span>[&BJEKAAA=][&BEAKAAA=][&BEMLAAA=][&BBsMAAA=][&BCcMAAA=][&BGQMAAA=]<span className="text-red-400 font-bold">x3</span>[&BBkNAAA=]<span className="text-yellow-400 font-bold">x2</span>[&BCANAAA=][&BNQMAAA=][&BFUOAAA=][&BNwNAAA=][&BK4OAAA=]<span className="text-yellow-400 font-bold">x2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Sección de Ubicaciones de Jardines - Updated */}
              <section id="locations" className="mt-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 max-w-6xl mx-auto"
                >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <MapPin className="w-8 h-8 text-emerald-400 mr-3" />
                    {t('gardenPage.sections.locations.title')}
                  </h2>
                  
                  <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-6 mb-8">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {t('gardenPage.sections.locations.description')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Fields of Ruin */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="space-y-4">
                          <Image
                            src="/images/garden/EoD-1-709x1024.webp"
                            alt="Fields of Ruin Garden Location"
                            width={564}
                            height={1024}
                            className="w-full h-64 object-contain rounded-lg bg-slate-700/50"
                            unoptimized
                          />
                        
                        {/* 1. Nombre del mapa */}
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          {mapData[21]?.name || 'Fields of Ruin'}
                        </h3>
                        
                        {/* 2. Nombre del punto de ruta */}
                        <div className="mb-3">
                          <p className="text-emerald-300 font-semibold flex items-center gap-2">
                            <Image 
                              src="/images/icons/waypoint-icon.png" 
                              alt="Waypoint" 
                              width={16} 
                              height={16} 
                              className="w-7 h-7"
                            />
                            {t('gardenPage.waypoints.ogreRoad')}
                          </p>
                        </div>
                        
                        {/* 3. Qué da el garden */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-300 font-medium">{t('gardenPage.sections.locations.rewards')}:</span>
                          </div>
                          <p className="text-blue-300 font-semibold">8 uvas disponibles</p>
                        </div>
                        
                        {/* 4. Botón para copiar waypoint */}
                        <div>
                          <button
                            onClick={() => copyWaypoint('[&BE8BAAA=]')}
                            className={`w-full font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm ${
                              copiedWaypoint === '[&BE8BAAA=]' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {copiedWaypoint === '[&BE8BAAA=]' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                            {copiedWaypoint === '[&BE8BAAA=]' 
                              ? t('gardenPage.sections.locations.waypointCopied')
                              : t('gardenPage.sections.locations.copyWaypoint')
                            }
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Kessex Hills */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="space-y-4">
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <Image
                            src="/images/garden/EoD-2.webp"
                            alt="Kessex Hills Garden Location"
                            width={400}
                            height={200}
                            className="w-full h-64 object-contain rounded-lg mb-4 bg-slate-700/50"
                            unoptimized
                          />
                          
                          {/* 1. Nombre del mapa */}
                          <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                              <MapPin className="w-4 h-4 text-white" />
                            </div>
                            {mapData[22]?.name || 'Kessex Hills'}
                          </h3>
                          
                          {/* 2. Nombre del punto de ruta */}
                          <div className="mb-3">
                            <p className="text-emerald-300 font-semibold flex items-center gap-2">
                              <Image 
                                src="/images/icons/waypoint-icon.png" 
                                alt="Waypoint" 
                                width={16} 
                                height={16} 
                                className="w-4 h-4"
                              />
                              {t('gardenPage.waypoints.guardianStone')}
                            </p>
                          </div>
                          
                          {/* 3. Qué da el garden */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-gray-300 font-medium">Recompensas:</span>
                            </div>
                            <p className="text-blue-300 font-semibold">6 uvas disponibles</p>
                          </div>
                          
                          {/* 4. Botón para copiar waypoint */}
                          <div>
                            <button
                              onClick={() => copyWaypoint('[&BAACAAA=]')}
                              className={`w-full font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm ${
                                copiedWaypoint === '[&BAACAAA=]' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {copiedWaypoint === '[&BAACAAA=]' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              {copiedWaypoint === '[&BAACAAA=]' 
                                ? t('gardenPage.sections.locations.waypointCopied')
                                : t('gardenPage.sections.locations.copyWaypoint')
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </section>


              {/* Sección de Recompensas */}
              <section id="rewards" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl p-8 border border-emerald-500/30"
          >
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Coins className="w-8 h-8 text-emerald-400 mr-3" />
                    {t('gardenPage.sections.rewards.title')}
            </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 text-center">
                      <h3 className="text-white font-semibold mb-3">{t('gardenPage.sections.rewards.personalGarden')}</h3>
                      <p className="text-2xl font-bold text-emerald-400 mb-2">{t('gardenPage.sections.rewards.time')}</p>
              </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 text-center">
                      <h3 className="text-white font-semibold mb-3">{t('gardenPage.sections.rewards.guildGardens')}</h3>
                      <div className="flex items-center justify-center mb-2">
                        <Image
                          src="/images/expansions/volatile-magic.png"
                          alt="Volatile Magic"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <p className="text-2xl font-bold text-green-400">{t('gardenPage.sections.rewards.volatileMagic')}</p>
                      </div>
                      <p className="text-yellow-400 text-sm font-semibold">{t('gardenPage.sections.rewards.profit')}</p>
              </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 text-center">
                      <h3 className="text-white font-semibold mb-3">{t('gardenPage.sections.rewards.worldGardens')}</h3>
                      <div className="flex items-center justify-center mb-2">
                        <Image
                          src="/images/expansions/Spirit_Shard.png"
                          alt="Spirit Shards"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <p className="text-2xl font-bold text-teal-400">{t('gardenPage.sections.rewards.spiritShards')}</p>
                      </div>
                      <p className="text-yellow-400 text-sm font-semibold">{t('gardenPage.sections.rewards.spiritShardsProfit')}</p>
              </div>
            </div>
          </motion.div>
              </section>

            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default JardinesPage;
