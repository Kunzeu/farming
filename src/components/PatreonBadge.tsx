'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getPatreonBadge } from '@/lib/patreon-benefits';
import { Crown } from 'lucide-react';

interface PatreonBadgeProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * Componente que muestra un badge de Patreon para usuarios patrocinadores
 */
export default function PatreonBadge({ className = '', showIcon = true }: PatreonBadgeProps) {
  const { user } = useAuth();
  const badge = getPatreonBadge(user);

  if (!badge?.show) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{
        backgroundColor: `${badge.color}20`,
        borderColor: badge.color,
        borderWidth: '1px',
        color: badge.color,
      }}
    >
      {showIcon && <Crown className="w-3 h-3" />}
      <span>{badge.text}</span>
    </div>
  );
}
