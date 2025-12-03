"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import Link from "next/link";
import { Crown, AlertCircle, Users } from "lucide-react";

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
    itemIcon?: string;
    gemPrize?: boolean;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
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
  const [isSelectingWinners, setIsSelectingWinners] = useState(false);
  const [showSelectWinnersModal, setShowSelectWinnersModal] = useState(false);
  const [showWinnersResultModal, setShowWinnersResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWinners, setSelectedWinners] = useState<Array<{
    giveaway_id: string;
    user_id: string;
    account_name: string;
    position: number;
    prize_description: string;
    prize_value: string;
    item_id?: number | null;
    quantity?: number | null;
    gem_prize?: boolean;
    item_icon?: string | null;
  }>>([]);
  const [giveawayToSelectWinners, setGiveawayToSelectWinners] = useState<string | null>(null);
  const [autoParticipatedGiveaways, setAutoParticipatedGiveaways] = useState<Set<string>>(new Set());

  // Cargar sorteos desde la API
  useEffect(() => {
    const loadGiveaways = async () => {
      try {
        const response = await fetch("/api/giveaways", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
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

    // Recargar cada 30 segundos para actualizar contadores
    const interval = setInterval(loadGiveaways, 30000);

    return () => clearInterval(interval);
  }, []);

  // Cargar ganadores
  useEffect(() => {
    const loadWinners = async () => {
      try {
        const response = await fetch("/api/giveaways/winners", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const winnersMap: Record<string, Array<{ position: number; accountName: string; itemIcon?: string; gemPrize?: boolean }>> = {};

          data.winners?.forEach((winner: {
            giveawayId: string;
            position: number;
            accountName: string;
            itemIcon?: string;
            gemPrize?: boolean;
          }) => {
            if (!winnersMap[winner.giveawayId]) {
              winnersMap[winner.giveawayId] = [];
            }
            winnersMap[winner.giveawayId].push({
              position: winner.position,
              accountName: winner.accountName,
              itemIcon: winner.itemIcon,
              gemPrize: winner.gemPrize
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

    const days: AdventDay[] = [];
    for (let day = 1; day <= 32; day++) {
      const date = new Date(year, month, day);
      const dayStr = day.toString().padStart(2, '0');
      const giveawayId = `advent-${year}-12-${dayStr}`;
      const giveaway = giveaways[giveawayId];

      // Comparar fechas completas (con hora) en lugar de solo el día del mes
      const giveawayStartDate = giveaway ? new Date(giveaway.startDate) : null;
      const giveawayEndDate = giveaway ? new Date(giveaway.endDate) : null;

      // El día 25 siempre está disponible (aunque no sea la fecha actual)
      const isAvailable = day === 25
        ? Boolean(giveaway)
        : Boolean(giveaway && giveawayStartDate && (
          giveawayStartDate.getTime() <= today.getTime()
        ));

      const isClosed = Boolean(giveaway && (
        (giveawayEndDate && giveawayEndDate.getTime() <= today.getTime()) ||
        giveaway.status === 'ended' ||
        giveaway.status === 'winners_announced'
      ));

      const prizes = giveaway?.prizes?.map((p: {
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
          { itemId: 19721, quantity: 250, gemPrize: false }
        ];

      const participantCount = giveaway?.participantCount ?? 0;

      days.push({
        day,
        date,
        isAvailable,
        isClosed,
        isParticipated: participatedDays.has(giveawayId),
        giveawayId,
        participantCount,
        winners: winners[giveawayId]?.sort((a, b) => a.position - b.position),
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

  // Auto-inscripción de todos los usuarios Patreon desde el servidor
  // Busca en la base de datos todos los usuarios Patreon activos (Bronze/Silver/Gold/Legends + active_patron)
  // y los inscribe automáticamente en sorteos disponibles
  useEffect(() => {
    const autoEnrollAllPatreons = async () => {
      // Esperar a que se carguen los datos
      if (isLoadingApiKey || isLoadingParticipations || adventDays.length === 0) {
        return;
      }

      // Encontrar sorteos disponibles que no se hayan procesado ya
      // Para auto-inscripción, consideramos sorteos que:
      // 1. Tengan giveawayId
      // 2. Existan en giveaways (estén configurados)
      // 3. No estén cerrados (no tengan ganadores, no hayan terminado)
      // 4. No se hayan procesado ya

      const todayUTC = new Date(); // Fecha actual
      const availableGiveaways = adventDays
        .filter(day => {
          const giveaway = day.giveawayId ? giveaways[day.giveawayId] : null;
          const hasGiveaway = !!giveaway;

          // Verificar si la fecha de inicio ya pasó (incluso si el estado es "upcoming")
          // Comparar ambas fechas en UTC para evitar problemas de zona horaria
          const giveawayStartDate = giveaway ? new Date(giveaway.startDate) : null;
          const startDatePassed = giveawayStartDate ? giveawayStartDate.getTime() <= todayUTC.getTime() : false;

          // Verificar si el día del calendario ya pasó o es hoy (comparando solo día, mes y año, sin hora)
          const todayYear = todayUTC.getUTCFullYear();
          const todayMonth = todayUTC.getUTCMonth();
          const todayDay = todayUTC.getUTCDate();
          // month es 11 (diciembre) porque es 0-indexed
          const dayDatePassed = todayYear > year ||
            (todayYear === year && todayMonth > month) ||
            (todayYear === year && todayMonth === month && todayDay >= day.day);

          const isActive = giveaway?.status === 'active';
          const isUpcomingButStarted = giveaway?.status === 'upcoming' && (startDatePassed || dayDatePassed);
          const isNotClosed = !day.isClosed && !day.winners?.length;
          const notProcessed = !autoParticipatedGiveaways.has(day.giveawayId || '');

          // Considerar disponible si:
          // - Tiene giveaway
          // - Está activo O la fecha de inicio ya pasó (incluso si es "upcoming")
          // - O si es el día actual o ya pasó (para sorteos diarios)
          // - No está cerrado
          // - No se ha procesado ya
          const isAvailable = hasGiveaway &&
            (isActive || isUpcomingButStarted || day.isAvailable || dayDatePassed) &&
            isNotClosed &&
            day.giveawayId &&
            notProcessed;

          return isAvailable;
        })
        .map(day => day.giveawayId!)
        .filter((id): id is string => !!id);

      if (availableGiveaways.length === 0) {
        return;
      }

      // Marcar estos sorteos como procesados antes de llamar al servidor
      const newAutoParticipated = new Set(autoParticipatedGiveaways);
      availableGiveaways.forEach(giveawayId => {
        newAutoParticipated.add(giveawayId);
      });
      setAutoParticipatedGiveaways(newAutoParticipated);

      try {
        const response = await fetch("/api/giveaways/auto-enroll-patreons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            giveawayIds: availableGiveaways,
          }),
        });

        if (response.ok) {
          await response.json();

          // Recargar participaciones del usuario actual si está autenticado
          if (isAuthenticated && user?.id) {
            const participationsResponse = await fetch(`/api/giveaways/participants?userId=${user.id}`, {
              cache: "no-cache",
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
            if (participationsResponse.ok) {
              const data = await participationsResponse.json();
              const participatedSet = new Set<string>(
                data.participants.map((p: { giveawayId: string }) => p.giveawayId)
              );
              setParticipatedDays(participatedSet);
            }
          }

          // Recargar sorteos para actualizar contadores
          const giveawaysResponse = await fetch("/api/giveaways", {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
          if (giveawaysResponse.ok) {
            const giveawaysData = await giveawaysResponse.json();
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
            giveawaysData.giveaways?.forEach((giveaway: {
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
        }
      } catch (error) {
        console.error("Error auto-enrolling Patreons:", error);
      }
    };

    // Ejecutar después de un delay para asegurar que todo esté cargado
    const delay = isLoadingApiKey || isLoadingParticipations ? 2000 : 1500;
    const timeoutId = setTimeout(() => {
      autoEnrollAllPatreons();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isLoadingApiKey, isLoadingParticipations, adventDays, autoParticipatedGiveaways, isAuthenticated, user?.id, year, month]);

  // Abrir modal de confirmación
  const handleParticipateClick = (day: number) => {
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

    setSelectedDay(day);
    setShowConfirmModal(true);
  };

  // Confirmar y participar en sorteo
  const handleConfirmParticipate = async () => {
    if (!selectedDay) return;

    const dayData = adventDays.find(d => d.day === selectedDay);
    if (!dayData || !dayData.giveawayId || !user?.id || !accountInfo) {
      return;
    }

    setShowConfirmModal(false);
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

        // Recargar sorteos desde la API para obtener el contador real actualizado
        const giveawaysResponse = await fetch("/api/giveaways", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (giveawaysResponse.ok) {
          const giveawaysData = await giveawaysResponse.json();
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
          giveawaysData.giveaways?.forEach((giveaway: {
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

        // No mostrar alert, el accountName se mostrará en el botón
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
      setSelectedDay(null);
    }
  };

  // Verificar si el usuario es admin
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  // Función para mostrar modal de selección de ganadores
  const handleSelectWinnersClick = (giveawayId: string) => {
    setGiveawayToSelectWinners(giveawayId);
    setShowSelectWinnersModal(true);
  };

  // Función para confirmar y seleccionar ganadores
  const handleConfirmSelectWinners = async () => {
    if (!giveawayToSelectWinners) return;

    try {
      setIsSelectingWinners(true);
      setShowSelectWinnersModal(false);

      // Obtener token de localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('gw2_token') : null;

      // Preparar headers con autenticación
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/giveaways/select-winners", {
        method: "POST",
        headers,
        body: JSON.stringify({
          giveawayId: giveawayToSelectWinners,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido al seleccionar ganadores' }));
        console.error("Error selecting winners:", errorData);
        setErrorMessage(errorData.error || errorData.details || "Error al seleccionar ganadores. Por favor intenta de nuevo.");
        setShowErrorModal(true);
        setIsSelectingWinners(false);
        return;
      }

      const data = await response.json();

      if (!data.winners || data.winners.length === 0) {
        setErrorMessage(data.message || "No se pudieron seleccionar ganadores. Verifica que el sorteo tenga premios configurados y participantes.");
        setShowErrorModal(true);
        setIsSelectingWinners(false);
        return;
      }

      setSelectedWinners(data.winners || []);
      setShowWinnersResultModal(true);

      // Recargar ganadores y sorteos para mostrar datos actualizados
      const winnersResponse = await fetch("/api/giveaways/winners", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      if (winnersResponse.ok) {
        const winnersData = await winnersResponse.json();
        const winnersMap: Record<string, Array<{ position: number; accountName: string; itemIcon?: string; gemPrize?: boolean }>> = {};
        winnersData.winners?.forEach((winner: {
          giveawayId: string;
          position: number;
          accountName: string;
          itemIcon?: string;
          gemPrize?: boolean;
        }) => {
          if (!winnersMap[winner.giveawayId]) {
            winnersMap[winner.giveawayId] = [];
          }
          winnersMap[winner.giveawayId].push({
            position: winner.position,
            accountName: winner.accountName,
            itemIcon: winner.itemIcon,
            gemPrize: winner.gemPrize
          });
        });
        setWinners(winnersMap);
      }

      const giveawaysResponse = await fetch("/api/giveaways", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      if (giveawaysResponse.ok) {
        const giveawaysData = await giveawaysResponse.json();
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
        giveawaysData.giveaways?.forEach((giveaway: {
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
      console.error("Error selecting winners:", error);
      setIsSelectingWinners(false);
      setErrorMessage(
        "Error seleccionando ganadores. Por favor intenta de nuevo."
      );
      setShowErrorModal(true);
    } finally {
      setIsSelectingWinners(false);
      setGiveawayToSelectWinners(null);
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
        {adventDays
          .filter(day => {
            // Filtrar día 32: solo visible para administradores
            if (day.day === 32) {
              return isAdmin;
            }
            return true;
          })
          .map((day, index) => {
            const dayWinners = day.winners || [];
            const isClosed = day.isClosed || dayWinners.length > 0;
            // El botón aparece en todos los días que tengan giveaway, estén disponibles y no estén cerrados
            const showButton = day.giveawayId && day.isAvailable && !isClosed;
            // Para admin: mostrar botón en todas las tarjetas
            const showAdminButton = isAdmin && day.giveawayId;
            // El botón está habilitado solo si el día está cerrado, no hay ganadores y hay participantes
            const canSelectWinners = day.isClosed && dayWinners.length === 0 && (day.participantCount || 0) > 0;

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
                aspect-[3/5]
                ${!isClosed ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : 'cursor-default'}
              `}>
                  {/* Imagen de fondo completa sin modificaciones */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={
                        day.day === 1 ? "/images/assets/day1.webp" :
                          day.day === 2 ? "/images/assets/day2.webp" :
                            (day.day === 3 && day.isAvailable) ? "/images/assets/day3.webp" :
                              (day.day === 4 && day.isAvailable) ? "/images/assets/day4.webp" :
                                (day.day === 5 && day.isAvailable) ? "/images/assets/day5.webp" :
                                  day.day === 7 ? "/images/assets/daily.webp" :
                                    day.day === 14 ? "/images/assets/daily.webp" :
                                      (day.day === 17 && day.isAvailable) ? "/images/assets/day17.webp" :
                                        day.day === 21 ? "/images/assets/daily.webp" :
                                          day.day === 25 ? "/images/assets/day25.webp?v=2" :
                                            day.day === 28 ? "/images/assets/daily.webp" :
                                              day.day === 31 ? "/images/assets/daily.webp" :
                                                (day.day === 32 && isAdmin) ? "/images/assets/day3.webp" :

                                                  "/images/assets/soon.webp"
                      }
                      alt={`Día ${day.day}`}
                      fill
                      className="object-contain"
                      priority={index < 7}
                      unoptimized={day.day === 28}
                    />
                  </div>

                  {/* Contenido posicionado absolutamente sobre la imagen respetando sus espacios */}
                  <div className="relative z-10 w-full h-full">

                    {/* Indicador de CERRADO (cuando está cerrado y tiene ganadores) */}
                    {isClosed && dayWinners.length > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600/95 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-red-400/50 z-30">
                        <span className="text-xs font-bold">
                          {t("holidayCalendar.closed", "CERRADO")}
                        </span>
                      </div>
                    )}

                    {/* Indicador de participantes */}
                    {day.giveawayId && (
                      <div className="absolute top-3 right-3 bg-blue-600/95 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-blue-400/50 z-30">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">
                          {day.participantCount ?? 0}
                        </span>
                      </div>
                    )}

                    {/* Botón APUNTATE - Sobre la imagen */}
                    {showButton && (
                      <div className="absolute top-[64%] sm:top-[calc(65%_-_6px)] left-1/2 transform -translate-x-1/2 w-[90%] px-2">
                        {!isAuthenticated ? (
                          <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors w-full"
                          >
                            {t("holidayCalendar.login", "INICIA SESIÓN")}
                          </Link>
                        ) : isLoadingApiKey || isLoadingParticipations ? (
                          <div className="inline-flex items-center justify-center gap-2 bg-gray-600 text-gray-300 font-semibold py-2 rounded-lg w-full">
                            {t("holidayCalendar.loading", "Cargando...")}
                          </div>
                        ) : !hasApiKey || !apiKeyValid ? (
                          <Link
                            href="/profile"
                            className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-2xl py-3.5 rounded-lg transition-colors w-full"
                          >
                            {t("holidayCalendar.linkApiKey", "VINCULA API KEY")}
                          </Link>
                        ) : participatedDays.has(day.giveawayId || '') ? (
                          <div className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white font-bold text-2xl py-3.5 rounded-lg w-full">
                            {accountInfo?.name || t("holidayCalendar.registered", "APUNTADO")}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleParticipateClick(day.day)}
                            disabled={isParticipating}
                            className={`
                            w-full py-4 lg:py-3 rounded-lg
                            font-bold text-white text-lg lg:text-base
                            transition-all duration-200
                            bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 active:scale-95 shadow-lg
                          `}
                          >
                            <span className="flex items-center justify-center gap-2">
                              <span>-</span>
                              <span>{t("holidayCalendar.participate", "APUNTATE")}</span>
                              <span>-</span>
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Indicador de CERRADO - PENDIENTE (cuando está cerrado pero sin ganadores) */}
                    {isClosed && dayWinners.length === 0 && day.giveawayId && (
                      <div className="absolute bottom-[3.78rem] left-1/2 transform -translate-x-1/2 w-[85%] px-2">
                        <div className="bg-yellow-600/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-center shadow-lg border border-yellow-400/50">
                          <p className="text-xs font-bold">{t("holidayCalendar.closedPending", "CERRADO - PENDIENTE")}</p>
                          <p className="text-[10px] mt-0.5 opacity-90">{t("holidayCalendar.awaitingWinners", "En espera de ganadores")}</p>
                        </div>
                      </div>
                    )}

                    {/* Lista de ganadores */}
                    {dayWinners.length > 0 && (
                      <div className="absolute bottom-[2.75rem] sm:bottom-[calc(2.5rem-18px)] left-1/2 transform -translate-x-1/2 w-[85%] px-2">
                        <div className="space-y-0.5 sm:space-y-1">
                          {dayWinners.map((winner) => (
                            <div key={winner.position} className="text-sm text-gray-900 text-center font-medium leading-tight flex items-center justify-center gap-1 sm:gap-1.5">
                              <span className="font-bold">{winner.position}º</span>
                              {/* Icono del premio */}
                              {winner.gemPrize ? (
                                <img
                                  src="https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png"
                                  alt="Gems"
                                  className="w-6 h-6 object-contain"
                                />
                              ) : winner.itemIcon ? (
                                <img
                                  src={winner.itemIcon}
                                  alt="Prize"
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <span className="text-xs leading-none font-bold">{winner.accountName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botón de Admin para seleccionar ganadores - Aparece en todas las tarjetas para admins, pero se oculta si ya hay ganadores */}
                    {showAdminButton && dayWinners.length === 0 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] px-2 z-20">
                        <button
                          onClick={() => handleSelectWinnersClick(day.giveawayId!)}
                          disabled={isSelectingWinners || !canSelectWinners}
                          className={`w-full py-2 px-3 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${canSelectWinners
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-gray-600 cursor-not-allowed opacity-60"
                            }`}
                          title={
                            !day.isClosed
                              ? "El sorteo aún no ha cerrado"
                              : dayWinners.length > 0
                                ? "Ya hay ganadores seleccionados"
                                : (day.participantCount || 0) === 0
                                  ? "No hay participantes"
                                  : "Seleccionar ganadores al azar"
                          }
                        >
                          <Crown className="w-3 h-3" />
                          {isSelectingWinners ? "Seleccionando..." : "Seleccionar Ganadores"}
                        </button>
                        {!canSelectWinners && dayWinners.length > 0 && (
                          <p className="text-gray-500 text-xs mt-1 text-center">
                            Ganadores ya seleccionados
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {t("holidayCalendar.confirmTitle", "Confirmar participación")}
            </h3>
            <p className="text-gray-300 mb-6 text-center">
              {t("holidayCalendar.confirmMessage", `¿Estás seguro de que quieres participar en el sorteo del día ${selectedDay}?`).replace("{day}", selectedDay.toString())}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedDay(null);
                }}
                className="flex-1 py-2.5 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t("holidayCalendar.cancel", "Cancelar")}
              </button>
              <button
                onClick={handleConfirmParticipate}
                disabled={isParticipating}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isParticipating ? t("holidayCalendar.participating", "Participando...") : t("holidayCalendar.confirm", "Confirmar")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmación para seleccionar ganadores */}
      {showSelectWinnersModal && giveawayToSelectWinners && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Seleccionar Ganadores
              </h3>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que quieres seleccionar ganadores al azar para este sorteo? Esta acción no se puede deshacer.
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  Información del sorteo:
                </p>
                <p className="text-white font-semibold">
                  Día {adventDays.find(d => d.giveawayId === giveawayToSelectWinners)?.day || 'N/A'}
                </p>
                <p className="text-gray-300 text-sm">
                  {adventDays.find(d => d.giveawayId === giveawayToSelectWinners)?.participantCount || 0} participantes •{" "}
                  {adventDays.find(d => d.giveawayId === giveawayToSelectWinners)?.prizes?.length || 0} premios
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSelectWinnersModal(false);
                    setGiveawayToSelectWinners(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSelectWinners}
                  disabled={isSelectingWinners}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isSelectingWinners ? "Seleccionando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de resultado de ganadores */}
      {showWinnersResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl w-[90%] bg-gray-900 border border-gray-700 rounded-2xl p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                ¡Ganadores Seleccionados!
              </h3>
              <p className="text-gray-300 mb-6">
                Se han seleccionado {selectedWinners.length} ganadores al azar para el sorteo.
              </p>

              <div className="bg-gray-800/60 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Lista de Ganadores
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedWinners
                    .sort((a, b) => a.position - b.position)
                    .map((winner, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center text-center"
                      >
                        <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                          {winner.position}
                        </div>
                        <p className="text-white font-semibold mb-2 text-sm">
                          {winner.account_name}
                        </p>
                        {/* Mostrar icono del premio */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {winner.gem_prize ? (
                            <img
                              src="https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png"
                              alt="Gems"
                              className="w-8 h-8 object-contain"
                            />
                          ) : winner.item_icon ? (
                            <img
                              src={winner.item_icon}
                              alt={`Item ${winner.item_id}`}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                // Fallback si la imagen no carga
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>
                        <p className="text-gray-300 text-xs font-semibold">
                          {winner.gem_prize
                            ? `${winner.prize_value} Gems`
                            : winner.quantity && winner.item_id
                              ? `${winner.quantity}x`
                              : winner.prize_description
                          }
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <button
                onClick={() => setShowWinnersResultModal(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md w-[90%] bg-gray-900 border border-red-500 rounded-2xl p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Error</h3>
              <p className="text-gray-300 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

