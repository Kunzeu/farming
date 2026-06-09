'use client';

import type { ReactNode } from 'react';

interface SalvagePageShellProps {
  children: ReactNode;
}

/** Wrapper sin fondo propio: hereda el gradiente global del layout. */
export default function SalvagePageShell({ children }: SalvagePageShellProps) {
  return <div className="min-h-screen">{children}</div>;
}
