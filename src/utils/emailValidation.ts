// Utilidades para validación de email

// Regex más robusta para validación de email
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Validación de formato de email
export const validateEmailFormat = (email: string): { isValid: boolean; message: string } => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'El email es requerido' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: 'Ingresa un formato de email válido' };
  }

  // Validaciones adicionales
  if (email.length > 254) {
    return { isValid: false, message: 'El email es demasiado largo' };
  }

  if (email.includes('..') || email.includes('--')) {
    return { isValid: false, message: 'El email contiene caracteres inválidos' };
  }

  return { isValid: true, message: '' };
};

// Validación de email único (para registro)
export const validateEmailUnique = async (email: string): Promise<{ isValid: boolean; message: string }> => {
  try {
    const { getDbService } = await import('@/lib/database-switch');
    const dbService = await getDbService();
    
    const existingUser = await dbService.getUserByEmail(email);
    
    if (existingUser) {
      return { isValid: false, message: 'Este email ya está registrado' };
    }
    
    return { isValid: true, message: '' };
  } catch (error) {
    // Si hay error en la consulta, asumimos que es válido para no bloquear el registro
    console.warn('Error verificando email único:', error);
    return { isValid: true, message: '' };
  }
};

// Validación completa de email (formato + único)
export const validateEmailComplete = async (email: string): Promise<{ isValid: boolean; message: string }> => {
  // Primero validar formato
  const formatValidation = validateEmailFormat(email);
  if (!formatValidation.isValid) {
    return formatValidation;
  }

  // Luego validar que sea único
  return await validateEmailUnique(email);
};

// Validación simple para login (solo formato)
export const validateEmailForLogin = (email: string): { isValid: boolean; message: string } => {
  return validateEmailFormat(email);
};

// Función para limpiar y normalizar email
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
}; 