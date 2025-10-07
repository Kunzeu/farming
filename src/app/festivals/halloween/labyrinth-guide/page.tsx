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
  const [tercerTomoData, setTercerTomoData] = useState<{name: string, icon: string} | null>(null);
  const [primerTomoData, setPrimerTomoData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [habilidad1Data, setHabilidad1Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [mantraData, setMantraData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [selloData, setSelloData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [habilidad2Data, setHabilidad2Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [habilidad3Data, setHabilidad3Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [habilidad4Data, setHabilidad4Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [runa24836Data, setRuna24836Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [fuerzaData, setFuerzaData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [precisionData, setPrecisionData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [runa100148Data, setRuna100148Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [runaVelocidadData, setRunaVelocidadData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [relicVampirismData, setRelicVampirismData] = useState<{name: string, icon?: string, wikiUrl: string} | null>(null);
  const [relicSpeedData, setRelicSpeedData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [trait1833Name, setTrait1833Name] = useState<string>('Entrenamiento de loto');
  const [trait1833Data, setTrait1833Data] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [channeledVigorData, setChanneledVigorData] = useState<{name: string, icon: string, wikiUrl: string} | null>(null);
  const [brawlersTenacityData, setBrawlersTenacityData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);
  const [signetAgilityData, setSignetAgilityData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);
  const [stealData, setStealData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);
  const [enduranceThiefData, setEnduranceThiefData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);
  const [shadowstepData, setShadowstepData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);
  const [infiltratorsArrowData, setInfiltratorsArrowData] = useState<{name: string, wikiUrl: string, icon: string} | null>(null);

  const sections = [
    { id: 'overview', label: t('halloween.labyrinth.sections.overview'), icon: Info },
    { id: 'builds', label: t('halloween.labyrinth.sections.builds'), icon: Sword },
    { id: 'routes', label: t('halloween.labyrinth.sections.routes'), icon: Map },
    { id: 'rewards', label: t('halloween.labyrinth.sections.rewards'), icon: Gift },
    { id: 'tips', label: t('halloween.labyrinth.sections.tips'), icon: Star }
  ];

  // Función para construir URL de wiki
  const buildWikiUrl = (itemName: string, itemType: 'item' | 'skill') => {
    const normalized = (lang || 'en').toLowerCase();
    const wikiLang = normalized.startsWith('fr') ? 'fr' : normalized.startsWith('de') ? 'de' : 'en';
    const formattedName = (itemName || '').replace(/ /g, '_');
    if (itemType === 'skill' || itemType === 'item') {
      if (wikiLang === 'fr') return `https://wiki-fr.guildwars2.com/wiki/${formattedName}`;
      if (wikiLang === 'de') return `https://wiki-de.guildwars2.com/wiki/${formattedName}`;
      return `https://wiki.guildwars2.com/wiki/${formattedName}`;
    }
    return `https://wiki.guildwars2.com/wiki/${formattedName}`;
  };

  // Trait 1833 (Lotus Training): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Lotus Training',
      de: 'Lotus-Training',
      es: 'Entrenamiento de loto',
      fr: 'Initiation du lotus',
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Lotus_Training',
      es: 'https://wiki-es.guildwars2.com/wiki/Entrenamiento_de_loto',
      de: 'https://wiki-de.guildwars2.com/wiki/Lotus-Training',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Initiation_du_lotus',
    };
    const icon = 'https://wiki.guildwars2.com/images/e/ea/Lotus_Training.png';
    const name = nameByLang[langKey] || nameByLang.en;
    const wikiUrl = wikiByLang[langKey] || wikiByLang.en;
    setTrait1833Name(name);
    setTrait1833Data({ name, icon, wikiUrl });
  }, [lang]);

  // Obtener datos de Vigor canalizado (skill 30400) según idioma actual (icono fijo + nombre mapeado)
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const fixedIcon = 'https://wiki.guildwars2.com/images/thumb/a/a1/Channeled_Vigor.png/48px-Channeled_Vigor.png';
    const nameByLang: Record<string, string> = {
      en: 'Channeled Vigor',
      de: 'Kanalisierter Elan',
      es: 'Vigor canalizado',
      fr: 'Vigueur canalisée'
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Channeled_Vigor',
      es: 'https://wiki.guildwars2.com/wiki/Channeled_Vigor',
      de: 'https://wiki-de.guildwars2.com/wiki/Kanalisierter_Elan',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Vigueur_canalisée'
    };
    const name = nameByLang[langKey] || nameByLang.en;
    const wikiUrl = wikiByLang[langKey] || wikiByLang.en;
    setChanneledVigorData({
      name,
      icon: fixedIcon,
      wikiUrl
    });
  }, [lang]);

  // La tenacidad del luchador (Brawler's Tenacity): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: "Brawler's Tenacity",
      de: 'Hartnäckigkeit des Raufbolds',
      es: 'Tenacidad de pendenciero',
      fr: 'Ténacité du bagarreur'
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Brawler%27s_Tenacity',
      es: 'https://wiki.guildwars2.com/wiki/Brawler%27s_Tenacity',
      de: 'https://wiki-de.guildwars2.com/wiki/Hartn%C3%A4ckigkeit_des_Raufbolds',
      fr: 'https://wiki-fr.guildwars2.com/wiki/T%C3%A9nacit%C3%A9_du_bagarreur'
    };
    const icon = 'https://wiki.guildwars2.com/images/8/89/Brawler%27s_Tenacity.png';
    setBrawlersTenacityData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Sello de Agilidad (Signet of Agility): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Signet of Agility',
      de: 'Siegel der Beweglichkeit',
      es: 'Sello de agilidad',
      fr: "Signe d'agilité",
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Signet_of_Agility',
      es: 'https://wiki.guildwars2.com/wiki/Signet_of_Agility',
      de: 'https://wiki-de.guildwars2.com/wiki/Siegel_der_Beweglichkeit',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Signe_d%27agilit%C3%A9',
    };
    const icon = 'https://wiki.guildwars2.com/images/thumb/1/1d/Signet_of_Agility.png/48px-Signet_of_Agility.png';
    setSignetAgilityData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Reliquia de Velocidad (ID 100148): icono desde API + wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const apiLang = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Relic_of_Speed',
      es: 'https://wiki.guildwars2.com/wiki/Relic_of_Speed',
      de: 'https://wiki-de.guildwars2.com/wiki/Relikt_der_Geschwindigkeit',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Relique_de_vitesse',
    };
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    fetch(`https://api.guildwars2.com/v2/items/100148?lang=${apiLang}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        setRelicSpeedData({ name: d.name, icon: d.icon, wikiUrl: wikiByLang[langKey] });
      })
      .catch(() => {});
  }, [lang]);

  // Reliquia de Vampirismo (ID 100676): nombre y wiki por idioma (icono opcional)
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Relic of Vampirism',
      de: 'Relikt des Vampirismus',
      es: 'Reliquia de vampirismo',
      fr: 'Relique de vampirisme',
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Relic_of_Vampirism',
      es: 'https://wiki.guildwars2.com/wiki/Relic_of_Vampirism',
      de: 'https://wiki-de.guildwars2.com/wiki/Relikt_des_Vampirismus',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Relique_de_vampirisme',
    };
    const name = nameByLang[langKey];
    const wikiUrl = wikiByLang[langKey];
    setRelicVampirismData({ name, wikiUrl });
    // Intentar obtener icono desde la API de items por ID (100676)
    const apiLang = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    fetch(`https://api.guildwars2.com/v2/items/100676?lang=${apiLang}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && typeof d.icon === 'string' && d.icon) {
          setRelicVampirismData(prev => prev ? { ...prev, icon: d.icon } : { name, wikiUrl, icon: d.icon });
        }
      })
      .catch(() => {});
  }, [lang]);

  // Robar (Steal): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Steal',
      de: 'Stehlen',
      es: 'Robar',
      fr: 'Larcin',
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Steal',
      es: 'https://wiki.guildwars2.com/wiki/Steal',
      de: 'https://wiki-de.guildwars2.com/wiki/Stehlen',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Larcin',
    };
    const icon = 'https://wiki.guildwars2.com/images/9/92/Steal.png';
    setStealData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Ladrón de resistencia (Endurance Thief): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Endurance Thief',
      de: 'Ausdauer-Dieb',
      es: 'Ladrón de aguante',
      fr: "Voleur d'endurance",
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Endurance_Thief',
      es: 'https://wiki.guildwars2.com/wiki/Endurance_Thief',
      de: 'https://wiki-de.guildwars2.com/wiki/Ausdauer-Dieb',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Voleur_d%27endurance',
    };
    const icon = 'https://wiki.guildwars2.com/images/4/46/Endurance_Thief.png';
    setEnduranceThiefData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Paso de sombra (Shadowstep): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: 'Shadowstep',
      de: 'Schattenschritt (Dieb)',
      es: 'Paso sombrío',
      fr: "Foulée de l'ombre",
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Shadowstep',
      es: 'https://wiki.guildwars2.com/wiki/Shadowstep',
      de: 'https://wiki-de.guildwars2.com/wiki/Schattenschritt_(Dieb)',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Foul%C3%A9e_de_l%27ombre',
    };
    const icon = 'https://wiki.guildwars2.com/images/2/25/Shadowstep.png';
    setShadowstepData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Flecha del infiltrado (Infiltrator's Arrow): nombre, icono fijo y wiki por idioma
  useEffect(() => {
    const normalized = (lang || 'en').toLowerCase();
    const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
    const nameByLang: Record<string, string> = {
      en: "Infiltrator's Arrow",
      de: 'Pfeil des Infiltrators',
      es: 'Flecha del infiltrado',
      fr: "Flèche de l'infiltré",
    };
    const wikiByLang: Record<string, string> = {
      en: 'https://wiki.guildwars2.com/wiki/Infiltrator%27s_Arrow',
      es: 'https://wiki.guildwars2.com/wiki/Infiltrator%27s_Arrow',
      de: 'https://wiki-de.guildwars2.com/wiki/Pfeil_des_Infiltrators',
      fr: 'https://wiki-fr.guildwars2.com/wiki/Fl%C3%A8che_de_l%27infiltr%C3%A9',
    };
    const icon = 'https://wiki.guildwars2.com/images/c/c7/Infiltrator%27s_Arrow.png';
    setInfiltratorsArrowData({ name: nameByLang[langKey], wikiUrl: wikiByLang[langKey], icon });
  }, [lang]);

  // Función para construir URL de wiki de sellos
  const buildSigilWikiUrl = (itemType: 'vitality' | 'fire' | 'vampirismo' | 'velocidad' | 'tomo-justicia' | 'epilogo-cenizas'): string => {
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
        return `https://wiki.guildwars2.com/wiki/Relic_of_Vampirism`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Relique_de_vampirisme`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/Relikt_des_Vampirismus`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Relic_of_Vampirism`;
      }
    } else if (itemType === 'tomo-justicia') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Tome_of_Justice`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/Grimoire_de_justice`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/Foliant_der_Gerechtigkeit`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Tome_of_Justice`;
      }
    } else if (itemType === 'epilogo-cenizas') {
      if (lang === 'es') {
        return `https://wiki.guildwars2.com/wiki/Epilogue:_Ashes_of_the_Just`;
      } else if (lang === 'fr') {
        return `https://wiki-fr.guildwars2.com/wiki/%C3%89pilogue_:_Les_cendres_des_justes`;
      } else if (lang === 'de') {
        return `https://wiki-de.guildwars2.com/wiki/Epilog:_Die_Asche_der_Gerechten`;
      } else {
        return `https://wiki.guildwars2.com/wiki/Epilogue:_Ashes_of_the_Just`;
      }
    }
    // Fallback por defecto
    return `https://wiki.guildwars2.com/wiki/Superior_Sigil_of_Stamina`;
  };

  // Función para obtener nombres traducidos de habilidades
  const getTranslatedName = (itemType: 'epilogo-cenizas'): string => {
    if (itemType === 'epilogo-cenizas') {
      if (lang === 'es') {
        return 'Epílogo: Las cenizas de los justos';
      } else if (lang === 'fr') {
        return 'Épilogue : Les cendres des justes';
      } else if (lang === 'de') {
        return 'Epilog: Die Asche der Gerechten';
      } else {
        return 'Epilogue: Ashes of the Just';
      }
    }
    return '';
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
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('tomo-justicia')
      });
    } catch (error) {
      // Error fetching primer tomo data
    }
  };

  const fetchHabilidad1Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10219?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Spatial_Surge',
        es: 'https://wiki.guildwars2.com/wiki/Spatial_Surge',
        de: 'https://wiki-de.guildwars2.com/wiki/R%C3%A4umliche_Welle',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Renforcement_spatial'
      };
      setHabilidad1Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching habilidad 1 data
    }
  };

  const fetchMantraData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10211?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Mantra_of_Pain',
        es: 'https://wiki.guildwars2.com/wiki/Mantra_of_Pain',
        de: 'https://wiki-de.guildwars2.com/wiki/Mantra_der_Schmerzen',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Mantra_de_douleur'
      };
      setMantraData({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching mantra data
    }
  };

  const fetchSelloData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10236?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Signet_of_Inspiration',
        es: 'https://wiki.guildwars2.com/wiki/Signet_of_Inspiration',
        de: 'https://wiki-de.guildwars2.com/wiki/Siegel_der_Inspiration',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Signe_d%27inspiration'
      };
      setSelloData({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching sello data
    }
  };

  const fetchHabilidad2Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10333?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Mirror_Blade',
        es: 'https://wiki.guildwars2.com/wiki/Mirror_Blade',
        de: 'https://wiki-de.guildwars2.com/wiki/Spiegelklinge',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Lame_miroir'
      };
      setHabilidad2Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching habilidad 2 data
    }
  };

  const fetchHabilidad3Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10218?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Mind_Stab',
        es: 'https://wiki.guildwars2.com/wiki/Mind_Stab',
        de: 'https://wiki-de.guildwars2.com/wiki/Gedankenstich',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Surin_mental'
      };
      setHabilidad3Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching habilidad 3 data
    }
  };

  const fetchHabilidad4Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/skills/10221?lang=${lang}`);
      const data = await response.json();
      const normalized = (lang || 'en').toLowerCase();
      const langKey = normalized.startsWith('es') ? 'es' : normalized.startsWith('de') ? 'de' : normalized.startsWith('fr') ? 'fr' : 'en';
      const wikiByLang: Record<string, string> = {
        en: 'https://wiki.guildwars2.com/wiki/Phantasmal_Berserker',
        es: 'https://wiki.guildwars2.com/wiki/Phantasmal_Berserker',
        de: 'https://wiki-de.guildwars2.com/wiki/Tr%C3%BCgerischer_Berserker',
        fr: 'https://wiki-fr.guildwars2.com/wiki/Berserker_fantasmagorique'
      };
      setHabilidad4Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: wikiByLang[langKey]
      });
    } catch (error) {
      // Error fetching habilidad 4 data
    }
  };

  const fetchRuna24836Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24836?lang=${lang}`);
      const data = await response.json();
      setRuna24836Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: `https://wiki.guildwars2.com/wiki/${data.name.replace(/ /g, '_')}`
      });
    } catch (error) {
      // Error fetching runa 24836 data
    }
  };

  const fetchFuerzaData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24615?lang=${lang}`);
      const data = await response.json();
      setFuerzaData({
        name: data.name,
        icon: data.icon,
        wikiUrl: `https://wiki.guildwars2.com/wiki/${data.name.replace(/ /g, '_')}`
      });
    } catch (error) {
      // Error fetching fuerza data
    }
  };

  const fetchPrecisionData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/24562?lang=${lang}`);
      const data = await response.json();
      setPrecisionData({
        name: data.name,
        icon: data.icon,
        wikiUrl: `https://wiki.guildwars2.com/wiki/${data.name.replace(/ /g, '_')}`
      });
    } catch (error) {
      // Error fetching precision data
    }
  };

  const fetchRuna100148Data = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/100148?lang=${lang}`);
      const data = await response.json();
      setRuna100148Data({
        name: data.name,
        icon: data.icon,
        wikiUrl: `https://wiki.guildwars2.com/wiki/${data.name.replace(/ /g, '_')}`
      });
    } catch (error) {
      // Error fetching runa 100148 data
    }
  };

  // Función para obtener datos de Runa de Velocidad
  const fetchRunaVelocidadData = async () => {
    try {
      const response = await fetch(`https://api.guildwars2.com/v2/items/100148?lang=${lang}`);
      const data = await response.json();
      setRunaVelocidadData({
        name: data.name,
        icon: data.icon,
        wikiUrl: buildSigilWikiUrl('velocidad')
      });
    } catch (error) {
      // Error fetching runa velocidad data
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
    fetchTercerTomoData();
    fetchPrimerTomoData();
    fetchHabilidad1Data();
    fetchMantraData();
    fetchSelloData();
    fetchHabilidad2Data();
    fetchHabilidad3Data();
    fetchHabilidad4Data();
    fetchRuna24836Data();
    fetchFuerzaData();
    fetchPrecisionData();
    fetchRuna100148Data();
    fetchRunaVelocidadData();
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
            {t('halloween.labyrinth.backToHalloween')}
              </a>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">🎃</span>
              {t('halloween.labyrinth.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {t('halloween.labyrinth.subtitle')}
            </p>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto mt-6 leading-relaxed">
              {t('halloween.labyrinth.description')}
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
                    {t('halloween.labyrinth.overview.title')}
                  </h2>
                  
                  <div className="prose prose-invert max-w-none">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                     {t('halloween.labyrinth.overview.description')} <button 
                       onClick={() => setSelectedSection('builds')}
                       className="text-orange-400 hover:text-orange-300 underline font-semibold transition-colors duration-200"
                     >
                       {t('halloween.labyrinth.overview.bestBuilds')}
                     </button>, {t('halloween.labyrinth.overview.prepareBenefit')}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-orange-400" />
                          {t('halloween.labyrinth.overview.whatIsLabyrinth')}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {t('halloween.labyrinth.overview.whatIsLabyrinthDescription')}
                        </p>
                      </div>
                      
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                          {t('halloween.labyrinth.overview.goldPerHour')}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {t('halloween.labyrinth.overview.goldPerHourDescription')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                      <h3 className="text-red-300 font-semibold mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        {t('halloween.labyrinth.overview.attention')}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {t('halloween.labyrinth.overview.attentionDescription')}
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
                    {t('halloween.labyrinth.builds.title')}
                   </h2>
                   
                   <div className="prose prose-invert max-w-none mb-8">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                    {t('halloween.labyrinth.content.intro')}
                     </p>
                   </div>

                   {/* Puntos comunes importantes */}
                   <div className="space-y-6 mb-8">
                     <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                       <h3 className="text-red-300 font-semibold mb-3 flex items-center">
                         <AlertTriangle className="w-5 h-5 mr-2" />
                         {t('halloween.labyrinth.builds.commonPoints')}
                       </h3>
                       
                      <div className="space-y-4">
                         <div className="bg-red-800/20 border border-red-400/30 rounded-lg p-3">
                           <h4 className="text-red-200 font-semibold mb-2 flex items-center">
                             <span className="text-lg mr-2">🚫</span>
                             {t('halloween.labyrinth.builds.noAccessories')}
                           </h4>
                           <p className="text-gray-300 text-sm">
                             {t('halloween.labyrinth.builds.noAccessoriesDescription')}
                           </p>
                         </div>

                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">{t('halloween.labyrinth.builds.foodAndImprovements')}</h4>
                             <p className="text-gray-300 text-sm">
                               {t('halloween.labyrinth.builds.foodAndImprovementsDescription')}
                             </p>
                           </div>
                         </div>

                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <h4 className="text-white font-semibold">{t('halloween.labyrinth.builds.alternativeStats')}</h4>
                             <p className="text-gray-300 text-sm">
                               {t('halloween.labyrinth.builds.alternativeStatsDescription')}
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
                         {t('halloween.labyrinth.builds.content')}
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
                           <span className="text-gray-200 font-medium">{t('halloween.labyrinth.builds.scrapper')}</span>
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
                           <span className="text-gray-200 font-medium">{t('halloween.labyrinth.builds.firebrand')}</span>
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
                           <span className="text-gray-200 font-medium">{t('halloween.labyrinth.builds.mirage')}</span>
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
                           <span className="text-gray-200 font-medium">{t('halloween.labyrinth.builds.daredevilPower')}</span>
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
                           <span className="text-gray-200 font-medium">{t('halloween.labyrinth.builds.daredevilCondi')}</span>
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
                        {t('halloween.labyrinth.builds.scrapper')}
                       </h3>
                       
                       <div className="prose prose-invert max-w-none">
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                            {t('halloween.labyrinth.builds.scrapper.description.part1')} {skillData ? (
                             <span className="inline-flex items-center gap-1">
                               <Image
                                 src={skillData.icon}
                                 alt={skillData.name}
                                 width={16}
                                 height={16}
                                 className="rounded align-middle"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{skillData.name}</span>
                             </span>
                           ) : (
                             <span className="text-orange-300 font-semibold">supervelocidad</span>
                           )} {t('halloween.labyrinth.builds.scrapper.description.part2')}
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                        {t('halloween.labyrinth.builds.scrapper.description.part3')}
                         </p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                           {t('halloween.labyrinth.builds.scrapper.equipment')} {itemData ? (
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
                           )} {t('halloween.labyrinth.builds.scrapper.equipment.ifMore')} {skillData ? (
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
                          )} {t('common.and')} {relicSpeedData ? (
                            <a
                              href={relicSpeedData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {relicSpeedData.icon && (
                                <Image
                                  src={relicSpeedData.icon}
                                  alt={relicSpeedData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{relicSpeedData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Relic of Speed</span>
                          )} {t('halloween.labyrinth.builds.scrapper.equipment.ifMoreSurvival')}. {t('halloween.labyrinth.builds.scrapper.weapons')} {vitalityData ? (
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
                           )} {t('common.and')} {fireData ? (
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
                           {t('halloween.labyrinth.builds.scrapper.abilities')} {skillData ? (
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
                           )} {t('halloween.labyrinth.builds.scrapper.abilities.and')} {skillData ? (
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
                           )}. {t('halloween.labyrinth.builds.scrapper.abilities.other')}
                         </p>
                       </div>
                       
                       {/* Código de traits */}
                       <div className="mt-6">
                         <div className="flex items-center justify-between mb-2">
                           <h4 className="text-white font-semibold flex items-center">
                             <span className="text-lg mr-2">⚙️</span>
                             {t('halloween.labyrinth.builds.traitsCode')}
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
                             {t('halloween.labyrinth.builds.copyCode')}
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
                            {t('halloween.labyrinth.scrapper.usage.part1')}{' '}
                            {skillData ? (
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
                              <span className="text-orange-300 font-semibold">{t('halloween.labyrinth.scrapper.usage.superspeedFallback')}</span>
                            )}{' '}
                            {t('halloween.labyrinth.scrapper.usage.part2')}
                           </p>
                          <p className="text-gray-200 text-sm leading-relaxed">
                            {t('halloween.labyrinth.scrapper.usage.priority')}{' '}
                            {baluarteData ? (
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
                              <span className="text-orange-300 font-semibold">{'(sin datos)'}</span>
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
                              <span className="text-orange-300 font-semibold">{'(sin datos)'}</span>
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
                              <span className="text-orange-300 font-semibold">{'(sin datos)'}</span>
                             )} {t('common.and')} {furtivoData ? (
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
                              <span className="text-orange-300 font-semibold">{'(sin datos)'}</span>
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
                          {t('halloween.labyrinth.builds.firebrand')}
                         </h3>
                       
                       <div className="prose prose-invert max-w-none">
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                        {t('halloween.labyrinth.builds.firebrand.description')}
                         </p>
                        <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                          {t('halloween.labyrinth.firebrand.equipmentIntro')} {vampirismoData ? (
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
                           )} {t('common.and')} {runa100148Data ? (
                             <a 
                               href={runa100148Data.wikiUrl}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={runa100148Data.icon}
                                 alt={runa100148Data.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{runa100148Data.name}</span>
                             </a>
                           ) : (
                              <span className="text-orange-300 font-semibold">Runa 100148</span>
                           )}. {t('halloween.labyrinth.firebrand.weaponsIntro')} {vitalityData && vitalityData.icon ? (
                             <a
                               href={vitalityData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={20}
                                 height={20}
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
                               Vitalidad
                             </a>
                           )} {t('common.and')} {fireData && fireData.icon ? (
                             <a
                               href={fireData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={fireData.icon}
                                 alt={fireData.name}
                                 width={20}
                                 height={20}
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
                               Fuego
                             </a>
                           )}.
                         </p>
                        <p className="text-gray-200 mb-4 text-sm leading-relaxed">{t('halloween.labyrinth.firebrand.skillsSummary')}</p>
                         <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                          {t('halloween.labyrinth.firebrand.tomesIntro')}{tercerTomoData && tercerTomoData.icon ? (
                            <a
                              href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Tome_of_Courage' :
                                     lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Grimoire_du_courage' :
                                     lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/Foliant_der_Tapferkeit' :
                                                     'https://wiki.guildwars2.com/wiki/Tome_of_Courage'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              <Image
                                src={tercerTomoData.icon}
                                alt={tercerTomoData.name}
                                width={20}
                                height={20}
                                className="rounded"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                              <span className="text-orange-300 font-semibold">
                                {lang === 'es' ? 'Tomo de valor' : lang === 'fr' ? 'Grimoire du courage' : lang === 'de' ? 'Foliant der Tapferkeit' : 'Tome of Courage'}
                              </span>
                            </a>
                          ) : (
                            <a
                              href={lang === 'es' ? 'https://wiki.guildwars2.com/wiki/Tome_of_Courage' :
                                     lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Grimoire_du_courage' :
                                     lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/Foliant_der_Tapferkeit' :
                                                     'https://wiki.guildwars2.com/wiki/Tome_of_Courage'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-300 font-semibold hover:opacity-80 transition-opacity"
                            >
                              {lang === 'es' ? 'Tomo de valor' : lang === 'fr' ? 'Grimoire du courage' : lang === 'de' ? 'Foliant der Tapferkeit' : 'Tome of Courage'}
                            </a>
                          )}.
                         </p>
                         
                         {/* Código de traits */}
                         <div className="mt-6">
                           <div className="flex items-center justify-between mb-2">
                             <h4 className="text-white font-semibold flex items-center">
                               <span className="text-lg mr-2">⚙️</span>
                                {t('halloween.labyrinth.builds.traitsCode')}  
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
                               {t('halloween.labyrinth.builds.copyCode')}
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
                              {t('halloween.labyrinth.builds.firebrand.trait')} {primerTomoData && primerTomoData.icon ? (
                                  <a 
                                    href={primerTomoData.wikiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                                  >
                                    <Image
                                      src={primerTomoData.icon}
                                      alt={primerTomoData.name}
                                      width={20}
                                      height={20}
                                      className="rounded"
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <span className="text-orange-300 font-semibold">{primerTomoData.name}</span>
                                  </a>
                                 ) : (
                                   <span className="text-orange-300 font-semibold">primer tomo</span>
                                )} {t('halloween.labyrinth.builds.firebrand.trait.description')}
                               </p>
                              <p className="text-gray-200 text-sm leading-relaxed">
                                {t('halloween.labyrinth.firebrand.usageIntro')} {primerTomoData && primerTomoData.icon ? (
                                  <a 
                                    href={primerTomoData.wikiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                                  >
                                    <Image
                                      src={primerTomoData.icon}
                                      alt={primerTomoData.name}
                                      width={20}
                                      height={20}
                                      className="rounded"
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <span className="text-orange-300 font-semibold">{primerTomoData.name}</span>
                                  </a>
                                 ) : (
                                   <span className="text-orange-300 font-semibold">primer tomo</span>
                                )}, {t('common.use')} <a
                                  href={buildSigilWikiUrl('epilogo-cenizas')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                  <Image
                                    src="https://wiki-es.guildwars2.com/images/d/d3/Ep%C3%ADlogo-_Las_cenizas_de_los_justos.png"
                                    alt={t('halloween.labyrinth.firebrand.epilogueAshes')}
                                    width={20}
                                    height={20}
                                    className="rounded"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                  />
                                  <span className="text-orange-300 font-semibold">{t('halloween.labyrinth.firebrand.epilogueAshes')}</span>
                                </a> {t('common.whenAvailable')}, <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/e/e7/Cap%C3%ADtulo_2-_Estallido_calcinante.png"
                                    alt={t('halloween.labyrinth.firebrand.chapter2')}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                  <a
                                    href={lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Chapitre_2_:_Explosion_ardente' : lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/Kapitel_2:_Entz%C3%BCndende_Welle' : 'https://wiki.guildwars2.com/wiki/Chapter_2:_Igniting_Burst'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-300 font-semibold hover:opacity-80 transition-opacity"
                                  >
                                    {t('halloween.labyrinth.firebrand.chapter2')}
                                  </a>
                                </span> {t('common.andThen')} {t('common.use')} <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/d/dc/Cap%C3%ADtulo_1-_Hechizo_abrasador.png"
                                    alt={t('halloween.labyrinth.firebrand.chapter1')}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                  <a
                                    href={lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Chapitre_1_:_Sort_br%C3%BBlant' : lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/Kapitel_1:_Sengender_Zauber' : 'https://wiki.guildwars2.com/wiki/Chapter_1:_Searing_Spell'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-300 font-semibold hover:opacity-80 transition-opacity"
                                  >
                                    {t('halloween.labyrinth.firebrand.chapter1')}
                                  </a>
                                </span> {t('halloween.labyrinth.firebrand.untilEnds')} {t('halloween.labyrinth.firebrand.ifDoorUse')} <span className="inline-flex items-center gap-1">
                                   <Image
                                     src="https://wiki-es.guildwars2.com/images/e/ee/Cap%C3%ADtulo_4-_Tierra_quemada.png"
                                    alt={t('halloween.labyrinth.firebrand.chapter4')}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                  <a
                                    href={lang === 'fr' ? 'https://wiki-fr.guildwars2.com/wiki/Chapitre_4_:_Cons%C3%A9quences_br%C3%BBlantes' : lang === 'de' ? 'https://wiki-de.guildwars2.com/wiki/Kapitel_4:_Die_versengten_Folgen' : 'https://wiki.guildwars2.com/wiki/Chapter_4:_Scorched_Aftermath'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-300 font-semibold hover:opacity-80 transition-opacity"
                                  >
                                    {t('halloween.labyrinth.firebrand.chapter4')}
                                  </a>
                                </span> {t('halloween.labyrinth.firebrand.rightSideSkills')}
                               </p>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div id="mirage-spammer" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Image
                           src="https://wiki-es.guildwars2.com/images/9/92/Quim%C3%A9rico_icono_%28highres%29.png"
                           alt="Quimérico"
                           width={64}
                           height={64}
                           className="mr-2 rounded"
                           onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                         />
                        {t('halloween.labyrinth.builds.mirage')}
                       </h3>
                       
                       <div className="space-y-4">
                         <p className="text-gray-200 text-sm leading-relaxed">
                        {t('halloween.labyrinth.builds.mirage.description')}
                         </p>
                         
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {t('halloween.labyrinth.mirage.equipmentIntro')} {runa100148Data && runa100148Data.icon ? (
                             <a
                               href={runa100148Data.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={runa100148Data.icon}
                                 alt={runa100148Data.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{runa100148Data.name}</span>
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
                              {t('halloween.labyrinth.mirage.rune100148Fallback')}
                             </a>
                          )} {t('common.and')} {vampirismoData && vampirismoData.icon ? (
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
                              {t('halloween.labyrinth.mirage.vampirismFallback')}
                             </a>
                          )} {t('halloween.labyrinth.mirage.survivalNote')} {t('halloween.labyrinth.mirage.weaponsIntro')} {vitalityData && vitalityData.icon ? (
                             <a
                               href={vitalityData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={20}
                                 height={20}
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
                              {t('halloween.labyrinth.mirage.vitalityFallback')}
                             </a>
                          )} {t('common.and')} {fireData && fireData.icon ? (
                             <a
                               href={fireData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={fireData.icon}
                                 alt={fireData.name}
                                 width={20}
                                 height={20}
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
                              {t('halloween.labyrinth.mirage.fireFallback')}
                             </a>
                          )}. {t('halloween.labyrinth.mirage.vitalSigilImportant.prefix')} {vitalityData && vitalityData.icon ? (
                             <a
                               href={vitalityData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={20}
                                 height={20}
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
                              {t('halloween.labyrinth.mirage.vitalityFallback')}
                             </a>
                          )} {t('halloween.labyrinth.mirage.vitalSigilImportant.suffix')}
                         </p>
                         
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.mirage.abilitiesSummary')}</p>
                         
                         <div className="space-y-4">
                           <div>
                             <div className="flex items-center justify-between mb-2">
                               <h4 className="text-white font-semibold flex items-center">
                                 <span className="text-lg mr-2">⚙️</span>
                                 {t('halloween.labyrinth.builds.traitsCode')}
                               </h4>
                               <button
                                 onClick={() => {
                                   navigator.clipboard.writeText('[&DQcBOgoZOxnuFSMPaQEHFmUBgQGAAYMBRhe8AQAAAAAAAAAAAAAAAAAAAAA=]');
                                   setShowCopyModal(true);
                                   // Auto-cerrar el modal después de 2 segundos
                                   setTimeout(() => setShowCopyModal(false), 2000);
                                 }}
                                 className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                               >
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                 </svg>
                                 {t('halloween.labyrinth.builds.copyCode')}
                               </button>
                             </div>
                             <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-3">
                               <code className="text-orange-300 text-sm font-mono break-all">
                                 [&DQcBOgoZOxnuFSMPaQEHFmUBgQGAAYMBRhe8AQAAAAAAAAAAAAAAAAAAAAA=]
                               </code>
                             </div>
                           </div>
                           
                           <div>
                            <Image
                               src="/thumbnails/skills-y-traits-mirage-1-1024x576.webp"
                              alt={t('halloween.labyrinth.mirage.imageAlt')}
                               width={1024}
                               height={576}
                               className="w-full h-auto rounded-lg border border-orange-500/30"
                               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                             />
                             <p className="text-gray-200 text-sm leading-relaxed mt-4">
                              {t('halloween.labyrinth.mirage.traitsSummary')}
                             </p>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {t('halloween.labyrinth.mirage.method.introPrefix')} {habilidad1Data && habilidad1Data.icon ? (
                                 <a href={habilidad1Data.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={habilidad1Data.icon}
                                     alt={habilidad1Data.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{habilidad1Data.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">1</span>
                              )} {t('halloween.labyrinth.mirage.method.andRepeat')} {t('halloween.labyrinth.mirage.method.the')} {mantraData && mantraData.icon ? (
                                 <a href={mantraData.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={mantraData.icon}
                                     alt={mantraData.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{mantraData.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">mantra</span>
                              )} {t('halloween.labyrinth.mirage.method.throwMantraSuffix')} {selloData && selloData.icon ? (
                                 <a href={selloData.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={selloData.icon}
                                     alt={selloData.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{selloData.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">sello</span>
                              )} {t('halloween.labyrinth.mirage.method.endPrefix')} {habilidad2Data && habilidad2Data.icon ? (
                                 <a href={habilidad2Data.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={habilidad2Data.icon}
                                     alt={habilidad2Data.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{habilidad2Data.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">el 2</span>
                              )} {t('common.and')} {habilidad3Data && habilidad3Data.icon ? (
                                 <a href={habilidad3Data.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={habilidad3Data.icon}
                                     alt={habilidad3Data.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{habilidad3Data.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">el 3</span>
                             )}, {t('halloween.labyrinth.mirage.method.forBossesUse')} {habilidad4Data && habilidad4Data.icon ? (
                                 <a href={habilidad4Data.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline">
                                   <Image
                                     src={habilidad4Data.icon}
                                     alt={habilidad4Data.name}
                                     width={20}
                                     height={20}
                                     className="rounded"
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                   />
                                   <span className="text-orange-300 font-semibold">{habilidad4Data.name}</span>
                                 </a>
                               ) : (
                                 <span className="text-orange-300 font-semibold">el 4</span>
                              )} {t('halloween.labyrinth.mirage.method.also')}
                             </p>
                            <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.mirage.shattersUsage')}</p>
                           </div>
                         </div>
                         
                       </div>
                     </div>

                     <div id="temerario-poder" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Image
                           src="https://wiki-es.guildwars2.com/images/e/e6/Temerario_icono_%28highres%29.png"
                           alt="Temerario"
                           width={64}
                           height={64}
                           className="mr-2 rounded"
                           onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                         />
                        {t('halloween.labyrinth.builds.daredevilPower')}
                       </h3>
                       
                       <div className="space-y-4">
                         <p className="text-gray-200 text-sm leading-relaxed">
                        {t('halloween.labyrinth.builds.daredevilPower.description')}
                         </p>
                         
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {t('halloween.labyrinth.builds.daredevilPower.equipment')} {runa24836Data && runa24836Data.icon ? (
                             <a
                               href={runa24836Data.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={runa24836Data.icon}
                                 alt={runa24836Data.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{runa24836Data.name}</span>
                             </a>
                           ) : (
                             <span className="text-orange-300 font-semibold">Runa 24836</span>
                          )} {t('common.and')} {relicVampirismData ? (
                            <a
                              href={relicVampirismData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {relicVampirismData.icon && (
                                <Image
                                  src={relicVampirismData.icon}
                                  alt={relicVampirismData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{relicVampirismData.name}</span>
                            </a>
                          ) : (
                            <a
                              href={buildSigilWikiUrl('velocidad')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-300 font-semibold hover:text-orange-200 transition-colors underline"
                            >
                              Relic of Vampirism
                            </a>
                          )}. {t('halloween.labyrinth.builds.daredevilPower.weapons')} {vitalityData && vitalityData.icon ? (
                             <a
                               href={vitalityData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={vitalityData.icon}
                                 alt={vitalityData.name}
                                 width={20}
                                 height={20}
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
                               Vitalidad
                             </a>
                           )} {t('common.and')} {fireData && fireData.icon ? (
                             <a
                               href={fireData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={fireData.icon}
                                 alt={fireData.name}
                                 width={20}
                                 height={20}
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
                               Fuego
                             </a>
                          )} {t('halloween.labyrinth.builds.daredevilPower.weapons.secondSet')} {fuerzaData && fuerzaData.icon ? (
                             <a
                               href={fuerzaData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={fuerzaData.icon}
                                 alt={fuerzaData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{fuerzaData.name}</span>
                             </a>
                           ) : (
                             <span className="text-orange-300 font-semibold">fuerza</span>
                           )} {t('common.and')} {precisionData && precisionData.icon ? (
                             <a
                               href={precisionData.wikiUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                             >
                               <Image
                                 src={precisionData.icon}
                                 alt={precisionData.name}
                                 width={20}
                                 height={20}
                                 className="rounded"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                               />
                               <span className="text-orange-300 font-semibold">{precisionData.name}</span>
                             </a>
                           ) : (
                             <span className="text-orange-300 font-semibold">precisión</span>
                           )}{t('halloween.labyrinth.builds.daredevilPower.weapons.bossesNote')}
                         </p>
                         
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {t('halloween.labyrinth.builds.daredevilPower.usageIntroPrefix')} {trait1833Data ? (
                            <a
                              href={trait1833Data.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {trait1833Data.icon && (
                                <Image
                                  src={trait1833Data.icon}
                                  alt={trait1833Data.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{trait1833Data.name || trait1833Name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">{trait1833Name}</span>
                          )}{t('halloween.labyrinth.builds.daredevilPower.autoAttackBow')}{t('halloween.labyrinth.builds.daredevilPower.maxEndurance')} <br/>{t('halloween.labyrinth.builds.daredevilPower.sourcesIntro')}<br/>
                          {vitalityData && vitalityData.icon ? (
                            <a
                              href={vitalityData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              <Image
                                src={vitalityData.icon}
                                alt={vitalityData.name}
                                width={20}
                                height={20}
                                className="rounded"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                              <span className="text-orange-300 font-semibold">{vitalityData.name}</span>
                            </a>
                          ) : (
                            <a
                              href={buildSigilWikiUrl('vitality')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              <span className="text-orange-300 font-semibold">Sello superior de Stamina</span>
                            </a>
                          )}<br />
                          {channeledVigorData ? (
                            <a
                              href={channeledVigorData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {channeledVigorData.icon && (
                                <Image
                                  src={channeledVigorData.icon}
                                  alt={channeledVigorData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{channeledVigorData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Vigor canalizado</span>
                          )} {t('common.and')} <a
                            href={brawlersTenacityData?.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                          >
                            {brawlersTenacityData?.icon && (
                              <Image
                                src={brawlersTenacityData.icon}
                                alt={brawlersTenacityData.name}
                                width={20}
                                height={20}
                                className="rounded"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <span className="text-orange-300 font-semibold">{brawlersTenacityData?.name || 'La tenacidad del luchador'}</span>
                          </a><br />
                          {signetAgilityData ? (
                            <a
                              href={signetAgilityData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {signetAgilityData.icon && (
                                <Image
                                  src={signetAgilityData.icon}
                                  alt={signetAgilityData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{signetAgilityData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Sello de agilidad</span>
                          )}<br />
                          {stealData ? (
                            <a
                              href={stealData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {stealData.icon && (
                                <Image
                                  src={stealData.icon}
                                  alt={stealData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{stealData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Robar</span>
                          )} {t('common.dueTo')} {enduranceThiefData ? (
                            <a
                              href={enduranceThiefData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {enduranceThiefData.icon && (
                                <Image
                                  src={enduranceThiefData.icon}
                                  alt={enduranceThiefData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{enduranceThiefData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Ladrón de resistencia</span>
                          )} <br />
                          {shadowstepData ? (
                            <a
                              href={shadowstepData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {shadowstepData.icon && (
                                <Image
                                  src={shadowstepData.icon}
                                  alt={shadowstepData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{shadowstepData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Paso de sombra</span>
                          )}, {infiltratorsArrowData ? (
                            <a
                              href={infiltratorsArrowData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {infiltratorsArrowData.icon && (
                                <Image
                                  src={infiltratorsArrowData.icon}
                                  alt={infiltratorsArrowData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{infiltratorsArrowData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Flecha del infiltrado</span>
                          )} {t('common.and')} {stealData ? (
                            <a
                              href={stealData.wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {stealData.icon && (
                                <Image
                                  src={stealData.icon}
                                  alt={stealData.name}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              <span className="text-orange-300 font-semibold">{stealData.name}</span>
                            </a>
                          ) : (
                            <span className="text-orange-300 font-semibold">Robar</span>
                          )} {t('halloween.labyrinth.builds.daredevilPower.keepAheadZerg')}.
                        </p>
                         
                         <p className="text-gray-200 text-sm leading-relaxed">
                           {t('halloween.labyrinth.builds.daredevilPower.bowExceptional')} {t('halloween.labyrinth.builds.daredevilPower.useFourAoEDoors')}
                         </p>
                         
                         <div className="space-y-4">
                           <div>
                             <div className="flex items-center justify-between mb-2">
                               <h4 className="text-white font-semibold flex items-center">
                                 <span className="text-lg mr-2">⚙️</span>
                                 {t('halloween.labyrinth.builds.traitsCode')}
                               </h4>
                               <button
                                 onClick={() => {
                                   navigator.clipboard.writeText('[&DQUcPSwWBxuUEgAAWAAAAFcBAABbAQAADgEAAAAAAAAAAAAAAAAAAAAAAAA=]');
                                   setShowCopyModal(true);
                                   // Auto-cerrar el modal después de 2 segundos
                                   setTimeout(() => setShowCopyModal(false), 2000);
                                 }}
                                 className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                               >
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                 </svg>
                                 {t('halloween.labyrinth.builds.copyCode')}
                               </button>
                             </div>
                             <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-3">
                               <code className="text-orange-300 text-sm font-mono break-all">
                                 [&DQUcPSwWBxuUEgAAWAAAAFcBAABbAQAADgEAAAAAAAAAAAAAAAAAAAAAAAA=]
                               </code>
                             </div>
                           </div>
                           
                           <div>
                             <Image
                               src="/thumbnails/skills-y-traits-ladron-p-2-1024x576.webp"
                               alt="Skills y Traits - Temerario Poder"
                               width={1024}
                               height={576}
                               className="w-full h-auto rounded-lg border border-orange-500/30"
                               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                             />
                            <p className="text-gray-200 text-sm leading-relaxed mt-4">
                              {t('halloween.labyrinth.builds.daredevilPower.traits')}
                            </p>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {t('halloween.labyrinth.builds.daredevilPower.usageSummary')}
                            </p>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {t('halloween.labyrinth.builds.daredevilPower.recoverDodges')}
                            </p>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {t('halloween.labyrinth.builds.daredevilPower.bossesUsage')}
                            </p>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div id="temerario-condicion" className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-6">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <Image
                           src="https://wiki-es.guildwars2.com/images/b/b1/Heraldo_icono_%28highres%29.png"
                           alt="Temerario"
                           width={64}
                           height={64}
                           className="mr-2 rounded"
                           onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                         />
                          {t('halloween.labyrinth.builds.daredevilCondi')}
                       </h3>
                       
                       <div className="space-y-2">
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p1')}</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p2')}</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p3')}</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p4')}</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p5')}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-semibold flex items-center">
                              <span className="text-lg mr-2">⚙️</span>
                              {t('halloween.labyrinth.builds.traitsCode')}
                            </h4>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('[&DQkDNg8qNBbcEQAABhIAACsSAADUEQAAyhEAAAECAADUESsSBhIAAAAAAAA=]');
                                setShowCopyModal(true);
                                setTimeout(() => setShowCopyModal(false), 2000);
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {t('halloween.labyrinth.builds.copyCode')}
                            </button>
                          </div>
                          <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-3">
                            <code className="text-orange-300 text-sm font-mono break-all">[&DQkDNg8qNBbcEQAABhIAACsSAADUEQAAyhEAAAECAADUESsSBhIAAAAAAAA=]</code>
                          </div>
                          
                          <div>
                           <Image
                             src="/thumbnails/skills-y-traits-ladron-condi-1-1024x576.webp"
                             alt="Skills y Traits - Temerario Condición"
                             width={1024}
                             height={576}
                             className="w-full h-auto rounded-lg border border-orange-500/30"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                           />
                          </div>
                          <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p6')}</p>
                          <p className="text-gray-200 text-sm leading-relaxed">{t('halloween.labyrinth.herald.p7')}</p>
                         </div>
                       </div>
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
                    {t('halloween.labyrinth.routes.title')}
                   </h2>
                   
                   <div className="prose prose-invert max-w-none mb-8">
                     <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                    {t('halloween.labyrinth.content.routes')}
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
                             The image is in Spanish: <strong>&quot;Puerta&quot;</strong> = <strong>&quot;Door&quot;</strong> | <strong>&quot;Inicio&quot;</strong> = <strong>&quot;Start&quot;</strong>
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Consejos detallados del laberinto */}
                     <div className="bg-gray-800/60 border border-orange-500/30 rounded-lg p-4">
                       <h3 className="text-white font-semibold mb-4 flex items-center">
                         <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
{t('halloween.labyrinth.tips.specific')}
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
{t('halloween.labyrinth.rewards.title')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{t('halloween.labyrinth.rewards.mainDrops')}</h3>
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
{t('halloween.labyrinth.tips.title')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{t('halloween.labyrinth.tips.maximizeEfficiency')}</h3>
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
                      <h3 className="text-xl font-bold text-white">{t('halloween.labyrinth.tips.survival')}</h3>
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
              <h3 className="text-xl font-bold text-white mb-2">{t('halloween.labyrinth.builds.codeCopied')}</h3>
              <p className="text-gray-300 text-sm">
                {t('halloween.labyrinth.builds.codeCopiedDescription')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default LabyrinthGuidePage;
