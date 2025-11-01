"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Gift,
  Gem,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Star,
  Award,
  Crown,
  Shield,
  X,
  Activity,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Giveaway {
  id: string;
  slug: string;
  title: string;
  description: string;
  prizes: Array<{
    position: number;
    prize: string;
    icon: string;
    itemId?: number;
    quantity?: number;
    itemName?: string;
    itemIcon?: string;
    gemPrize?: boolean;
  }>;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "ended" | "cancelled" | "winners_announced";
  participantCount: number;
  maxParticipants?: number;
  requirements: string[];
  rules: string[];
  winnersAnnouncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Winner {
  giveawayId: string;
  giveawayTitle: string;
  giveawaySlug: string;
  winnersAnnouncedAt: string;
  position: number;
  accountName: string;
  prizeDescription: string;
  prizeValue: string;
  announcedAt: string;
}

interface AccountInfo {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  giveawayId: string;
  userId: string;
  accountName: string;
  participatedAt: string;
}

// Mock data removed - now using dynamic data from API

const GiveawaysPage = () => {
  const { t, lang } = useI18n();
  const { isAuthenticated, user } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = `${t("giveaways.title")} - True Farming`;
  }, [t]);

  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(
    null
  );
  const [participantCount, setParticipantCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [showParticipationSuccess, setShowParticipationSuccess] =
    useState(false);
  const [participatedAccounts, setParticipatedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const [isLoadingGiveaways, setIsLoadingGiveaways] = useState(true);
  const [isLoadingParticipations, setIsLoadingParticipations] = useState(true);
  const [isSelectingWinners, setIsSelectingWinners] = useState(false);
  const [showSelectWinnersModal, setShowSelectWinnersModal] = useState(false);
  const [showWinnersResultModal, setShowWinnersResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWinners, setSelectedWinners] = useState<
    Array<{
      giveaway_id: string;
      user_id: string;
      account_name: string;
      position: number;
      prize_description: string;
      prize_value: string;
    }>
  >([]);
  const [giveawayToSelectWinners, setGiveawayToSelectWinners] = useState<Giveaway | null>(null);
  const [giveawayItems, setGiveawayItems] = useState<
    Record<
      string,
      Array<{
        position: number;
        prize: string;
        icon: string;
        itemId?: number;
        quantity?: number;
        itemName?: string;
        itemIcon?: string;
        gemPrize?: boolean;
      }>
    >
  >({});

  // Load items information for a specific giveaway
  const loadGiveawayItems = useCallback(
    async (giveawayId: string) => {
      const cacheKey = `${lang}:${giveawayId}`;
      if (giveawayItems[cacheKey]) return;
      try {
        const response = await fetch(
          `/api/giveaways/items?giveawayId=${giveawayId}&lang=${lang}`
        );
        if (response.ok) {
          const data = await response.json();
          setGiveawayItems((prev) => ({
            ...prev,
            [cacheKey]: data.items,
          }));
        }
      } catch (error) {
        console.error(`Error loading items for giveaway ${giveawayId}:`, error);
      }
    },
    [lang, giveawayItems]
  );

  // Load giveaways from API
  const loadGiveaways = useCallback(async () => {
    try {
      setIsLoadingGiveaways(true);
      const response = await fetch("/api/giveaways");
      if (response.ok) {
        const data = await response.json();
        setGiveaways(data.giveaways);

        // Prefetch solo sorteo activo y el siguiente
        const active = data.giveaways.find((g: Giveaway) => g.status === "active");
        const upcomingSorted = data.giveaways
          .filter((g: Giveaway) => g.status === "upcoming")
          .sort(
            (a: Giveaway, b: Giveaway) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        const next = upcomingSorted[0];
        if (active) await loadGiveawayItems(active.id);
        if (next) await loadGiveawayItems(next.id);
      } else {
        console.error("Error loading giveaways");
      }
    } catch (error) {
      console.error("Error loading giveaways:", error);
    } finally {
      setIsLoadingGiveaways(false);
    }
  }, [loadGiveawayItems]);

  // Load winners from API
  const loadWinners = useCallback(async () => {
    try {
      const response = await fetch("/api/giveaways/winners?latest=true");
      if (response.ok) {
        const data = await response.json();
        setWinners(data.winners);
        
        // Cargar items de los giveaways de los ganadores si hay ganadores
        if (data.winners && data.winners.length > 0) {
          const winners = data.winners as Array<{ giveawayId: string }>;
          const uniqueGiveawayIds: string[] = Array.from(new Set(winners.map((w) => w.giveawayId)));
          for (const giveawayId of uniqueGiveawayIds) {
            await loadGiveawayItems(giveawayId);
          }
        }
      } else {
        console.error("Error loading winners");
      }
    } catch (error) {
      console.error("Error loading winners:", error);
    }
  }, [loadGiveawayItems]);

  // Load user's participated giveaways with caching
  const loadParticipatedGiveaways = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingParticipations(false);
      return;
    }

    // Check if we already have data and it's recent (within 90 seconds)
    const cacheKey = `participated_${user.id}`;
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}_time`);

    if (cached && cacheTime) {
      const timeDiff = Date.now() - parseInt(cacheTime);
      if (timeDiff < 90000) {
        // 90 seconds cache
        const participatedSet = new Set(JSON.parse(cached) as string[]);
        setParticipatedAccounts(participatedSet);
        setIsLoadingParticipations(false);
        return;
      }
    }

    try {
      setIsLoadingParticipations(true);
      const response = await fetch(
        `/api/giveaways/participants?userId=${user.id}`,
        {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const participatedSet = new Set(
          data.participants.map((p: Participant) => p.giveawayId)
        );

        // Cache the result
        localStorage.setItem(
          cacheKey,
          JSON.stringify(Array.from(participatedSet))
        );
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

        setParticipatedAccounts(participatedSet as Set<string>);
      } else {
        setParticipatedAccounts(new Set());
      }
    } catch {
      setParticipatedAccounts(new Set());
    } finally {
      setIsLoadingParticipations(false);
    }
  }, [user?.id]);

  // Check if user has API key and get account info from database
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
      } catch (error) {
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

  // Load giveaways and winners on component mount
  useEffect(() => {
    loadGiveaways();
    loadWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload items cuando cambia idioma: solo activo y siguiente (si no están en cache)
  useEffect(() => {
    if (giveaways.length > 0) {
      const active = giveaways.find((g) => g.status === "active");
      const next = giveaways
        .filter((g) => g.status === "upcoming")
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
      if (active) loadGiveawayItems(active.id);
      if (next) loadGiveawayItems(next.id);
    }
  }, [lang, giveaways, loadGiveawayItems]);

  // Load participated giveaways when user changes
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      loadParticipatedGiveaways();
    } else {
      setParticipatedAccounts(new Set());
      setIsLoadingParticipations(false);
    }
  }, [user?.id, isAuthenticated, loadParticipatedGiveaways]);

  // Update participant count based on actual participants
  useEffect(() => {
    setParticipantCount(participatedAccounts.size);
  }, [participatedAccounts]);

  // Update the active giveaway's participant count
  useEffect(() => {
    setGiveaways((prev) =>
      prev.map((giveaway) =>
        giveaway.status === "active"
          ? { ...giveaway, participants: participantCount }
          : giveaway
      )
    );
  }, [participantCount]);

  const getPrizeIcon = (icon: string) => {
    switch (icon) {
      case "gem":
        return <Gem className="w-4 h-4 text-yellow-400" />;
      case "package":
        return <Gift className="w-4 h-4 text-blue-400" />;
      default:
        return <Gift className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (position === 2) return <Award className="w-4 h-4 text-gray-300" />;
    if (position === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <Star className="w-4 h-4 text-gray-400" />;
  };

  const handleEnterGiveaway = async () => {
    if (!isAuthenticated || !user?.id) {
      window.location.href = "/login";
      return;
    }

    if (!hasApiKey || !apiKeyValid) {
      window.location.href = "/profile";
      return;
    }

    if (!accountInfo) {
      alert("Account information not available. Please try again.");
      return;
    }

    if (!selectedGiveaway) return;

    const accountName = accountInfo.name;
    const giveawayId = selectedGiveaway.id;

    // Check if user already participated
    if (participatedAccounts.has(giveawayId)) {
      alert("You have already entered this giveaway!");
      return;
    }

    try {
      const response = await fetch("/api/giveaways/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giveawayId: giveawayId,
          userId: user.id,
          accountName: accountName,
        }),
      });

      if (response.ok) {
        // Immediately update the UI state
        const newParticipatedAccounts = new Set(participatedAccounts);
        newParticipatedAccounts.add(giveawayId);
        setParticipatedAccounts(newParticipatedAccounts);

        // Update cache
        const cacheKey = `participated_${user.id}`;
        localStorage.setItem(
          cacheKey,
          JSON.stringify(Array.from(newParticipatedAccounts))
        );
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

        // Update the giveaway participants count immediately
        setGiveaways((prev) =>
          prev.map((giveaway) =>
            giveaway.id === giveawayId
              ? { ...giveaway, participantCount: giveaway.participantCount + 1 }
              : giveaway
          )
        );

        // Show success modal
        setShowParticipationSuccess(true);
        setSelectedGiveaway(null);

        // Reload giveaways in the background to ensure accuracy
        loadGiveaways();
      } else {
        const errorData = await response.json();
        console.error("Error participating in giveaway:", errorData);
        alert("Error participating in giveaway. Please try again.");
      }
    } catch (error) {
      console.error("Error participating in giveaway:", error);
      alert("Error participating in giveaway. Please try again.");
    }
  };

  // Function to show select winners confirmation modal
  const handleSelectWinnersClick = (giveaway?: Giveaway) => {
    // Si se proporciona un giveaway específico, usarlo; de lo contrario usar el activo
    const targetGiveaway = giveaway || activeGiveaway;
    if (targetGiveaway) {
      setGiveawayToSelectWinners(targetGiveaway);
    setShowSelectWinnersModal(true);
    }
  };

  // Function to confirm and select winners
  const handleConfirmSelectWinners = async () => {
    // Usar el giveaway específico seleccionado o el activo como fallback
    const targetGiveaway = giveawayToSelectWinners || activeGiveaway;
    if (!targetGiveaway) return;

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
          giveawayId: targetGiveaway.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedWinners(data.winners || []);
        setShowWinnersResultModal(true);

        // Reload winners and giveaways to show updated data
        loadWinners();
        loadGiveaways();
      } else {
        const errorData = await response.json();
        console.error("Error selecting winners:", errorData);
        setErrorMessage(
          `Error seleccionando ganadores: ${
            errorData.error || "Error desconocido"
          }`
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error selecting winners:", error);
      setErrorMessage(
        "Error seleccionando ganadores. Por favor intenta de nuevo."
      );
      setShowErrorModal(true);
    } finally {
      setIsSelectingWinners(false);
      setGiveawayToSelectWinners(null);
    }
  };

  // Encontrar el sorteo activo basándose en fechas actuales, no solo en status
  const now = new Date();
  // Primero intentar encontrar por fechas (dentro del rango)
  const activeByDate = giveaways.filter((g) => {
    const start = new Date(g.startDate);
    const end = new Date(g.endDate);
    // Un sorteo está activo si está entre su fecha de inicio y fin
    return start <= now && end > now && (g.status === "active" || g.status === "upcoming");
  });
  
  // Si hay múltiples, seleccionar el más reciente (mayor startDate)
  const activeGiveaway = activeByDate.length > 0 
    ? activeByDate.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
    : giveaways.find((g) => g.status === "active"); // Fallback al status si no hay coincidencia por fechas

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  // Function to render prize with dynamic item information
  const renderPrize = (
    prize: {
      position: number;
      prize: string;
      icon: string;
      itemId?: number;
      quantity?: number;
      itemName?: string;
      itemIcon?: string;
      gemPrize?: boolean;
    },
    giveawayId: string
  ) => {
    const items = giveawayItems[`${lang}:${giveawayId}`] || [];
    const itemInfo = items.find((item) => item.position === prize.position);

    if (itemInfo && itemInfo.itemName && itemInfo.itemIcon) {
      // Si es una clave de traducción (empieza con 'giveaways.')
      const displayName = itemInfo.itemName.startsWith("giveaways.")
        ? t(itemInfo.itemName)
        : itemInfo.itemName;

      return (
        <div className="flex items-center gap-2">
          <Image
            src={itemInfo.itemIcon}
            alt={displayName}
            width={24}
            height={24}
            className="w-6 h-6 rounded"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = "/images/icons/raw.webp";
            }}
          />
          <span className="font-medium text-white">
            {itemInfo.quantity} {displayName}
          </span>
        </div>
      );
    }

    // Fallback to original prize display
    return (
      <div className="flex items-center gap-2">
        {getPrizeIcon(prize.icon)}
        <span className="font-medium text-white">{prize.prize}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("giveaways.title")}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("giveaways.subtitle")}
          </p>
        </div>

        {/* Latest Winners Section */}
        {winners.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-700/60 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 text-yellow-400 text-sm font-medium mb-4">
                <Trophy className="w-4 h-4" />
                {t("giveaways.latestWinners")}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {t(winners[0].giveawayTitle)}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {winners
                .filter(w => w.giveawayId === winners[0].giveawayId)
                .sort((a, b) => a.position - b.position)
                .slice(0, 10)
                .map((winner) => {
                  // Obtener información completa del premio desde giveawayItems
                  const items = giveawayItems[`${lang}:${winner.giveawayId}`] || [];
                  const itemInfo = items.find((item) => item.position === winner.position);
                  
                  // Fallback: intentar obtener del giveaway directo si no hay itemInfo
                  let prizeInfo = null;
                  if (!itemInfo) {
                    const giveawayInfo = giveaways.find(g => g.id === winner.giveawayId);
                    prizeInfo = giveawayInfo?.prizes.find(p => p.position === winner.position);
                  }
                  
                  return (
                <div
                  key={`${winner.giveawayId}-${winner.position}`}
                      className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-4 flex flex-col items-center text-center"
                >
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 text-lg font-bold flex items-center justify-center mb-3">
                      {winner.position}
                    </div>
                      <div className="font-medium text-white mb-1 text-sm">
                        {winner.accountName}
                      </div>
                      <div className="text-xs text-gray-300 flex items-center gap-1.5 justify-center">
                        {itemInfo && (itemInfo.itemIcon || itemInfo.gemPrize) ? (
                          <>
                            {itemInfo.gemPrize ? (
                              <>
                                <Image
                                  src={itemInfo.itemIcon || "https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png"}
                                  alt={t('giveaways.gems', 'Gems')}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 rounded"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.src = "https://render.guildwars2.com/file/65941.png";
                                  }}
                                />
                                <span>{itemInfo.prize || itemInfo.quantity || ''}</span>
                              </>
                            ) : itemInfo.itemIcon && itemInfo.itemName ? (
                              <>
                                <Image
                                  src={itemInfo.itemIcon}
                                  alt={itemInfo.itemName}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 rounded"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.src = "https://wiki.guildwars2.com/images/9/9b/Glob_of_Ectoplasm.png";
                                  }}
                                />
                                <span>{itemInfo.quantity || ''}x {itemInfo.itemName.startsWith("giveaways.") ? t(itemInfo.itemName) : itemInfo.itemName}</span>
                              </>
                            ) : (
                              <span>{winner.prizeDescription}</span>
                            )}
                          </>
                        ) : prizeInfo ? (
                          <>
                            {prizeInfo.gemPrize ? (
                              <>
                                <Image
                                  src="https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png"
                                  alt={t('giveaways.gems', 'Gems')}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 rounded"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.src = "https://render.guildwars2.com/file/0B56E2E65A2E9F0F6C7D8F5A9B7D1E2F/65941.png";
                                  }}
                                />
                                <span>{prizeInfo.prize || prizeInfo.quantity || ''}</span>
                              </>
                            ) : prizeInfo.itemId ? (
                              <>
                                <Image
                                  src="https://wiki.guildwars2.com/images/9/9b/Glob_of_Ectoplasm.png"
                                  alt={prizeInfo.prize}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 rounded"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.src = "/images/icons/raw.webp";
                                  }}
                                />
                                <span>{prizeInfo.quantity || prizeInfo.prize || ''}</span>
                              </>
                            ) : (
                              <span>{winner.prizeDescription}</span>
                            )}
                          </>
                        ) : (
                          <span>{winner.prizeDescription}</span>
                        )}
                    </div>
                    {getPositionIcon(winner.position)}
                  </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingGiveaways && (
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">{t("giveaways.loading")}</p>
            </div>
          </div>
        )}

        {/* Current Giveaway */}
        {!isLoadingGiveaways && activeGiveaway && (
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 text-green-400 text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                {t("giveaways.currentlyActive")}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {t(activeGiveaway.title)}
              </h2>
              <p className="text-gray-300 text-lg">
                {t(activeGiveaway.description)}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {activeGiveaway.participantCount.toLocaleString()}
                </div>
                <div className="text-gray-400">
                  {t("giveaways.participants")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {activeGiveaway.prizes.length}
                </div>
                <div className="text-gray-400">{t("giveaways.prizes")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {Math.ceil(
                    (new Date(activeGiveaway.endDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </div>
                <div className="text-gray-400">{t("giveaways.daysLeft")}</div>
              </div>
            </div>

            {/* Prizes */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                {t("giveaways.prizes")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGiveaway.prizes.map((prize) => (
                  <div
                    key={prize.position}
                    className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold flex items-center justify-center">
                      {prize.position}
                    </div>
                    {renderPrize(prize, activeGiveaway.id)}
                  </div>
                ))}
              </div>
            </div>

            {/* Participation */}
            <div className="text-center space-y-4">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {t("giveaways.loginToParticipate")}
                </Link>
              ) : isLoadingApiKey || isLoadingParticipations ? (
                <div className="inline-flex items-center gap-2 bg-gray-600 text-gray-300 font-semibold py-3 px-8 rounded-lg">
                  <Activity className="w-5 h-5 animate-spin" />
                  {t("giveaways.loading")}
                </div>
              ) : !hasApiKey || !apiKeyValid ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {hasApiKey
                    ? t("giveaways.fixApiKeyToParticipate")
                    : t("giveaways.addApiKeyToParticipate")}
                </Link>
              ) : participatedAccounts.has(activeGiveaway.id) ? (
                <div className="inline-flex items-center gap-2 bg-gray-600 text-gray-300 font-semibold py-3 px-8 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  {accountInfo?.name || "N/A"}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedGiveaway(activeGiveaway)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  {t("giveaways.enterGiveaway")}
                </button>
              )}

              {/* Admin Button - Select Winners - Only visible to admins */}
              {isAdmin && activeGiveaway && (
                <div className="pt-4 border-t border-gray-700/60">
                  <p className="text-gray-400 text-sm mb-3">
                    🔧 Administración
                  </p>
                  <button
                    onClick={() => handleSelectWinnersClick(activeGiveaway)}
                    disabled={
                      isSelectingWinners ||
                      activeGiveaway.participantCount === 0
                    }
                    className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    {isSelectingWinners
                      ? "Seleccionando..."
                      : "Seleccionar Ganadores"}
                  </button>
                  {activeGiveaway.participantCount === 0 && (
                    <p className="text-gray-500 text-xs mt-2">
                      No hay participantes aún
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Giveaways */}
        {!isLoadingGiveaways && isAdmin &&
          giveaways.filter((g) => g.status === "upcoming").length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t("giveaways.upcomingGiveaways")}
              </h2>
              <div className="space-y-4">
                {giveaways
                  .filter((g) => g.status === "upcoming")
                  .map((giveaway) => (
                    <div
                      key={giveaway.id}
                      className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {t(giveaway.title)}
                          </h3>
                          <p className="text-gray-300">
                            {t(giveaway.description)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span>
                              {t("giveaways.starts")}{" "}
                              {new Date(
                                giveaway.startDate
                              ).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                              {giveaway.prizes.length} {t("giveaways.prizes")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {t("giveaways.upcoming")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Ended Giveaways (Admin Only) - For selecting winners */}
        {!isLoadingGiveaways && isAdmin &&
          giveaways.filter((g) => {
            // Incluir sorteos terminados por status o por fecha
            const endDate = new Date(g.endDate);
            const hasEndedByDate = endDate <= now;
            return (g.status === "ended" || g.status === "winners_announced") || 
                   (hasEndedByDate && g.status === "active");
          }).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                🔧 Sorteos Terminados (Administración)
              </h2>
              <div className="space-y-4">
                {giveaways
                  .filter((g) => {
                    // Incluir sorteos terminados por status o por fecha
                    const endDate = new Date(g.endDate);
                    const hasEndedByDate = endDate <= now;
                    return (g.status === "ended" || g.status === "winners_announced") || 
                           (hasEndedByDate && g.status === "active");
                  })
                  .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
                  .map((giveaway) => {
                    // Verificar si ya tiene ganadores
                    const hasWinners = winners.some(w => w.giveawayId === giveaway.id);
                    
                    return (
                      <div
                        key={giveaway.id}
                        className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">
                              {t(giveaway.title)}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {t(giveaway.description)}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>
                                Finalizó: {new Date(giveaway.endDate).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>
                                {giveaway.participantCount} participantes
                              </span>
                              <span>•</span>
                              <span>
                                {giveaway.prizes.length} premios
                              </span>
                              {hasWinners && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-400">
                                    Ganadores seleccionados
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              giveaway.status === "winners_announced" 
                                ? "bg-green-900/20 text-green-400" 
                                : "bg-orange-900/20 text-orange-400"
                            }`}>
                              <Trophy className="w-4 h-4" />
                              {giveaway.status === "winners_announced" ? "Ganadores anunciados" : "Terminado"}
                            </div>
                            {!hasWinners && (
                              <button
                                onClick={() => handleSelectWinnersClick(giveaway)}
                                disabled={isSelectingWinners || giveaway.participantCount === 0}
                                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                              >
                                <Crown className="w-4 h-4" />
                                Seleccionar Ganadores
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        {/* No Active Giveaways */}
        {!isLoadingGiveaways &&
          !activeGiveaway &&
          giveaways.filter((g) => g.status === "upcoming").length === 0 && (
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("giveaways.noActiveGiveaways")}
              </h3>
              <p className="text-gray-300">{t("giveaways.checkBackLater")}</p>
            </div>
          )}

        {/* Selected Giveaway Modal */}
        {selectedGiveaway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelectedGiveaway(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <button
                onClick={() => setSelectedGiveaway(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 text-green-400 text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4" />
                  {t("giveaways.currentlyActive")}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {t(selectedGiveaway.title)}
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                  {t(selectedGiveaway.description)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {selectedGiveaway.participantCount.toLocaleString()}
                    </div>
                    <div className="text-gray-400">
                      {t("giveaways.participants")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {selectedGiveaway.prizes.length}
                    </div>
                    <div className="text-gray-400">{t("giveaways.prizes")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {Math.ceil(
                        (new Date(selectedGiveaway.endDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </div>
                    <div className="text-gray-400">
                      {t("giveaways.daysLeft")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prizes */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                      {t("giveaways.prizes")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedGiveaway.prizes.map((prize) => (
                        <div
                          key={prize.position}
                          className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold flex items-center justify-center">
                            {prize.position}
                          </div>
                          {renderPrize(prize, selectedGiveaway.id)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Enter Giveaway */}
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t("giveaways.enterGiveaway")}
                    </h3>

                    <div className="space-y-4">
                      {selectedGiveaway.status === "active" ? (
                        (() => {
                          const hasParticipated = participatedAccounts.has(
                            selectedGiveaway.id
                          );

                          return (
                            <button
                              onClick={handleEnterGiveaway}
                              disabled={
                                hasParticipated ||
                                isLoadingApiKey ||
                                isLoadingParticipations
                              }
                              className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                                hasParticipated ||
                                isLoadingApiKey ||
                                isLoadingParticipations
                                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                  : !isAuthenticated
                                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                                  : !hasApiKey || !apiKeyValid
                                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                            >
                              {isLoadingApiKey || isLoadingParticipations
                                ? `${t("giveaways.loading")}...`
                                : hasParticipated
                                ? `${accountInfo?.name || "N/A"}`
                                : !isAuthenticated
                                ? t("giveaways.loginToEnter")
                                : !hasApiKey
                                ? t("giveaways.addApiKeyToEnter")
                                : !apiKeyValid
                                ? t("giveaways.fixApiKeyToEnter")
                                : t("giveaways.enterGiveawayButton")}
                            </button>
                          );
                        })()
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          {selectedGiveaway.status === "upcoming"
                            ? t("giveaways.notStartedYet")
                            : t("giveaways.giveawayEnded")}
                        </button>
                      )}

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">
                          {selectedGiveaway.participantCount.toLocaleString()}{" "}
                          {t("giveaways.participants")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t("giveaways.quickLinks")}
                    </h3>
                    <div className="space-y-3">
                      <a
                        href="https://discord.com/invite/KQSrhA2qmx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-purple-400" />
                        <span className="text-white">
                          {t("giveaways.joinDiscord")}
                        </span>
                      </a>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                      >
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span className="text-white">
                          {t("giveaways.linkApiKey")}
                        </span>
                      </Link>

                      {/* Admin Button - Only show for active giveaways and admins */}
                      {activeGiveaway && isAdmin && (
                        <button
                          onClick={() => handleSelectWinnersClick(activeGiveaway)}
                          disabled={
                            isSelectingWinners ||
                            activeGiveaway.participantCount === 0
                          }
                          className="flex items-center gap-3 p-3 bg-yellow-600/20 hover:bg-yellow-600/30 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded-lg transition-colors w-full"
                        >
                          <Crown className="w-5 h-5 text-yellow-400" />
                          <span className="text-white">
                            {isSelectingWinners
                              ? "Seleccionando..."
                              : "Seleccionar Ganadores"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Participation Success Modal */}
        {showParticipationSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowParticipationSuccess(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-md w-[90%] bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <button
                onClick={() => setShowParticipationSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {t("giveaways.successfullyEntered")}
                </h3>
                <p className="text-gray-300 mb-6">
                  {t("giveaways.successMessage")}
                </p>

                {accountInfo && (
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {t("giveaways.accountInformation")}
                    </h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {accountInfo.name || "N/A"}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {t("giveaways.accountName")}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => setShowParticipationSuccess(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t("giveaways.close")}
                  </button>

                  <a
                    href="https://discord.gg/your-discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-purple-600 text-purple-300 hover:bg-purple-700/20 font-medium py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("giveaways.joinDiscordForUpdates")}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Select Winners Confirmation Modal */}
        {showSelectWinnersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => {
                setShowSelectWinnersModal(false);
                setGiveawayToSelectWinners(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-md w-[90%] bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Seleccionar Ganadores
                </h3>
                <p className="text-gray-300 mb-6">
                  ¿Estás seguro de que quieres seleccionar ganadores para este
                  sorteo? Esta acción no se puede deshacer.
                </p>
                <div className="bg-gray-800/60 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-2">
                    Información del sorteo:
                  </p>
                  <p className="text-white font-semibold">
                    {t((giveawayToSelectWinners || activeGiveaway)?.title || "")}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {(giveawayToSelectWinners || activeGiveaway)?.participantCount} participantes •{" "}
                    {(giveawayToSelectWinners || activeGiveaway)?.prizes.length} premios
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

        {/* Winners Result Modal */}
        {showWinnersResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowWinnersResultModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-2xl w-[90%] bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¡Ganadores Seleccionados!
                </h3>
                <p className="text-gray-300 mb-6">
                  Se han seleccionado {selectedWinners.length} ganadores para el
                  sorteo.
                </p>

                <div className="bg-gray-800/60 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Lista de Ganadores
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedWinners
                      .sort((a, b) => a.position - b.position)
                      .map((winner, index) => {
                        // Obtener información del premio del sorteo activo
                        const targetGiveaway = giveawayToSelectWinners || activeGiveaway;
                        const prizeInfo = targetGiveaway?.prizes.find(p => p.position === winner.position);
                        const prizeDescription = prizeInfo 
                          ? (prizeInfo.gemPrize 
                              ? `${prizeInfo.prize} Gems`
                              : prizeInfo.itemName 
                                ? `${prizeInfo.quantity}x ${prizeInfo.itemName}`
                                : winner.prize_description)
                          : winner.prize_description;
                        
                        return (
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
                            <p className="text-gray-300 text-xs">
                              {prizeDescription}
                            </p>
                          </div>
                        );
                      })}
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

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowErrorModal(false)}
            />
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
    </div>
  );
};

export default GiveawaysPage;
