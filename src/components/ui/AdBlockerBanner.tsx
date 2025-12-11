"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdBlockerBanner() {
    const { user } = useAuth();
    const [hasAdBlocker, setHasAdBlocker] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        // Verificar si hay un parámetro de URL para forzar mostrar el banner (para testing)
        const urlParams = new URLSearchParams(window.location.search);
        const forceShow = urlParams.get('show-adblocker-banner') === 'true' ||
            localStorage.getItem('force_adblocker_banner') === 'true';

        if (forceShow) {
            setHasAdBlocker(true);
            setShowBanner(true);
            return;
        }

        // No mostrar banner a patreons activos
        if (user?.patreonStatus === 'active_patron') {
            setShowBanner(false);
            return;
        }

        // Verificar si ya cerró el banner en esta sesión
        const dismissed = sessionStorage.getItem('adblocker_banner_dismissed');
        if (dismissed === 'true') {
            return;
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
        sessionStorage.setItem('adblocker_banner_dismissed', 'true');
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Banner Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
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
                                    Please disable your browser's ad-blocker
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg">
                                    We rely on your support to continue providing great Guild Wars 2 content.
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
                                    Support us on Patreon
                                </a>
                                <button
                                    onClick={handleNeedHelp}
                                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
                                >
                                    Need Help?
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
                                            How to disable ad-blocker:
                                        </h3>
                                        <div className="space-y-3 text-left text-sm text-gray-600 dark:text-gray-300">
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">uBlock Origin:</strong>
                                                <p>Click the extension icon → Click the power button to disable for this site → Refresh the page</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">AdBlock / AdBlock Plus:</strong>
                                                <p>Click the extension icon → Click "Don't run on pages on this domain" → Refresh the page</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">Brave Browser:</strong>
                                                <p>Click the Brave icon (lion) in the address bar → Turn off "Shields" → Refresh the page</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">Other ad-blockers:</strong>
                                                <p>Look for the extension icon in your browser toolbar → Disable it for this site → Refresh the page</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
