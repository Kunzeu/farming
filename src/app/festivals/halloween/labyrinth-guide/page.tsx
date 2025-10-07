'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { 
  ArrowLeft,
  Info,
  Sword,
  Shield,
  Zap,
  Heart,
  Coins,
  Clock,
  Map,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  Package,
  Gift,
  List
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

const LabyrinthGuidePage = () => {
  usePageTitle('pageTitles.halloweenLabyrinth', 'Guía del Laberinto de Halloween');
  const { t, lang } = useI18n();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const [itemData, setItemData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [skillData, setSkillData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [vitalityData, setVitalityData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [fireData, setFireData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [baluarteData, setBaluarteData] = useState<{name: string, icon: string} | null>(null);
  const [funcionalData, setFuncionalData] = useState<{name: string, icon: string} | null>(null);
  const [medicoData, setMedicoData] = useState<{name: string, icon: string} | null>(null);
  const [furtivoData, setFurtivoData] = useState<{name: string, icon: string} | null>(null);
  const [vampirismoData, setVampirismoData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [velocidadData, setVelocidadData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [tercerTomoData, setTercerTomoData] = useState<{name: string, icon: string} | null>(null);
  const [primerTomoData, setPrimerTomoData] = useState<{name: string, icon: string} | null>(null);

  const sections = [
    { id: 'overview', label: 'Introducción', icon: Info },
    { id: 'builds', label: 'Builds Recomendadas', icon: Sword },
    { id: 'routes', label: 'Rutas de Farmeo', icon: Map },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'tips', label: 'Consejos Avanzados', icon: Star }
  ];

  // Función para construir URL de wiki
  const buildWikiUrl = (itemName: string, itemType: 'item' | 'skill') => {
    const formattedName = itemName.replace(/ /g, '_');
    
    if (lang === 'es') {
      // Para español usamos la wiki en inglés
      return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_the_Zephyrite`;
    } else if (lang === 'fr') {
      return `https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_des_Z%C3%A9phyrites`;
    } else if (lang === 'de') {
      return `https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_der_Zephyriten`;
    } else {
      return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_the_Zephyrite`;
    }
  };

  // Función para construir URL de wiki de sellos
  const buildSigilWikiUrl = (itemType: 'vitality' | 'fire' | 'vampirismo' | 'velocidad'): string => {
    if (itemType === 'vitality') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Cachet_d%27endurance_sup%C3%A9rieur`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegenes_Sigill_der_Ausdauer`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina`;
      }
    } else if (itemType === 'fire') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Fire`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Cachet_de_feu_sup%C3%A9rieur`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegenes_Sigill_des_Feuers`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Fire`;
      }
    } else if (itemType === 'vampirismo') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_de_vampirisme`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_des_Vampirismus`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism`;
      }
    } else if (itemType === 'velocidad') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_Speed`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_de_vitesse`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_der_Geschwindigkeit`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Superior_Rune_of_Speed`;
      }
    }
    // Fallback por defecto
    return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina`;
  };

  // Función para obtener datos del item
  const fetchItemData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/88118?lang=${lang}`);
      const data = await response.json();
      setItemData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildWikiUrl(data.name, 'item')
      });
    } catch (error) {
      // Error fetching item data
    }
  };

  // Función para obtener datos de la skill
  const fetchSkillData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/5973?lang=${lang}`);
      const data = await response.json();
      setSkillData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildWikiUrl(data.name, 'skill')
      });
    } catch (error) {
      // Error fetching skill data
    }
  };

  // Función para obtener datos de vitalidad
  const fetchVitalityData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24592?lang=${lang}`);
      const data = await response.json();
      setVitalityData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('vitality')
      });
    } catch (error) {
      // Error fetching vitality data
    }
  };

  // Función para obtener datos de fuego
  const fetchFireData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24548?lang=${lang}`);
      const data = await response.json();
      setFireData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('fire')
      });
    } catch (error) {
      // Error fetching fire data
    }
  };

  // Función para obtener datos de Giro baluarte
  const fetchBaluarteData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/30101?lang=${lang}`);
      const data = await response.json();
      setBaluarteData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching baluarte data
    }
  };

  // Función para obtener datos de Giro funcional
  const fetchFuncionalData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/56920?lang=${lang}`);
      const data = await response.json();
      setFuncionalData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching funcional data
    }
  };

  // Función para obtener datos de Giro medico
  const fetchMedicoData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/30357?lang=${lang}`);
      const data = await response.json();
      setMedicoData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching medico data
    }
  };

  // Función para obtener datos de Giro furtivo
  const fetchFurtivoData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/30815?lang=${lang}`);
      const data = await response.json();
      setFurtivoData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching furtivo data
    }
  };

  // Función para obtener datos de Runa de Vampirismo
  const fetchVampirismoData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24711?lang=${lang}`);
      const data = await response.json();
      setVampirismoData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('vampirismo')
      });
    } catch (error) {
      // Error fetching vampirismo data
    }
  };

  // Función para obtener datos de Runa de Velocidad
  const fetchVelocidadData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24720?lang=${lang}`);
      const data = await response.json();
      setVelocidadData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('velocidad')
      });
    } catch (error) {
      // Error fetching velocidad data
    }
  };

  // Función para obtener datos del tercer tomo
  const fetchTercerTomoData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/42259?lang=${lang}`);
      const data = await response.json();
      setTercerTomoData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching tercer tomo data
    }
  };

  // Función para obtener datos del primer tomo
  const fetchPrimerTomoData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/44364?lang=${lang}`);
      const data = await response.json();
      setPrimerTomoData({
        name: data.name,
        icon: data.icon
      });
    } catch (error) {
      // Error fetching primer tomo data
    }
  };


  useEffect(() => {
    fetchItemData();
    fetchSkillData();
    fetchVitalityData();
    fetchFireData();
    fetchBaluarteData();
    fetchFuncionalData();
    fetchMedicoData();
    fetchFurtivoData();
    fetchVampirismoData();
    fetchVelocidadData();
    fetchTercerTomoData();
    fetchPrimerTomoData();
  }, [lang]);

  return (
    <>
      <Navigation />
      <div 
        className="min-h-screen relative"
        style={{
          backgroundImage: 'url(/images/backgrounds/Halloween.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Contenido principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8">
            {/* Botón Volver */}
            <div className="flex justify-start mb-4">
              <a
                href="/festivals/halloween"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/90 border border-orange-500/30 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <ArrowLeft className="w-4 h-4" />
                Volver a Halloween
              </a>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">🎃</span>
              ¿CÓMO FARMEAR EL LABERINTO DE HALLOWEEN?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              ¿Estás con ganas de gastar tu vida durante 3 semanas dentro de un laberinto maldiciendo a los dioses por que un tal Steve te persigue? Pues estás en el sitio correcto.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedSection === section.id
                    ? 'bg-orange-600/80 text-white border border-orange-400/50 shadow-lg'
                    : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/90 border border-orange-500/20 hover:border-orange-500/40'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Overview Section */}
            {selectedSection === 'overview' && (
              <div className="space-y-8">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Info className="w-6 h-6 mr-3 text-orange-400" />
                    Introducción al Laberinto
                  </h2>
                  
                  <div className="prose prose-invert max-w-none">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                     En este post os hablaremos de cómo farmear Halloween, si quieres saber qué builds equiparte te recomiendo este post donde están las <button 
                       onClick={() => setSelectedSection('builds')}
                       className="text-orange-400 hover:text-orange-300 underline font-semibold transition-colors duration-200"
                     >
                       5 mejores builds
                     </button>, para ver cómo prepararnos para sacar el mayor beneficio de Halloween.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-orange-400" />
                          ¿Qué es el Laberinto?
                        </h3>
                        <p className="text-gray-300 text-sm">
                          El Laberinto de Halloween es una instancia especial donde puedes farmear miles de Trick-or-Treat Bags y otros materiales valiosos. Es la actividad más rentable durante el festival.
                        </p>
                      </div>
                      
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                          Oro por Hora
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Con una buena build y grupo, puedes obtener entre 15-25 oro por hora, dependiendo de tu eficiencia y la suerte con los drops.
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                      <h3 className="text-red-300 font-semibold mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        ¡Atención!
                      </h3>
                      <p className="text-gray-300 text-sm">
                        El Laberinto puede ser adictivo. Muchos jugadores han perdido semanas de su vida aquí. ¡Úsalo con moderación!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

             {/* Builds Section */}
             {selectedSection === 'builds' && (
               <div className="space-y-8">
                 <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                     <Sword className="w-6 h-6 mr-3 text-orange-400" />
                     Builds Recomendadas
                   </h2>
                   
                   <div className="prose prose-invert max-w-none mb-8">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                       En esta guía os pondré las mejores 5 builds para farmear el Laberinto de Halloween. También vale para los farmeos de tagging en general. 
                       Si la clase que queréis usar no está aquí no os preocupéis por que días después de salir este artículo, tendréis otro con una build distinta de cada clase. 
                       Comprueba si ya lo subí aquí.
                     </p>
                   </div>

                   {/* Puntos comunes importantes */}
                   <div className="space-y-6 mb-8">
                     <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                       <h3 className="text-red-300 font-semibold mb-3 flex items-center">
                         <AlertTriangle className="w-5 h-5 mr-2" />
                         ⚠️ PUNTOS COMUNES IMPORTANTES
                       </h3>
                       
                       <div className="space-y-4">
                         <div className="bg-red-800/20 border border-red-400/30 rounded-lg p-3">
                           <h4 className="text-red-200 font-semibold mb-2 flex items-center">
                             <span className="text-lg mr-2">🚫</span>
                             NUNCA usar accesorios, anillos y espaldar
                           </h4>
                           <p className="text-gray-300 text-sm">
                             <strong>NUNCA</strong> jugamos con accesorios, anillos y espaldar para así no hacer demasiado daño y joder al resto de jugadores porque matemos muy rápido a los enemigos. 
                             Dará igual que vayamos ascendidos o exóticos.
                           </p>
                         </div>

                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">Comidas y mejoras</h4>
                             <p className="text-gray-300 text-sm">
                               Las comidas y mejoras para aumentar nuestro farming estarán en otro post sobre cómo farmear el laberinto. 
                               Así que estad atentos a los posts del apartado de cómo hacer oro.
                             </p>
                           </div>
                         </div>

                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">Estadísticas alternativas</h4>
                             <p className="text-gray-300 text-sm">
                               Todas estas builds pueden cambiar sus estadísticas por otra que sea similar y con vitalidad para ir más cómodo. 
                               En el caso de las builds con Berserker podríamos ir Asaltante o Dragón.
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-6">
                     {/* Contenido */}
                     <div className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-4">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <List className="w-5 h-5 mr-2 text-orange-400" />
                         Contenido
                       </h3>
                       <div className="space-y-3">
                         <button 
                           onClick={() => {
                             setSelectedSection('builds');
                             setTimeout(() => {
                               const element = document.getElementById('chatarrero-supervelocidad');
                               if (element) {
                                 const elementPosition = element.offsetTop;
                                 const offsetPosition = elementPosition - 100; // 100px de offset
                                 window.scrollTo({
                                   top: offsetPosition,
                                   behavior: 'smooth'
                                 });
                               }
                             }, 100);
                           }}
                           className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 w-full text-left"
                         >
                           <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                           <span className="text-gray-200 font-medium">Chatarrero Supervelocidad</span>
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedSection('builds');
                             setTimeout(() => {
                               const element = document.getElementById('abrasador-justicia');
                               if (element) {
                                 const elementPosition = element.offsetTop;
                                 const offsetPosition = elementPosition - 100; // 100px de offset
                                 window.scrollTo({
                                   top: offsetPosition,
                                   behavior: 'smooth'
                                 });
                               }
                             }, 100);
                           }}
                           className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 w-full text-left"
                         >
                           <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                           <span className="text-gray-200 font-medium">Abrasador Justicia</span>
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedSection('builds');
                             setTimeout(() => {
                               const element = document.getElementById('mirage-spammer');
                               if (element) {
                                 const elementPosition = element.offsetTop;
                                 const offsetPosition = elementPosition - 100; // 100px de offset
                                 window.scrollTo({
                                   top: offsetPosition,
                                   behavior: 'smooth'
                                 });
                               }
                             }, 100);
                           }}
                           className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 w-full text-left"
                         >
                           <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                           <span className="text-gray-200 font-medium">Mirage Spammer</span>
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedSection('builds');
                             setTimeout(() => {
                               const element = document.getElementById('temerario-poder');
                               if (element) {
                                 const elementPosition = element.offsetTop;
                                 const offsetPosition = elementPosition - 100; // 100px de offset
                                 window.scrollTo({
                                   top: offsetPosition,
                                   behavior: 'smooth'
                                 });
                               }
                             }, 100);
                           }}
                           className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 w-full text-left"
                         >
                           <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                           <span className="text-gray-200 font-medium">Temerario Poder</span>
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedSection('builds');
                             setTimeout(() => {
                               const element = document.getElementById('temerario-condicion');
                               if (element) {
                                 const elementPosition = element.offsetTop;
                                 const offsetPosition = elementPosition - 100; // 100px de offset
                                 window.scrollTo({
                                   top: offsetPosition,
                                   behavior: 'smooth'
                                 });
                               }
                             }, 100);
                           }}
                           className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 w-full text-left"
                         >
                           <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                           <span className="text-gray-200 font-medium">Temerario Condición</span>
                         </button>
                       </div>
                     </div>

                     {/* Build detallada: Chatarrero Supervelocidad */}
                     <div id="chatarrero-supervelocidad" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Image
                           src="https://wiki-es.guildwars2.com/images/9/95/Chatarrero_icono_%28highres%29.png"
                           alt="Chatarrero"
                           width={64}
                           height={64}
                           className="mr-2 rounded"
                           onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                         />
                         Chatarrero Supervelocidad
                       </h3>
                       
                       <div className="prose prose-invert max-w-none">
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           Para empezar tenemos una build muy buena de ingeniero y sería la TOP 5 de este artículo. Esta mantiene {skillData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={skillData.icon}
                                 alt={skillData.name}
                                 width={16}
                                 height={16}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{skillData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">supervelocidad</span>
                           )} permanente y diferentes saltos que nos permitirán llevar una velocidad increíble para poder hacer el laberinto lo antes posible. También lleva diversas habilidades de daño en área incluyendo su daño principal.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           Además de todo esto tendremos algo de soporte para nuestros aliados con curas, antiproyectiles y barreras.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           En cuanto a nuestro equipamiento lo llevaremos completamente Berserker con {itemData ? (
                             <a 
                               href={itemData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={itemData.icon}
                                 alt={itemData.name}
                                 width={18}
                                 height={18}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{itemData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Rune_of_the_Zephyrite' : `https://wiki-${lang}.guildwars2.com/wiki/Superior_Rune_of_the_Zephyrite`}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               Superior Rune of the Zephyrite
                             </a>
                           )} si queremos más {skillData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={skillData.icon}
                                 alt={skillData.name}
                                 width={18}
                                 height={18}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{skillData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">supervelocidad</span>
                           )} o {vampirismoData ? (
                             <a 
                               href={vampirismoData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vampirismoData.icon}
                                 alt={vampirismoData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{vampirismoData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism' : 
                                   lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_de_vampirisme' :
                                   lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_des_Vampirismus' :
                                   'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               Runa de Vampirismo
                             </a>
                           )} si queremos más supervivencia. En cuanto a armas llevaremos un rifle que solo usaremos contra jefes y llevará sellos de {vitalityData ? (
                             <a 
                               href={vitalityData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={16}
                                 height={16}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{vitalityData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina' : 
                                   lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Cachet_d%27endurance_sup%C3%A9rieur' :
                                   lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegenes_Sigill_der_Ausdauer' :
                                   'https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               vitalidad
                             </a>
                           )} y {fireData ? (
                             <a 
                               href={fireData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={fireData.icon}
                                 alt={fireData.name}
                                 width={16}
                                 height={16}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{fireData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Fire' : 
                                   lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Cachet_de_feu_sup%C3%A9rieur' :
                                   lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegenes_Sigill_des_Feuers' :
                                   'https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Fire'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               fuego
                             </a>
                           )}.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           En cuanto a sus habilidades llevaremos 3 Giros que nos darán {skillData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={skillData.icon}
                                 alt={skillData.name}
                                 width={18}
                                 height={18}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{skillData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">supervelocidad</span>
                           )} y supervivencia además del quinto F del cinturón de herramientas que nos dará otro golpe de {skillData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={skillData.icon}
                                 alt={skillData.name}
                                 width={18}
                                 height={18}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{skillData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">supervelocidad</span>
                           )}. En las otras 2 habilidades llevaremos las botas para movernos más rápidamente y el lanzallamas ya que solo pulsando el 1 iremos haciendo todo el daño que hace falta para lootear a todos los enemigos.
                         </p>
                       </div>
                       
                       {/* Código de traits */}
                       <div className="mt-6">
                         <div className="flex items-center justify-between mb-2">
                           <h4 className="text-white font-semibold flex items-center">
                             <span className="text-lg mr-2">⚙️</span>
                             Código de Traits
                           </h4>
                           <button
                             onClick={() => {
                               navigator.clipboard.writeText('[&DQMmLx0+Ky3ZEgAADhMAAJMBAACNAQAAgxIAAAAAAAAAAAAAAAAAAAAAAAA=]');
                               setShowCopyModal(true);
                               // Auto-cerrar el modal después de 2 segundos
                               setTimeout(() => setShowCopyModal(false), 2000);
                             }}
                             className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                           >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                             </svg>
                             Copiar
                           </button>
                         </div>
                         <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-3">
                           <code className="text-orange-300 text-sm font-mono break-all">
                             [&DQMmLx0+Ky3ZEgAADhMAAJMBAACNAQAAgxIAAAAAAAAAAAAAAAAAAAAAAAA=]
                           </code>
                         </div>
                       </div>

                       {/* Imagen de skills y traits */}
                       <div className="mt-6">
                         <Image
                           src="/thumbnails/skills-y-traits-chat-1024x576.webp"
                           alt="Skills y Traits - Chatarrero Supervelocidad"
                           width={1024}
                           height={576}
                           className="w-full h-auto rounded-lg border border-orange-500/30 shadow-lg"
                           onError={(e) => { 
                             console.error('Error loading image:', e);
                             (e.currentTarget as HTMLImageElement).style.display = 'none'; 
                           }}
                         />
                         
                         {/* Instrucciones de uso */}
                         <div className="mt-4 space-y-3">
                           <p className="text-gray-200 text-sm leading-relaxed">
                             Por último os comentaré un poco la forma de usarlo. Principalmente haremos daño con el 1 de lanzallamas, simplemente dejadlo pulsado y girad la cámara para darle a todo. Mientras tanto iremos usando los giros para hacer más daño en área pero siempre usándolos justo antes de que se acabe la {skillData ? (
                               <span className="inline-flex items-center gap-1">
                                 <Image
                                   src={skillData.icon}
                                   alt={skillData.name}
                                   width={20}
                                   height={20}
                                   className="rounded"
                                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                 />
                                 <span className="text-orange-300 font-semibold">{skillData.name}</span>
                               </span>
                             ) : (
                               <span className="text-orange-300 font-semibold">supervelocidad</span>
                             )} para ganar el máximo de esta.
                           </p>
                           <p className="text-gray-200 text-sm leading-relaxed">
                             Como prioridad usaremos {baluarteData ? (
                               <span className="inline-flex items-center gap-1">
                                 <Image
                                   src={baluarteData.icon}
                                   alt={baluarteData.name}
                                   width={20}
                                   height={20}
                                   className="rounded"
                                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                 />
                                 <span className="text-orange-300 font-semibold">{baluarteData.name}</span>
                               </span>
                             ) : (
                               <span className="text-orange-300 font-semibold">Giro baluarte</span>
                             )}, {funcionalData ? (
                               <span className="inline-flex items-center gap-1">
                                 <Image
                                   src={funcionalData.icon}
                                   alt={funcionalData.name}
                                   width={20}
                                   height={20}
                                   className="rounded"
                                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                 />
                                 <span className="text-orange-300 font-semibold">{funcionalData.name}</span>
                               </span>
                             ) : (
                               <span className="text-orange-300 font-semibold">Giro funcional</span>
                             )}, {medicoData ? (
                               <span className="inline-flex items-center gap-1">
                                 <Image
                                   src={medicoData.icon}
                                   alt={medicoData.name}
                                   width={20}
                                   height={20}
                                   className="rounded"
                                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                 />
                                 <span className="text-orange-300 font-semibold">{medicoData.name}</span>
                               </span>
                             ) : (
                               <span className="text-orange-300 font-semibold">Giro medico</span>
                             )} y {furtivoData ? (
                               <span className="inline-flex items-center gap-1">
                                 <Image
                                   src={furtivoData.icon}
                                   alt={furtivoData.name}
                                   width={20}
                                   height={20}
                                   className="rounded"
                                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                 />
                                 <span className="text-orange-300 font-semibold">{furtivoData.name}</span>
                               </span>
                             ) : (
                               <span className="text-orange-300 font-semibold">Giro furtivo</span>
                             )}.
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Build detallada: Abrasador Justicia */}
                     <div id="abrasador-justicia" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">                    
                         <h3 className="text-white font-semibold mb-4 flex items-center">
                           <Image
                             src="https://wiki.guildwars2.com/images/0/0b/Firebrand_icon_%28highres%29.png"
                             alt="Firebrand"
                             width={64}
                             height={64}
                             className="mr-2 rounded"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                           />
                           Abrasador Justicia
                         </h3>
                       
                       <div className="prose prose-invert max-w-none">
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           Esta build de guardián nos proporcionará un ataque en área constante, celeridad permanente y un buen daño mantenido en las puertas. Se encontraría en el TOP 4 de esta lista.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           En el equipamiento lo llevaríamos completamente Berserker con {vampirismoData ? (
                             <a 
                               href={vampirismoData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vampirismoData.icon}
                                 alt={vampirismoData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{vampirismoData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism' : 
                                   lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_de_vampirisme' :
                                   lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_des_Vampirismus' :
                                   'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Vampirism'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               Runa de Vampirismo
                             </a>
                           )} o {velocidadData ? (
                             <a 
                               href={velocidadData.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={velocidadData.icon}
                                 alt={velocidadData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{velocidadData.name}</span>
                             </a>
                           ) : (
                             <a 
                               href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Speed' : 
                                   lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Rune_sup%C3%A9rieure_de_vitesse' :
                                   lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/%C3%9Cberlegene_Rune_der_Geschwindigkeit' :
                                   'https://wiki.guildwars2.com/wiki/Superior_Rune_of_Speed'}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                             >
                               Runa de Velocidad
                             </a>
                           )}. En las armas nos pondríamos mandoble para hacer unos daños insanos a los jefes y para ayudarnos en nuestra movilidad. En el segundo set podemos llevar Cetro-Foco para hacer daño a media distancia y áreas para las puertas. En cuanto a los sellos se llevarían los estándar para este tipo de farmeos, es decir, {vitalityData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{vitalityData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">Vitalidad</span>
                           )} y {fireData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={fireData.icon}
                                 alt={fireData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{fireData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">Fuego</span>
                           )}.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           Nuestras habilidades nos proporcionan un daño en área bastante bueno para el uso en las puertas, bufos varios como rapidez, égida y celeridad y habilidades de movilidad.
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           Lo más importante serían los tomos del abrasador ya que tendríamos todo nuestro daño en el primero de estos y nuestra movilidad dependerá en su mayoría de {tercerTomoData && tercerTomoData.icon ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={tercerTomoData.icon}
                                 alt={tercerTomoData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{tercerTomoData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">tercer tomo</span>
                           )}.
                         </p>
                         
                         {/* Código de traits */}
                         <div className="mt-6">
                           <div className="flex items-center justify-between mb-2">
                             <h4 className="text-white font-semibold flex items-center">
                               <span className="text-lg mr-2">⚙️</span>
                               Código de Traits
                             </h4>
                             <button
                               onClick={() => {
                                 navigator.clipboard.writeText('[&DQEQGS4XPitLFwAALQEAAEcBAABMAQAAiRIAAAAAAAAAAAAAAAAAAAAAAAA=]');
                                 setShowCopyModal(true);
                                 // Auto-cerrar el modal después de 2 segundos
                                 setTimeout(() => setShowCopyModal(false), 2000);
                               }}
                               className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                             >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                               </svg>
                               Copiar
                             </button>
                           </div>
                           <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-3">
                             <code className="text-orange-300 text-sm font-mono break-all">
                               [&DQEQGS4XPitLFwAALQEAAEcBAABMAQAAiRIAAAAAAAAAAAAAAAAAAAAAAAA=]
                             </code>
                           </div>
                         </div>
                         
                         {/* Imagen de skills y traits */}
                         <div className="mt-6">
                           <Image
                             src="/thumbnails/skills-y-traits-fb-1024x576.webp"
                             alt="Skills y Traits del Abrasador Justicia"
                             width={1024}
                             height={576}
                             className="w-full h-auto rounded-lg border border-orange-500/30"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                           />
                         </div>
                         
                         {/* Instrucciones de uso detalladas */}
                         <div className="mt-6">
                           <div className="space-y-4">
                               <p className="text-gray-200 text-sm leading-relaxed">
                                 Su trait más importante nos otorga una recuperación del {primerTomoData && primerTomoData.icon ? (
                                   <span className="inline-flex items-center gap-1">
                                     <Image
                                       src={primerTomoData.icon}
                                       alt={primerTomoData.name}
                                       width={20}
                                       height={20}
                                       className="rounded"
                                       onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                     />
                                     <span className="text-orange-300 font-semibold">{primerTomoData.name}</span>
                                   </span>
                                 ) : (
                                   <span className="text-orange-300 font-semibold">primer tomo</span>
                                 )} cada vez que un enemigo muera pero, si este muere mientras estamos dentro del tomo, nos devolverá páginas. Otros traits nos darán páginas extra en los tomos, bufos cuando usamos diferentes habilidades y una gama de mejoras de nuestro daño.
                               </p>
                               <p className="text-gray-200 text-sm leading-relaxed">
                                 El uso de esta build es realmente sencillo. Solo tendremos que entrar en {primerTomoData && primerTomoData.icon ? (
                                   <span className="inline-flex items-center gap-1">
                                     <Image
                                       src={primerTomoData.icon}
                                       alt={primerTomoData.name}
                                       width={20}
                                       height={20}
                                       className="rounded"
                                       onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                     />
                                     <span className="text-orange-300 font-semibold">{primerTomoData.name}</span>
                                   </span>
                                 ) : (
                                   <span className="text-orange-300 font-semibold">primer tomo</span>
                                 )}, usar <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/d/d3/Ep%C3%ADlogo-_Las_cenizas_de_los_justos.png"
                                     alt="Epílogo: Las cenizas de los justos"
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">Epílogo: Las cenizas de los justos</span>
                                 </span> siempre que lo tengamos, <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/e/e7/Cap%C3%ADtulo_2-_Estallido_calcinante.png"
                                     alt="Capítulo 2: Estallido calcinante"
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">Capítulo 2: Estallido calcinante</span>
                                 </span> y luego usar <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/d/dc/Cap%C3%ADtulo_1-_Hechizo_abrasador.png"
                                     alt="Capítulo 1: Hechizo abrasador"
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">Capítulo 1: Hechizo abrasador</span>
                                 </span> hasta que se acabe o tengamos una de las 2 habilidades que acabo de mencionar. En caso de estar en una puerta usaremos el <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/e/ee/Cap%C3%ADtulo_4-_Tierra_quemada.png"
                                     alt="Capítulo 4: Tierra quemada"
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">Capítulo 4: Tierra quemada</span>
                                 </span> también. En cuanto a las habilidades de la derecha solo tirad los gritos siempre que los tengáis, el área para las puertas y el teletransporte para moveros.
                               </p>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div id="mirage-spammer" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Zap className="w-5 h-5 mr-2 text-orange-400" />
                         Mirage Spammer
                       </h3>
                       <p className="text-gray-300 text-sm">Contenido de esta build próximamente...</p>
                     </div>

                     <div id="temerario-poder" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Shield className="w-5 h-5 mr-2 text-orange-400" />
                         Temerario Poder
                       </h3>
                       <p className="text-gray-300 text-sm">Contenido de esta build próximamente...</p>
                     </div>

                     <div id="temerario-condicion" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Zap className="w-5 h-5 mr-2 text-orange-400" />
                         Temerario Condición
                       </h3>
                       <p className="text-gray-300 text-sm">Contenido de esta build próximamente...</p>
                     </div>

                     {/* Información adicional */}
                     <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                       <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                         <Info className="w-5 h-5 mr-2" />
                         Próximamente
                       </h3>
                       <p className="text-gray-300 text-sm">
                         Si tu clase favorita no está en esta lista, no te preocupes. En los próximos días publicaremos builds específicas para cada clase, 
                         asegurándonos de que todos los jugadores tengan opciones optimizadas para el Laberinto de Halloween.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Routes Section */}
             {selectedSection === 'routes' && (
               <div className="space-y-8">
                 <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                     <Map className="w-6 h-6 mr-3 text-orange-400" />
                     Rutas de Farmeo
                   </h2>
                   
                   <div className="prose prose-invert max-w-none mb-8">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                       El proceso de farmeo del laberinto es como cualquier otro farmeo de tageo, es decir, un farmeo que consiste en atacar a todos y dejar que el resto del grupo ataquen también para que todos nos llevemos el loot de cada enemigo.
                     </p>
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                       Una vez tenemos claro eso, es tan simple como seguir un camino y unos cuantos tips.
                     </p>
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                       El camino consiste en girar por el laberinto en el sentido de las agujas del reloj y entrando y saliendo al centro.
                     </p>
                   </div>

                   <div className="space-y-6">
                     <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                       <h3 className="text-white font-semibold mb-3 flex items-center">
                         <Target className="w-5 h-5 mr-2 text-orange-400" />
                         Concepto de Tagging
                       </h3>
                       <p className="text-gray-300 text-sm">
                         El farmeo de tagging consiste en atacar a todos los enemigos para obtener loot, pero sin matarlos completamente. 
                         Esto permite que otros jugadores también ataquen y todos reciban recompensas.
                       </p>
                     </div>

                     <div className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-4">
                       <h3 className="text-white font-semibold mb-3 flex items-center">
                         <Map className="w-5 h-5 mr-2 text-green-400" />
                         Ruta del Laberinto
                       </h3>
                       <div className="space-y-3">
                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">Movimiento en sentido horario</h4>
                             <p className="text-gray-300 text-sm">Gira por el laberinto siguiendo el sentido de las agujas del reloj para maximizar la cobertura de enemigos.</p>
                           </div>
                         </div>
                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">Entrar y salir del centro</h4>
                             <p className="text-gray-300 text-sm">No te limites al perímetro, entra al centro del laberinto para encontrar más enemigos y maximizar el farmeo.</p>
                           </div>
                         </div>
                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">Mantén el ritmo constante</h4>
                             <p className="text-gray-300 text-sm">Una vez que encuentres el ritmo, manténlo. Los enemigos respawnan regularmente en las mismas ubicaciones.</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Imagen de la ruta */}
                       <div className="mt-6">
                         <Image
                           src="/thumbnails/ruta-hall.webp"
                           alt="Ruta del Laberinto de Halloween"
                           width={800}
                           height={600}
                           className="w-full h-auto rounded-lg border border-orange-500/30 shadow-lg"
                           onError={(e) => { 
                             console.error('Error loading image:', e);
                             (e.currentTarget as HTMLImageElement).style.display = 'none'; 
                           }}
                         />
                         
                         {/* Nota de traducción para usuarios EN */}
                         <div className="mt-3 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                           <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                             <Info className="w-4 h-4 mr-2" />
                             Note for English speakers
                           </h4>
                           <p className="text-gray-300 text-sm">
                             The image is in Spanish: <strong>"Puerta"</strong> = <strong>"Door"</strong> | <strong>"Inicio"</strong> = <strong>"Start"</strong>
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Consejos detallados del laberinto */}
                     <div className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-4">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                         Consejos Específicos del Laberinto
                       </h3>
                       
                       <div className="space-y-4">
                         <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                           <h4 className="text-orange-300 font-semibold mb-2">🎯 Las 4 Puertas Importantes</h4>
                           <p className="text-gray-300 text-sm">
                             Lo más importante es que sepamos que habrá muchas puertas pero solo 4 importantes que debemos abrir. 
                             Esas 4 están indicadas en la imagen que tenemos encima. El resto lo mejor es ignorarlas y seguir corriendo.
                           </p>
                         </div>

                         <div className="space-y-3">
                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                             <div>
                               <h4 className="text-white font-semibold">Ruta principal</h4>
                               <p className="text-gray-300 text-sm">
                                 Una vez que empezamos arriba a la derecha, vamos haciendo el proceso de la imagen. Hay una variante y es entrar y salir por los lados en vez de por arriba y abajo, pero vamos, que es lo mismo al final.
                               </p>
                             </div>
                           </div>

                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                             <div>
                               <h4 className="text-white font-semibold">Evitar legendarios</h4>
                               <p className="text-gray-300 text-sm">
                                 Siempre que pasemos por los legendarios es recomendable esquivarlos ya sea corriendo mucho, pasando lejos de ellos, haciéndonos invisibles o como podamos.
                               </p>
                             </div>
                           </div>

                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                             <div>
                               <h4 className="text-white font-semibold">Esquina inferior izquierda</h4>
                               <p className="text-gray-300 text-sm">
                                 En la esquina inferior izquierda, en caso de ver la puerta en el minimapa, iremos a por ella, de no ser así, recortaremos más cerca del interior para continuar hacia arriba.
                               </p>
                             </div>
                           </div>

                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                             <div>
                               <h4 className="text-white font-semibold">En las puertas</h4>
                               <p className="text-gray-300 text-sm">
                                 Cuando estemos en las puertas es importante hacer daño en área ya que los enemigos saldrán en tromba. Intentad NO empujar a nadie porque entonces podéis joder a todo el grupo.
                               </p>
                             </div>
                           </div>

                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                             <div>
                               <h4 className="text-white font-semibold">El esqueleto con motosierra</h4>
                               <p className="text-gray-300 text-sm">
                                 En caso de que salga el esqueleto con la motosierra y nos persiga, haced caso al comandante. Él decidirá si correr o pegarle, sea como sea, id todos juntos a donde él escoja.
                               </p>
                             </div>
                           </div>
                         </div>

                         <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                           <h4 className="text-red-300 font-semibold mb-2">⚠️ Comandantes Problemáticos</h4>
                           <p className="text-gray-300 text-sm">
                             Hay algunos comandantes que hacen todas las puertas y los legendarios, el mayor TIP que os puedo dar es: <strong>Que huyáis de esos comandantes.</strong>
                           </p>
                         </div>

                         <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                           <h4 className="text-blue-300 font-semibold mb-2">💡 Resumen Final</h4>
                           <p className="text-gray-300 text-sm">
                             Aparte de esto no hay mucho más que tener en cuenta. Recordad no hacer demasiado daño a los enemigos e ir equipados como toca.
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                       <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                         <Info className="w-5 h-5 mr-2" />
                         Consejo Pro
                       </h3>
                       <p className="text-gray-300 text-sm">
                         La clave del éxito en el laberinto es la consistencia. Una vez que domines la ruta, podrás farmear de manera eficiente 
                         sin pensar demasiado, permitiéndote concentrarte en otros aspectos como builds o conversación con el grupo.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             )}

            {/* Rewards Section */}
            {selectedSection === 'rewards' && (
              <div className="space-y-8">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Gift className="w-6 h-6 mr-3 text-orange-400" />
                    Recompensas del Laberinto
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Drops Principales</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg">
                          <Package className="w-5 h-5 text-orange-400" />
                          <div>
                            <h4 className="text-white font-semibold">Trick-or-Treat Bags</h4>
                            <p className="text-gray-300 text-sm">El drop más común y valioso. Contiene materiales de Halloween.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg">
                          <Coins className="w-5 h-5 text-yellow-400" />
                          <div>
                            <h4 className="text-white font-semibold">Candy Corn</h4>
                            <p className="text-gray-300 text-sm">Moneda especial de Halloween para comprar items exclusivos.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg">
                          <Star className="w-5 h-5 text-purple-400" />
                          <div>
                            <h4 className="text-white font-semibold">Items Raros</h4>
                            <p className="text-gray-300 text-sm">Ocasionalmente puedes obtener items muy valiosos como infusiones.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Section */}
            {selectedSection === 'tips' && (
              <div className="space-y-8">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-orange-400" />
                    Consejos Avanzados
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Maximizar Eficiencia</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Usa boosters</h4>
                            <p className="text-gray-300 text-sm">Magic Find, Experience, y otros boosters pueden aumentar significativamente tus ganancias.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Optimiza tu build</h4>
                            <p className="text-gray-300 text-sm">Prioriza daño AoE y movilidad. Los enemigos son débiles pero numerosos.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Mantén el ritmo</h4>
                            <p className="text-gray-300 text-sm">No te detengas a vender constantemente. Acumula y vende en lotes.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Consejos de Supervivencia</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Cuidado con Steve</h4>
                            <p className="text-gray-300 text-sm">El jefe del laberinto puede aparecer en cualquier momento. Ten un plan de escape.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Mantén distancia</h4>
                            <p className="text-gray-300 text-sm">Algunos enemigos tienen ataques que pueden matarte instantáneamente.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Usa el mapa</h4>
                            <p className="text-gray-300 text-sm">El laberinto puede ser confuso. Usa el mapa para orientarte y encontrar rutas eficientes.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="text-orange-300 font-semibold mb-2 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Pro Tip Final
                    </h3>
                    <p className="text-gray-300 text-sm">
                      El Laberinto de Halloween es una de las actividades más rentables del juego, pero también una de las más repetitivas. 
                      Si sientes que te estás volviendo loco, ¡toma un descanso! Tu salud mental es más importante que el oro virtual.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de confirmación de copia */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900/95 backdrop-blur-md rounded-lg p-6 border border-orange-500/30 shadow-2xl max-w-sm w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Código copiado!</h3>
              <p className="text-gray-300 text-sm">
                El código de traits se ha copiado al portapapeles. Ya puedes pegarlo en el juego.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default LabyrinthGuidePage;
