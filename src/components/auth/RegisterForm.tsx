'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterCredentials } from '@/types/auth';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function RegisterForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validation, setValidation] = useState({
    username: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' },
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'username':
        if (value.length < 3) {
          return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
        }
        if (value.length > 20) {
          return { isValid: false, message: 'El nombre de usuario no puede tener más de 20 caracteres' };
        }
        return { isValid: true, message: '' };

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, message: 'Ingresa un email válido' };
        }
        return { isValid: true, message: '' };

      case 'password':
        if (value.length < 6) {
          return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
        }
        if (!/(?=.*\d)/.test(value)) {
          return { isValid: false, message: 'La contraseña debe contener al menos un número' };
        }
        return { isValid: true, message: '' };

      case 'confirmPassword':
        if (value !== formData.password) {
          return { isValid: false, message: 'Las contraseñas no coinciden' };
        }
        return { isValid: true, message: '' };

      default:
        return { isValid: false, message: '' };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar campo en tiempo real
    const fieldValidation = validateField(name, value);
    setValidation({
      ...validation,
      [name]: fieldValidation,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validar todos los campos
    const usernameValidation = validateField('username', formData.username);
    const emailValidation = validateField('email', formData.email);
    const passwordValidation = validateField('password', formData.password);
    const confirmPasswordValidation = validateField('confirmPassword', formData.confirmPassword);

    setValidation({
      username: usernameValidation,
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
    });

    // Verificar si todos los campos son válidos
    if (usernameValidation.isValid && emailValidation.isValid && 
        passwordValidation.isValid && confirmPasswordValidation.isValid) {
      await register(formData);
    }
  };

  const isFormValid = () => {
    return Object.values(validation).every(field => field.isValid);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Crear Cuenta
          </h2>
          <p className="text-gray-400">
            Únete a la comunidad de GW2 Farming Hub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-10 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validation.username.isValid 
                    ? 'border-green-600' 
                    : formData.username 
                    ? 'border-red-600' 
                    : 'border-gray-600'
                }`}
                placeholder="Tu nombre de usuario"
              />
              {validation.username.isValid && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              )}
            </div>
            {formData.username && !validation.username.isValid && (
              <p className="text-red-400 text-xs mt-1">{validation.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-10 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validation.email.isValid 
                    ? 'border-green-600' 
                    : formData.email 
                    ? 'border-red-600' 
                    : 'border-gray-600'
                }`}
                placeholder="tu@email.com"
              />
              {validation.email.isValid && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              )}
            </div>
            {formData.email && !validation.email.isValid && (
              <p className="text-red-400 text-xs mt-1">{validation.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validation.password.isValid 
                    ? 'border-green-600' 
                    : formData.password 
                    ? 'border-red-600' 
                    : 'border-gray-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && !validation.password.isValid && (
              <p className="text-red-400 text-xs mt-1">{validation.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validation.confirmPassword.isValid 
                    ? 'border-green-600' 
                    : formData.confirmPassword 
                    ? 'border-red-600' 
                    : 'border-gray-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && !validation.confirmPassword.isValid && (
              <p className="text-red-400 text-xs mt-1">{validation.confirmPassword.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
} 