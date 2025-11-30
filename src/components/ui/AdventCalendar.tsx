"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import Link from "next/link";

interface AdventDay {
  day: number;
  date: Date;
  isAvailable: boolean;
  isClosed: boolean;
  isParticipated: boolean;
  giveawayId?: string;
  participantCount?: number;
  winners?: Array<{
    position: number;
    accountName: string;
  }>;
  prizes?: Array<{
    itemId?: number;
    quantity?: number;
    gemPrize?: boolean;
    itemIcon?: string;
  }>;
}

interface AdventCalendarProps {
  year?: number;
  month?: number; // 11 = diciembre
  className?: string;
}

export default function AdventCalendar({
  year = 2025,
  month = 11, // Diciembre
  className = ""
}: AdventCalendarProps) {
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const [adventDays, setAdventDays] = useState<AdventDay[]>([]);
  const [participatedDays, setParticipatedDays] = useState<Set<string>>(new Set());
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{ id: string; name: string } | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [giveaways, setGiveaways] = useState<Record<string, {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    participantCount: number;
    prizes: Array<{
      itemId?: number;
      quantity?: number;
      gemPrize?: boolean;
      itemIcon?: string;
    }>;
  }>>({});
  const [winners, setWinners] = useState<Record<string, Array<{ position: number; accountName: string }>>>({});
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const [isLoadingParticipations, setIsLoadingParticipations] = useState(true);

  // Cargar sorteos desde la API
  useEffect(() => {
    const loadGiveaways = async () => {
      try {
        const response = await fetch("/api/giveaways");
        if (response.ok) {
          const data = await response.json();
          const giveawaysMap: Record<string, {
            id: string;
            startDate: string;
            endDate: string;
            status: string;
            participantCount: number;
            prizes: Array<{
              itemId?: number;
              quantity?: number;
              gemPrize?: boolean;
              itemIcon?: string;
            }>;
          }> = {};

          data.giveaways?.forEach((giveaway: {
            id: string;
            startDate: string;
            endDate: string;
            status: string;
            participantCount: number;
            prizes: Array<{
              itemId?: number;
              quantity?: number;
              gemPrize?: boolean;
              itemIcon?: string;
            }>;
          }) => {
            if (giveaway.id.startsWith('advent-')) {
              giveawaysMap[giveaway.id] = giveaway;
            }
          });

          setGiveaways(giveawaysMap);
        }
      } catch (error) {
        console.error("Error loading giveaways:", error);
      }
    };

    loadGiveaways();
  }, []);

  // Cargar ganadores
  useEffect(() => {
    const loadWinners = async () => {
      try {
        const response = await fetch("/api/giveaways/winners");
        if (response.ok) {
          const data = await response.json();
          const winnersMap: Record<string, Array<{ position: number; accountName: string }>> = {};

          data.winners?.forEach((winner: {
            giveawayId: string;
            position: number;
            accountName: string;
          }) => {
            if (!winnersMap[winner.giveawayId]) {
              winnersMap[winner.giveawayId] = [];
            }
            winnersMap[winner.giveawayId].push({
              position: winner.position,
              accountName: winner.accountName
            });
          });

          setWinners(winnersMap);
        }
      } catch (error) {
        console.error("Error loading winners:", error);
      }
    };

    loadWinners();
  }, []);

  // Inicializar días del adviento con datos de sorteos
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const days: AdventDay[] = [];
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      const dayStr = day.toString().padStart(2, '0');
      const giveawayId = `advent-${year}-12-${dayStr}`;
      const giveaway = giveaways[giveawayId];

      const isAvailable = giveaway && (
        new Date(giveaway.startDate) <= today ||
        (currentYear === year && currentMonth === month && day <= currentDay)
      );

      const isClosed = giveaway && (
        (currentYear === year && currentMonth === month && day < currentDay) ||
        new Date(giveaway.endDate) < today ||
        giveaway.status === 'ended' ||
        giveaway.status === 'winners_announced'
      );

      const prizes = giveaway?.prizes?.slice(0, 3).map((p: {
        itemId?: number;
        quantity?: number;
        gemPrize?: boolean;
        itemIcon?: string;
      }) => ({
        itemId: p.itemId,
        quantity: p.quantity,
        gemPrize: p.gemPrize,
        itemIcon: p.itemIcon
      })) || [
        { itemId: 19721, quantity: 250, gemPrize: false },
        { quantity: 1, gemPrize: true },
        { itemId: 19721, quantity: 25, gemPrize: false }
      ];

      days.push({
        day,
        date,
        isAvailable,
        isClosed,
        isParticipated: participatedDays.has(giveawayId),
        giveawayId,
        participantCount: giveaway?.participantCount || 0,
        winners: winners[giveawayId]?.sort((a, b) => a.position - b.position).slice(0, 3),
        prizes
      });
    }
    setAdventDays(days);
  }, [year, month, giveaways, participatedDays, winners]);

  // Verificar API key y cuenta
  useEffect(() => {
    const controller = new AbortController();
    const checkApiKey = async () => {
      setIsLoadingApiKey(true);

      if (!isAuthenticated || !user?.id) {
        setHasApiKey(false);
        setApiKeyValid(false);
        setIsLoadingApiKey(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}/summary`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setHasApiKey(Boolean(data.hasApiKey));
          setApiKeyValid(Boolean(data.apiKeyValid));
          setAccountInfo(data.accountInfo || null);
        } else {
          setHasApiKey(false);
          setApiKeyValid(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error("Error checking API key:", error);
        setHasApiKey(false);
        setApiKeyValid(false);
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    checkApiKey();
    return () => controller.abort();
  }, [isAuthenticated, user?.id]);

  // Cargar participaciones del usuario
  useEffect(() => {
    const controller = new AbortController();
    const loadParticipations = async () => {
      setIsLoadingParticipations(true);
      if (!user?.id || !isAuthenticated) {
        setIsLoadingParticipations(false);
        return;
      }

      const cacheKey = `participated_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);

      if (cached && cacheTime) {
        const timeDiff = Date.now() - parseInt(cacheTime);
        if (timeDiff < 90000) { // 90 seconds cache
          const cachedArray = JSON.parse(cached) as string[];
          const participatedSet = new Set<string>(cachedArray);
          setParticipatedDays(participatedSet);
          setIsLoadingParticipations(false);
          return;
        }
      }

      try {
        const response = await fetch(`/api/giveaways/participants?userId=${user.id}`, {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          const participatedSet = new Set<string>(
            data.participants.map((p: { giveawayId: string }) => p.giveawayId)
          );

          localStorage.setItem(
            cacheKey,
            JSON.stringify(Array.from(participatedSet))
          );
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

          setParticipatedDays(participatedSet);
        } else {
          setParticipatedDays(new Set<string>());
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error("Error loading participations:", error);
        setParticipatedDays(new Set());
      } finally {
        setIsLoadingParticipations(false);
      }
    };

    if (isAuthenticated && user?.id) {
      loadParticipations();
    } else {
      setParticipatedDays(new Set());
      setIsLoadingParticipations(false);
    }
    return () => controller.abort();
  }, [isAuthenticated, user?.id]);

  // Manejar participación en sorteo
  const handleParticipate = async (day: number) => {
    const dayData = adventDays.find(d => d.day === day);
    if (!dayData || !dayData.giveawayId) {
      return;
    }

    if (!isAuthenticated || !user?.id) {
      window.location.href = "/login";
      return;
    }

    if (!hasApiKey || !apiKeyValid) {
      window.location.href = "/profile";
      return;
    }

    if (!accountInfo) {
      alert("Información de cuenta no disponible. Por favor intenta de nuevo.");
      return;
    }

    if (participatedDays.has(dayData.giveawayId)) {
      alert("¡Ya te has apuntado a este sorteo!");
      return;
    }

    setIsParticipating(true);
    try {
      const response = await fetch("/api/giveaways/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giveawayId: dayData.giveawayId,
          userId: user.id,
          accountName: accountInfo.name,
        }),
      });

      if (response.ok) {
        const newParticipatedDays = new Set(participatedDays);
        newParticipatedDays.add(dayData.giveawayId);
        setParticipatedDays(newParticipatedDays);

        setAdventDays(prev => prev.map(d =>
          d.day === day
            ? { ...d, isParticipated: true, participantCount: (d.participantCount || 0) + 1 }
            : d
        ));

        // Update cache
        const cacheKey = `participated_${user.id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const cachedArray = JSON.parse(cached) as string[];
          if (!cachedArray.includes(dayData.giveawayId)) {
            cachedArray.push(dayData.giveawayId);
            localStorage.setItem(cacheKey, JSON.stringify(cachedArray));
            localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          }
        }

        alert(`¡Te has apuntado al sorteo del día ${day}!`);
      } else {
        const errorData = await response.json();
        console.error("Error participating in giveaway:", errorData);
        alert(errorData.error || "Error al apuntarse al sorteo. Por favor intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error participating in giveaway:", error);
      alert("Error al apuntarse al sorteo. Por favor intenta de nuevo.");
    } finally {
      setIsParticipating(false);
    }
  };


  return (
    <div className={`mb-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {t("holidayCalendar.title", `Calendario de Adviento - Diciembre ${year}`).replace("{year}", year.toString())}
        </h2>
        <p className="text-gray-300 text-lg mb-4">
          {t("holidayCalendar.subtitle", "¡Abre un sorteo cada día y apúntate para ganar premios increíbles!")}
        </p>
        <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg px-6 py-4 max-w-3xl mx-auto">
          <p className="text-yellow-300 font-semibold text-lg">
            {t("holidayCalendar.participateEveryDay", "⚠️ IMPORTANTE: Debes participar TODOS LOS DÍAS para tener más oportunidades de ganar")}
          </p>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {adventDays.slice(0, 21).map((day, index) => {
          const dayWinners = day.winners || [];
          const isClosed = day.isClosed || dayWinners.length > 0;

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="relative"
            >
              {/* Tarjeta usando la imagen completa */}
              <div className={`
                relative rounded-xl overflow-hidden
                transition-all duration-300
                w-full
                aspect-[3/4]
                ${!isClosed ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : 'cursor-default'}
              `}>
                {/* Imagen de fondo completa sin modificaciones */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/assets/X.webp"
                    alt={`Día ${day.day}`}
                    fill
                    className="object-contain"
                    priority={index < 7}
                  />
                </div>

                {/* Contenido posicionado absolutamente sobre la imagen respetando sus espacios */}
                <div className="relative z-10 w-full h-full">

                  {/* Título */}
                  <div className="absolute top-8 md:top-10 left-1/2 transform -translate-x-1/2 w-full px-2">
                    <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight text-center">
                      SORTEOS - DÍA {day.day}
                    </h3>
                  </div>

                  {/* Botón APUNTATE - Sobre la imagen */}
                  {!isClosed && (
                    <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] px-2">
                      {!isAuthenticated ? (
                        <Link
                          href="/login"
                          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors w-full"
                        >
                          INICIA SESIÓN
                        </Link>
                      ) : isLoadingApiKey || isLoadingParticipations ? (
                        <div className="inline-flex items-center justify-center gap-2 bg-gray-600 text-gray-300 font-semibold py-2.5 rounded-lg w-full">
                          Cargando...
                        </div>
                      ) : !hasApiKey || !apiKeyValid ? (
                        <Link
                          href="/profile"
                          className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 rounded-lg transition-colors w-full"
                        >
                          VINCULA API KEY
                        </Link>
                      ) : participatedDays.has(day.giveawayId || '') ? (
                        <div className="inline-flex items-center justify-center gap-2 bg-gray-600 text-gray-300 font-semibold py-2.5 rounded-lg w-full">
                          APUNTADO
                        </div>
                      ) : (
                        <button
                          onClick={() => handleParticipate(day.day)}
                          disabled={isParticipating}
                          className={`
                            w-full py-2.5 rounded-lg
                            font-bold text-white text-sm
                            transition-all duration-200
                            bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 active:scale-95 shadow-lg
                          `}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>-</span>
                            <span>APUNTATE</span>
                            <span>-</span>
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Lista de ganadores */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] px-2">
                    {dayWinners.length > 0 ? (
                      <div className="space-y-1">
                        {dayWinners.slice(0, 3).map((winner) => (
                          <div key={winner.position} className="text-xs text-gray-900 text-center font-medium leading-tight">
                            <span className="font-bold">{winner.position}º GANADOR</span> - {winner.accountName}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 text-center">
                        {isClosed ? 'Sorteo cerrado' : 'Sin ganadores aún'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

