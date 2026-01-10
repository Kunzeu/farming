'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Loader2, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface Material {
    id: number;
    name: string;
    icon?: string;
    required: number;
    owned: number;
    note?: string;
}

interface MaterialTrackerProps {
    materials: Record<string, { id: number; name: string; icon?: string; required: number; note?: string }>;
    title?: string;
    description?: string;
}

import { useGW2Inventory } from '@/hooks/useGW2Inventory';

export default function MaterialTracker({ materials, title, description }: MaterialTrackerProps) {
    const { user } = useAuth();
    const [materialData, setMaterialData] = useState<Material[]>([]);

    // Use custom hook for inventory logic
    const {
        inventoryMap,
        loading,
        error,
        status,
        refresh,
        hasApiKey,
        lastUpdate
    } = useGW2Inventory({ user });

    // Calcular datos de visualización
    useEffect(() => {
        if (!materials || Object.keys(materials).length === 0) {
            setMaterialData([]);
            return;
        }

        const trackedMaterials: Material[] = Object.values(materials).map(mat => ({
            id: mat.id,
            name: mat.name,
            icon: mat.icon,
            required: mat.required,
            owned: inventoryMap[mat.id] || 0,
            note: mat.note,
        }));

        setMaterialData(trackedMaterials);
    }, [inventoryMap, materials]);

    // Cargar una única vez al tener API key y no tener datos recientes
    useEffect(() => {
        if (hasApiKey && !lastUpdate && !loading) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasApiKey, lastUpdate]);

    if (!user) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center space-x-3 text-gray-400">
                    <Package className="w-5 h-5" />
                    <p>Inicia sesión para usar el tracker de materiales</p>
                </div>
            </div>
        );
    }

    if (!hasApiKey) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <Package className="w-8 h-8 text-yellow-400" />
                    <p className="text-gray-300">
                        Configura tu API key de GW2 en tu perfil para usar el tracker de materiales
                    </p>
                    <a
                        href="/profile"
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        Ir a Perfil
                    </a>
                </div>
            </div>
        );
    }

    const totalProgress = materialData.length > 0
        ? materialData.reduce((acc, mat) => acc + Math.min(mat.owned, mat.required), 0) /
        materialData.reduce((acc, mat) => acc + mat.required, 0) * 100
        : 0;

    const completedMaterials = materialData.filter(mat => mat.owned >= mat.required).length;

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="w-6 h-6 text-yellow-400" />
                        {title || 'Material Tracker'}
                    </h3>
                    {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={() => refresh()}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Analizando...' : 'Actualizar'}
                    </button>
                    {loading && status && (
                        <span className="text-xs text-yellow-400 animate-pulse">{status}</span>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {materialData.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                            Progreso Total: {completedMaterials}/{materialData.length} materiales
                        </span>
                        <span className="text-sm font-bold text-yellow-400">
                            {totalProgress.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500 rounded-full"
                            style={{ width: `${totalProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && materialData.length === 0 && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            )}

            {/* Materials List */}
            {materialData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {materialData.map((mat) => {
                        const progress = Math.min((mat.owned / mat.required) * 100, 100);
                        const isComplete = mat.owned >= mat.required;
                        const remaining = Math.max(mat.required - mat.owned, 0);

                        return (
                            <div
                                key={mat.id}
                                className={`p-3 rounded-lg border transition-all ${isComplete
                                    ? 'bg-green-900/20 border-green-500/30'
                                    : 'bg-slate-700/30 border-slate-600/30'
                                    }`}
                            >
                                <div className="flex items-start gap-2 mb-2">
                                    {mat.icon && (
                                        <div className="w-8 h-8 relative flex-shrink-0">
                                            <Image
                                                src={mat.icon}
                                                alt={mat.name}
                                                fill
                                                sizes="32px"
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white text-sm truncate">{mat.name}</p>
                                        {mat.note && <p className="text-xs text-gray-400 truncate">{mat.note}</p>}
                                    </div>
                                    {isComplete ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {mat.owned.toLocaleString()} / {mat.required.toLocaleString()}
                                        </span>
                                        {!isComplete && remaining > 0 && (
                                            <span className="text-xs text-red-400">
                                                -{remaining.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isComplete
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Last Update */}
            {lastUpdate && (
                <div className="mt-4 text-center text-xs text-gray-500">
                    Última actualización: {lastUpdate.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}
