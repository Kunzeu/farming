// Client-side password utilities
// Note: Actual password hashing is done server-side for security

/**
 * Validate password strength (client-side validation)
 * @param password - Password to validate
 * @param t - Translation function (optional)
 * @returns Object with validation result and errors
 */
export function validatePasswordStrength(password: string, t?: (key: string) => string): {
  isValid: boolean;
  errors: string[];
  score: number; // 0-4 (0 = very weak, 4 = very strong)
} {
  const errors: string[] = [];
  let score = 0;

  // Función de traducción por defecto (inglés)
  const defaultT = (key: string) => {
    const translations: Record<string, string> = {
      'validation.password.strength.minLength': 'Password must be at least 8 characters',
      'validation.password.strength.uppercase': 'Password must contain at least one uppercase letter',
      'validation.password.strength.lowercase': 'Password must contain at least one lowercase letter',
      'validation.password.strength.number': 'Password must contain at least one number',
      'validation.password.strength.special': 'Password must contain at least one special character',
      'validation.password.strength.common': 'Password is too common, please choose a more unique password'
    };
    return translations[key] || key;
  };

  const translate = t || defaultT;

  // Length check
  if (password.length < 8) {
    errors.push(translate('validation.password.strength.minLength'));
  } else if (password.length >= 12) {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push(translate('validation.password.strength.uppercase'));
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push(translate('validation.password.strength.lowercase'));
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push(translate('validation.password.strength.number'));
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(translate('validation.password.strength.special'));
  } else {
    score += 1;
  }

  // Common password check - deshabilitado para evitar confusión
  // const commonPasswords = [
  //   'password', '123456', '123456789', 'qwerty', 'abc123', 
  //   'password123', 'admin', 'letmein', 'welcome', 'monkey',
  //   '12345678', '123123', '111111', '000000', 'iloveyou',
  //   'sunshine', 'princess', 'dragon', 'master', 'hello'
  // ];
  
  // // Solo marcar como común si es exactamente una de las contraseñas de la lista
  // if (commonPasswords.includes(password.toLowerCase())) {
  //   errors.push(translate('validation.password.strength.common'));
  //   score = Math.max(0, score - 2);
  // }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(4, Math.max(0, score))
  };
}

/**
 * Generate a secure random password
 * @param length - Length of password (default: 16)
 * @returns Generated password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Ensure at least one character from each required category
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
