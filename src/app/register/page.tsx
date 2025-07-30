'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import { 
  Gift, 
  Zap, 
  Heart, 
  Award,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function RegisterPage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
        <RegisterForm />
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Únete a la Comunidad
            </h1>
            <p className="text-xl text-blue-200">
              Accede a todas las funcionalidades premium
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
                <Gift className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Acceso Gratuito
                </h3>
                <p className="text-blue-200 text-sm">
                  Todas las funcionalidades están disponibles sin costo alguno.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Datos en Tiempo Real
                </h3>
                <p className="text-blue-200 text-sm">
                  Información actualizada constantemente desde la API oficial de GW2.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Personalización
                </h3>
                <p className="text-blue-200 text-sm">
                  Guarda tus items favoritos y rutas preferidas para acceso rápido.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Comunidad Activa
                </h3>
                <p className="text-blue-200 text-sm">
                  Conecta con otros jugadores y comparte tus estrategias de farming.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-white/10 rounded-lg border border-white/20"
          >
            <h3 className="text-white font-semibold mb-2 text-center">
              ¿Por qué registrarse?
            </h3>
            <ul className="text-blue-200 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Acceso a todas las funcionalidades
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Guardar items y rutas favoritas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Notificaciones personalizadas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Historial de búsquedas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Participar en la comunidad
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 