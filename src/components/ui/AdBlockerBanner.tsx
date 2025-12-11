"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdBlockerBanner() {
    const { user } = useAuth();
    const { t } = useI18n();
    const [hasAdBlocker, setHasAdBlocker] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        // Verificar si hay un parámetro de URL para forzar mostrar el banner (para testing)
        const urlParams = new URLSearchParams(window.location.search);
        const forceShow = urlParams.get('show-adblocker-banner') === 'true' ||
            localStorage.getItem('force_adblocker_banner') === 'true';

        if (forceShow) {
            console.log('[AdBlockerBanner] Force showing banner');
            setHasAdBlocker(true);
            setShowBanner(true);
            return;
        }

        // No mostrar banner a patreons activos
        if (user?.patreonStatus === 'active_patron') {
            setShowBanner(false);
            return;
        }

        // Verificar si ya cerró el banner en las últimas 24 horas
        const dismissedAt = localStorage.getItem('adblocker_dismissed_at');
        if (dismissedAt) {
            const oneDay = 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(dismissedAt) < oneDay) {
                return;
            }
        }

        // Detectar ad-blocker
        const detectAdBlocker = async () => {
            try {
                // Método 1: Intentar cargar un script de ads común
                const testAd = document.createElement('div');
                testAd.innerHTML = '&nbsp;';
                testAd.className = 'adsbox ad-placement ad-placeholder adbadge BannerAd';
                testAd.style.position = 'absolute';
                testAd.style.left = '-999px';
                document.body.appendChild(testAd);

                // Esperar un momento para que el ad-blocker actúe
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verificar si el elemento fue bloqueado
                const isBlocked = testAd.offsetHeight === 0 ||
                    testAd.offsetWidth === 0 ||
                    window.getComputedStyle(testAd).display === 'none' ||
                    window.getComputedStyle(testAd).visibility === 'hidden';

                document.body.removeChild(testAd);

                if (isBlocked) {
                    setHasAdBlocker(true);
                    setShowBanner(true);
                }
            } catch (error) {
                console.error('Error detecting ad-blocker:', error);
            }
        };

        // Ejecutar detección después de un pequeño delay
        const timer = setTimeout(detectAdBlocker, 1000);

        return () => clearTimeout(timer);
    }, [user]);

    const handleClose = () => {
        setShowBanner(false);
        // Guardar timestamp actual para no mostrar por 24h
        localStorage.setItem('adblocker_dismissed_at', Date.now().toString());
    };

    const handleNeedHelp = () => {
        setShowHelp(!showHelp);
    };

    if (!showBanner || !hasAdBlocker) {
        return null;
    }

    return (
        <AnimatePresence>
            {showBanner && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                        style={{ zIndex: 99998 }}
                        onClick={handleClose}
                    />

                    {/* Banner Modal - Centered Container */}
                    <div
                        className="fixed inset-0 flex items-center justify-center pointer-events-none"
                        style={{ zIndex: 99999 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="pointer-events-auto w-full max-w-2xl mx-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Content */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {t("adBlocker.title", "Please disable your browser's ad-blocker")}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                        {t("adBlocker.subtitle", "We rely on your support to continue providing great Guild Wars 2 content.")}
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <a
                                        href="https://www.patreon.com/KunzeuLabs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto text-center"
                                    >
                                        {t("adBlocker.supportPatreon", "Support us on Patreon")}
                                    </a>
                                    <button
                                        onClick={handleNeedHelp}
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
                                    >
                                        {t("adBlocker.needHelp", "Need Help?")}
                                    </button>
                                </div>

                                {/* Help Section */}
                                <AnimatePresence>
                                    {showHelp && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                {t("adBlocker.howToDisable", "How to disable ad-blocker:")}
                                            </h3>
                                            <div className="space-y-3 text-left text-sm text-gray-600 dark:text-gray-300">
                                                <div>
                                                    <strong className="text-gray-900 dark:text-white">{t("adBlocker.uBlockOrigin", "uBlock Origin:")}</strong>
                                                    <p>{t("adBlocker.uBlockOriginDesc", "Click the extension icon → Click the power button to disable for this site → Refresh the page")}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-900 dark:text-white">{t("adBlocker.adBlockPlus", "AdBlock / AdBlock Plus:")}</strong>
                                                    <p>{t("adBlocker.adBlockPlusDesc", "Click the extension icon → Click \"Don't run on pages on this domain\" → Refresh the page")}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-900 dark:text-white">{t("adBlocker.brave", "Brave Browser:")}</strong>
                                                    <p>{t("adBlocker.braveDesc", "Click the Brave icon (lion) in the address bar → Turn off \"Shields\" → Refresh the page")}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-900 dark:text-white">{t("adBlocker.others", "Other ad-blockers:")}</strong>
                                                    <p>{t("adBlocker.othersDesc", "Look for the extension icon in your browser toolbar → Disable it for this site → Refresh the page")}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
