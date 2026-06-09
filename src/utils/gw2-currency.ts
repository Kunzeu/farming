/** Formato GW2 estándar: siempre 00g 00s 00c (con ceros a la izquierda). */
export function formatGW2Currency(copper: number): string {
  const rounded = Math.round(Math.max(0, copper));
  const gold = Math.floor(rounded / 10000);
  const silver = Math.floor((rounded % 10000) / 100);
  const c = rounded % 100;

  return `${gold.toString().padStart(2, '0')}g ${silver.toString().padStart(2, '0')}s ${c.toString().padStart(2, '0')}c`;
}
