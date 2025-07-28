'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Star,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Botón para volver al inicio */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm text-white rounded-lg transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Volver al Inicio</span>
        <Home className="w-4 h-4 sm:hidden" />
      </Link>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-900 to-blue-900 p-8">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              GW2 Farming Hub
            </h1>
            <p className="text-xl text-purple-200">
              Tu centro de información para Guild Wars 2
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Precios en Tiempo Real
                </h3>
                <p className="text-purple-200 text-sm">
                  Accede a precios actualizados del Trading Post y análisis de mercado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Rutas Optimizadas
                </h3>
                <p className="text-purple-200 text-sm">
                  Descubre las mejores rutas de farming para maximizar tus ganancias.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Comunidad Activa
                </h3>
                <p className="text-purple-200 text-sm">
                  Conecta con otros jugadores y comparte estrategias de farming.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Builds Meta
                </h3>
                <p className="text-purple-200 text-sm">
                  Accede a las mejores builds para todas las profesiones.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-purple-300 text-sm">
              Únete a miles de jugadores que ya confían en GW2 Farming Hub
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 