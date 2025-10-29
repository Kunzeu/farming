"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Users} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useI18n } from "@/contexts/I18nContext";

// Datos de las ubicaciones
const locationsData = [
  {
    id: "draconis-mons",
    name: "Draconis Mons",
    map: "Draconis Mons",
    type: "Recompensa Diaria",
    totalCharacters: 453,
    dailyReward: "2-5g",
    timeRequired: "5 minutos",
    descriptionKey: "altParking.locations.draconisMonsDescription",
    rewards: ["Magia Liberada", "Fire Orchid Blossom", "Unids", "Crystal", "Orbs"],
    image: "/images/backgrounds/GuildWars2.webp"
  },
  
];

export default function AltParkingLocationsPage() {
  const { t } = useI18n();
  usePageTitle("pageTitles.altParkingLocations", "Ubicaciones Alt Parking");


  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Link
                href="/alt-parking"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/90 border border-purple-500/30 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("altParking.backToAltParking", "Volver a Alt Parking")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <MapPin className="h-10 w-10 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-center">
                <span
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {t("altParking.locations.title", "Ubicaciones Alt Parking")}
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center px-4"
            >
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t("altParking.locations.subtitle", "Descubre las mejores ubicaciones para posicionar tus personajes alternativos y maximizar tus recompensas.")}
              </p>
            </motion.div>
          </div>

          {/* Lista de Ubicaciones */}
          <div className="space-y-4">
            {locationsData.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <Link href={`/alt-parking/locations/${location.id}`}>
                  <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 hover:bg-slate-700/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                            {location.name}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">{location.map}</p>
                               <p className="text-gray-300 text-sm">{t(location.descriptionKey, location.descriptionKey)}</p>
                      </div>
                       <div className="flex items-center gap-4">
                         <div className="text-right">
                           <div className="flex items-center gap-1 text-xs text-gray-400">
                             <Users className="w-3 h-3" />
                             <span>{location.totalCharacters}</span>
                           </div>
                         </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
