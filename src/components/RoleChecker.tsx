'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';

export default function RoleChecker() {
  // Este componente no renderiza nada, solo ejecuta el hook
  useRoleCheck();
  
  return null;
} 