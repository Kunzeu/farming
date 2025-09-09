'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Award, Star, Crown, Gem, Hammer, ExternalLink, Loader2, Info, Zap } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useI18n } from '@/contexts/I18nContext'
import Navigation from '@/components/layout/Navigation'
import Image from 'next/image'

interface GiftOfMasteryItem {
  id: number
  name: string
  description: string
  icon: string
  rarity: string
  type: string
  level: number
  vendor_value: number
  chat_link: string
  details?: {
    type: string
    flags: string[]
    game_types: string[]
    restrictions: string[]
  }
}

export default function GiftOfMasteryPage() {
  usePageTitle('giftOfMasteryPage.title', 'Gift of Mastery - GOM')
  const { t, lang } = useI18n()
  
  const [item, setItem] = useState<GiftOfMasteryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mapear códigos de idioma de nuestra app a códigos de la API de GW2
  const getGW2LangCode = (lang: string) => {
    const langMap: Record<string, string> = {
      'es': 'es',
      'en': 'en',
      'de': 'de',
      'fr': 'fr'
    }
    return langMap[lang] || 'en'
  }

  // Mapear códigos de idioma a URLs de wiki
  const getWikiUrl = (lang: string, itemName: string) => {
    const wikiMap: Record<string, string> = {
      'es': 'wiki.guildwars2.com',
      'en': 'wiki.guildwars2.com',
      'de': 'wiki-de.guildwars2.com',
      'fr': 'wiki-fr.guildwars2.com'
    }
    const wikiDomain = wikiMap[lang] || 'wiki.guildwars2.com'
    
    // Para las wikis inglesas (es y en), usar siempre el nombre en inglés
    if (lang === 'es' || lang === 'en') {
      return `https://${wikiDomain}/wiki/Gift_of_Mastery`
    }
    
    return `https://${wikiDomain}/wiki/${itemName.replace(/\s+/g, '_')}`
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError(null)

        const gw2Lang = getGW2LangCode(lang)
        const response = await fetch(`https://api.guildwars2.com/v2/items/19674?lang=${gw2Lang}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch item from GW2 API')
        }

        const data = await response.json()
        setItem(data)
      } catch (err) {
        console.error('Error fetching Gift of Mastery item:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [lang])

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-yellow-600'
      case 'ascended':
        return 'from-purple-400 to-purple-600'
      case 'exotic':
        return 'from-orange-400 to-orange-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'masterwork':
        return 'from-green-400 to-green-600'
      case 'fine':
        return 'from-teal-400 to-teal-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const formatVendorValue = (value: number) => {
    const gold = Math.floor(value / 10000)
    const silver = Math.floor((value % 10000) / 100)
    const copper = value % 100
    
    if (gold > 0) {
      return `${gold}g ${silver}s ${copper}c`
    } else if (silver > 0) {
      return `${silver}s ${copper}c`
    } else {
      return `${copper}c`
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
            <p className="text-lg text-gray-300">{t('giftOfMasteryPage.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-4">
              <p className="font-bold">{t('giftOfMasteryPage.error.title')}</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t('giftOfMasteryPage.error.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-lg">
              <Award className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {item ? `${item.name} - GOM` : t('giftOfMasteryPage.title')}
          </h1>

        </motion.div>

        {/* Item Information */}
        {item && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg mb-12"
          >
            <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative w-32 h-32">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 128px, 128px"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <h2 className="text-3xl font-bold text-white">
                    {item.name}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-4 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getRarityColor(item.rarity)} text-white`}>
                    {item.rarity}
                  </span>
                  <span className="text-gray-300">Level {item.level}</span>
                  <span className="text-gray-300">{item.type}</span>
                </div>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <a
                    href={getWikiUrl(lang, item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('giftOfMasteryPage.itemInfo.viewWiki')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">📋 Guía Completa de GOMs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Comprador Card */}
              <div 
                onClick={() => document.getElementById('comprador-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Comprador</h3>
                </div>
                <p className="text-gray-300 text-sm">Materiales necesarios para adquirir un GOM</p>
                <div className="mt-3 text-xs text-gray-400">
                  • 481 Ectoplasmas • 250 T6 • 231 Monedas místicas • 100 oros • Materiales específicos
                </div>
              </div>

              {/* Vendedor Card */}
              <div 
                onClick={() => document.getElementById('vendedor-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                    <Hammer className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white"> Vendedor</h3>
                </div>
                <p className="text-gray-300 text-sm">Requisitos para vender un GOM</p>
                <div className="mt-3 text-xs text-gray-400">
                  • 1 Don Exploración • 1 Don Batalla • 481 Obsidiana • 340 Espirituales • Artesanías 400
                </div>
              </div>

              {/* Proceso Card */}
              <div 
                onClick={() => document.getElementById('proceso-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Proceso</h3>
                </div>
                <p className="text-gray-300 text-sm">Pasos del proceso de compra/venta</p>
                <div className="mt-3 text-xs text-gray-400">
                  • Linkear objetos • Enviar materiales • Crear legendaria • Enviar y pagar
                </div>
              </div>

              {/* Precio Card */}
              <div 
                onClick={() => document.getElementById('precio-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-3">
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Precio</h3>
                </div>
                <p className="text-gray-300 text-sm">Precio actual del GOM</p>
                <div className="mt-3 text-lg font-bold text-yellow-400">
                  450 oros
                </div>
              </div>

              {/* Discord Card */}
              <div 
                onClick={() => document.getElementById('discord-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border border-indigo-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Discord</h3>
                </div>
                <p className="text-gray-300 text-sm">Plataforma recomendada</p>
                <div className="mt-3 text-xs text-gray-400">
                  Overflow Trading Company - 20,000+ miembros
                </div>
              </div>

              {/* Consejos Card */}
              <div 
                onClick={() => document.getElementById('consejos-detallado')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Consejos</h3>
                </div>
                <p className="text-gray-300 text-sm">Mejores prácticas para trading</p>
                <div className="mt-3 text-xs text-gray-400">
                  • Contrato en chat • Capturas de pantalla • Pago después de recibir
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Haz clic en cualquier tarjeta para ver información detallada
              </p>
            </div>
          </div>
        </motion.div>

        {/* Guía Detallada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-8 mb-12"
        >
          {/* Comprador Detallado */}
          <div id="comprador-detallado" className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">¿Qué necesita el comprador?</h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Cuando quieres pagar a otro jugador por su <span className="text-yellow-400 font-semibold">Don del Dominio</span> necesitarás prácticamente todo lo que se pueda pagar a la hora de hacer una legendaria. Aquí dejo una lista de que objetos comprar para que tengáis en cuenta lo necesario:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">481 Pegotes de Ectoplasma</span>
                      <p className="text-gray-400 text-sm">(231 de estos solo si el vendedor NO incluye tréboles místicos)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">250 de cada T6</span>
                      <p className="text-gray-400 text-sm">(Tótems, Huesos, Sangres, Polvos, Garras, Colmillos, Escamas, Vesículas de veneno)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">231 monedas místicas</span>
                      <p className="text-gray-400 text-sm">(Solo si el vendedor NO incluye sus tréboles)</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">100 oros</span>
                      <p className="text-gray-400 text-sm">(Para las Piedras Rúnicas Heladas)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">Materiales específicos</span>
                      <p className="text-gray-400 text-sm">(Metal/Energía/Madera & El específico de cada uno)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold text-lg">•</span>
                    <div>
                      <span className="text-white font-semibold">Sello del arma + Precursora</span>
                      <p className="text-gray-400 text-sm">(El arma precursora correspondiente)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendedor Detallado */}
          <div id="vendedor-detallado" className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">¿Qué necesita el vendedor?</h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
              <p className="text-gray-300 mb-6 leading-relaxed">
                En el caso de que seas el vendedor, tendrás que tener todo esto preparado:
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">1.</span>
                      <span className="text-white font-semibold">1 Don de Exploración</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">2.</span>
                      <span className="text-white font-semibold">1 Don de Batalla</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">3.</span>
                      <div>
                        <span className="text-white font-semibold">481 Esquirlas de Obsidiana</span>
                        <p className="text-gray-400 text-sm">(231 solo si NO vas a poner tus tréboles)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">4.</span>
                      <div>
                        <span className="text-white font-semibold">340 Esquirlas Espirituales</span>
                        <p className="text-gray-400 text-sm">(140 solo si NO vas a poner tus tréboles)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">5.</span>
                      <span className="text-white font-semibold">500 monedas de mazmorra</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">6.</span>
                      <span className="text-white font-semibold">Artesanías al 400</span>
                      <p className="text-gray-400 text-sm">(Las que necesite cada arma)</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold text-lg">7.</span>
                      <div>
                        <span className="text-white font-semibold">Recetas de los dones</span>
                        <p className="text-gray-400 text-sm">(Son 2 por legendaria, 10 oros cada receta en Miyani)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold text-lg">OPCIONAL:</span>
                      <div>
                        <span className="text-white font-semibold">77 Tréboles Místicos</span>
                        <p className="text-gray-400 text-sm">(Estos se pagan a parte como extra)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proceso Detallado */}
          <div id="proceso-detallado" className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">¿Cómo se lleva a cabo el proceso?</h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Una vez estéis los dos en grupo y preparados para ello llevaremos un proceso muy sencillo:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-purple-400 font-bold text-lg">1.</span>
                  <p className="text-gray-300">El vendedor linkeará por chat todos los objetos para ver que tiene todo.</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-purple-400 font-bold text-lg">2.</span>
                  <p className="text-gray-300">El comprador le mandará los materiales al vendedor, ya sea don por don o todos de golpe.</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-purple-400 font-bold text-lg">3.</span>
                  <p className="text-gray-300">El vendedor creará la legendaria que se le pida con estos siguiendo una guía de creación de legendarias, recomiendo la wikipedia de Guild Wars 2</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-purple-400 font-bold text-lg">4.</span>
                  <p className="text-gray-300">Una vez esté la legendaria hecha, se enviará al comprador</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-purple-400 font-bold text-lg">5.</span>
                  <p className="text-gray-300">Cuando comprador reciba la legendaria, este mandará el pago acordado por este GOM</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Nota importante:</strong> Un punto muy importante es la creación de tréboles místicos. Cuando se manda las 231 monedas y 231 ectos al vendedor, este tendrá que tirar a forja hasta que salgan los 77 tréboles. Si sobrasen monedas y ectoplasmas se los quedaría igual que TODO lo que salga en la forja. Si NO llegase, tendría que poner los que faltan de su bolsillo.
                </p>
              </div>
            </div>
          </div>

          {/* Precio y Discord */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Precio */}
            <div id="precio-detallado" className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">💰 Precio Actual</h2>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">450 oros</div>
                <p className="text-gray-300 text-sm">(Se irá actualizando cada vez que cambie)</p>
              </div>
            </div>

            {/* Discord */}
            <div id="discord-detallado" className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">💬 Donde comprar/vender GOMs</h2>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                <p className="text-gray-300 mb-4">
                  Si tenéis pensado comprar o vender vuestros dones del dominio os recomiendo sin duda el discord de Overflow Trading Company.
                </p>
                <p className="text-gray-400 text-sm">Un servidor de discord dedicado al trading con más de 20,000 miembros</p>
                <div className="text-center">
                  <a
                    href="https://discord.gg/gw2overflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-indigo-400 mb-2 hover:text-indigo-300 transition-colors inline-block cursor-pointer"
                  >
                    Overflow Trading Company
                  </a>
                  <p className="text-indigo-300 text-xs mt-2">👆 Haz clic aquí para unirte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consejos */}
          <div id="consejos-detallado" className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">💡 Consejos</h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Por último me gustaría daros unos pocos de consejos para llevar el trade lo mejor posible:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-lg font-semibold text-white mb-2">1. Contrato en Chat</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Antes de hacer el trade, haced un &quot;contrato&quot; en el chat de equipo. Esto es una prueba para que Arenanet esté más abierta a interceder en caso de haber un timo.
                  </p>
                  <div className="bg-slate-700/50 p-3 rounded text-xs text-gray-300 font-mono">
                    Hola nombre.1234 vamos a hacer LEGENDARIA con tu Don del Dominio a cambio de X oro. Te mandaré los materiales y cuando la tengas me la mandas y te mando el pago. De acuerdo?
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    El otro jugador tendrá que poner &quot;Si&quot; &quot;Okey&quot; &quot;Ok&quot; &quot;Vale&quot; o cualquier cosa afirmativa. Luego haremos captura de pantalla.
                  </p>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-lg font-semibold text-white mb-2">2. Capturas de Pantalla</h3>
                  <p className="text-gray-300 text-sm">
                    Siempre captura de pantalla cuando vayamos a enviar los correos (antes de darle al botón). Esto es para asegurarte de que tienes una prueba y por si te confundes enviando a quien no es o si mandas mal los materiales poder revisar.
                  </p>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-lg font-semibold text-white mb-2">3. Orden de Pago</h3>
                  <p className="text-gray-300 text-sm">
                    Siempre se paga después de recibir la legendaria, en caso de ser por Overflow se podría aceptar que se mande el pago primero si el comprador no tiene reputación y el vendedor si.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-pink-400 font-semibold">¡Mucha suerte con la venta y compra de GOMs!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {item ? `${item.name} - Información Adicional` : 'Información Adicional'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4">
                <Info className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Acerca del Item
              </h3>
              <p className="text-gray-300">
                {item ? item.description : 'Un don que se utiliza para crear armas legendarias. Se fabrica combinando estos elementos en la Forja Mística: • 1 esquirla de hematites • 250 esquirlas de obsidiana • 1 don de la exploración • 1 don de la batalla'}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Significado
              </h3>
              <p className="text-gray-300">
                Este item representa no solo habilidad técnica, sino también la dedicación a la comunidad y el deseo de compartir conocimiento.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
