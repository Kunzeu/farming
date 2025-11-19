'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ContributionsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir directamente al evento
    router.replace('/contributions/contribuciones-de-la-comunidad');
  }, [router]);

  return null;
};

export default ContributionsPage;

