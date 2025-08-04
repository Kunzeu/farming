// Utilidades para validación de email

// Regex más robusta para validación de email
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Validación de formato de email
export const validateEmailFormat = (email: string): { isValid: boolean; message: string } => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: 'Please enter a valid email format' };
  }

  // Validaciones adicionales
  if (email.length > 254) {
    return { isValid: false, message: 'Email is too long' };
  }

  if (email.includes('..') || email.includes('--')) {
    return { isValid: false, message: 'Email contains invalid characters' };
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
      return { isValid: false, message: 'This email is already registered' };
    }
    
    return { isValid: true, message: '' };
  } catch (error) {
    // If there's an error in the query, we assume it's valid to not block registration
    console.warn('Error checking unique email:', error);
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