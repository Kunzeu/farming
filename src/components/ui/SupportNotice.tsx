"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportNotice() {
    const { user } = useAuth();
    const { t } = useI18n();
    const [hasAdBlocker, setHasAdBlocker] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        // LOG INICIAL CRÍTICO
        console.log('[SupportNotice] Componente detectado e iniciado. Usuario:', user?.patreonStatus || 'Anónimo');

        // Bypasses (Query Param o LocalStorage)
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('show-adblocker-banner') === 'true') {
                console.log('[SupportNotice] Forzando banner por URL');
                setHasAdBlocker(true);
                setShowBanner(true);
                return;
            }
            if (localStorage.getItem('force_adblocker_banner') === 'true') {
                console.log('[SupportNotice] Forzando banner por LocalStorage');
                setHasAdBlocker(true);
                setShowBanner(true);
                return;
            }
        }

        // Verificar cooldown de 24h
        const dismissedAt = localStorage.getItem('adblocker_dismissed_at');
        const isDebug = new URLSearchParams(window.location.search).get('debug-adblock') === 'true';

        if (isDebug) {
            console.log('[SupportNotice] Modo DEBUG activado. Ignorando cooldowns y status de Patron.');
        }

        // Detección de AdBlocker mejorada
        const detectAdBlocker = async () => {
            // Verificar cooldown de 2h (LocalStorage)
            if (!isDebug) {
                const dismissedAt = localStorage.getItem('adblocker_dismissed_at');
                if (dismissedAt) {
                    const twoHours = 2 * 60 * 60 * 1000;
                    if (Date.now() - parseInt(dismissedAt) < twoHours) {
                        console.log('[SupportNotice] Banner en cooldown de 2h.');
                        return;
                    }
                }

                if (user?.patreonStatus === 'active_patron') {
                    console.log('[SupportNotice] Usuario es Patron. Detección cancelada.');
                    return;
                }
            }

            console.log('[SupportNotice] Iniciando pruebas de adblock...');
            let detected = false;

            // Método 1: CSS Bait Mejorado
            try {
                const testAd = document.createElement('div');
                testAd.innerHTML = '&nbsp;';
                // Usamos clases e IDs que son "imanes" para AdBlockers
                testAd.className = 'adsbox ad-placement ad-placeholder adbadge BannerAd text-ads';
                testAd.id = 'ads-wrapper'; // ID muy común bloqueado
                testAd.style.position = 'absolute';
                testAd.style.top = '-9999px';
                testAd.style.left = '-9999px';
                testAd.style.width = '1px';
                testAd.style.height = '1px';
                document.body.appendChild(testAd);

                // Esperar un momento a que el bloqueador actúe
                await new Promise(resolve => setTimeout(resolve, 300));

                const styles = window.getComputedStyle(testAd);
                const isBlocked = testAd.offsetHeight === 0 ||
                    testAd.offsetWidth === 0 ||
                    styles.display === 'none' ||
                    styles.visibility === 'hidden' ||
                    styles.opacity === '0';

                document.body.removeChild(testAd);

                if (isBlocked) {
                    console.log('[SupportNotice] ¡DETECTADO! Elemento CSS oculto por bloqueador.');
                    detected = true;
                } else {
                    console.log('[SupportNotice] Prueba CSS: Elemento visible (no bloqueado por CSS).');
                }
            } catch (error) {
                console.error('[SupportNotice] Error en prueba CSS:', error);
            }

            // Método 2: Network Baits (Múltiples intentos)
            if (!detected) {
                const baits = [
                    'https://static.doubleclick.net/instream/ad_status.js',
                    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                    'https://www.google-analytics.com/analytics.js'
                ];

                for (const url of baits) {
                    if (detected) break;
                    try {
                        const req = new Request(url, {
                            method: 'HEAD',
                            mode: 'no-cors'
                        });

                        await fetch(req).then(() => {
                            console.log(`[SupportNotice] Red: Acceso a ${url} EXITOSO.`);
                        }).catch((e) => {
                            console.log(`[SupportNotice] ¡DETECTADO! Bloqueo de red en: ${url}`, e);
                            detected = true;
                        });
                    } catch (e) {
                        detected = true;
                    }
                }
            }

            if (detected) {
                console.log('[SupportNotice] Detección finalizada: SI hay bloqueo. Mostrando banner.');
                setHasAdBlocker(true);
                setShowBanner(true);
            } else {
                console.log('[SupportNotice] Detección finalizada: NO hay bloqueo detectado.');
            }
        };

        const timer = setTimeout(detectAdBlocker, 1000);
        return () => clearTimeout(timer);
    }, [user]);

    const handleClose = () => {
        setShowBanner(false);
        // Guardar timestamp actual para no mostrar por 2h
        localStorage.setItem('adblocker_dismissed_at', Date.now().toString());
        // Limpiamos sessionStorage viejo por si acaso
        sessionStorage.removeItem('adblocker_dismissed');
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
                                    <Link
                                        href="/support"
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto text-center"
                                    >
                                        {t("adBlocker.supportPatreon", "Support us on Patreon")}
                                    </Link>
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
