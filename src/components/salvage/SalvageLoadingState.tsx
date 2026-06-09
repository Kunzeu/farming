'use client';

import { useI18n } from '@/contexts/I18nContext';
import SalvagePageShell from '@/components/salvage/SalvagePageShell';
import { getTierTheme, type UnidentifiedGearTier } from '@/components/salvage/salvage-config';

interface SalvageLoadingStateProps {
  tier?: UnidentifiedGearTier;
}

export default function SalvageLoadingState({ tier = 'common' }: SalvageLoadingStateProps) {
  const { t } = useI18n();
  const theme = getTierTheme(tier);

  return (
    <SalvagePageShell>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div
            className={`mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-2 border-transparent ${theme.spinner} border-t-current`}
          />
          <p className="text-sm text-zinc-500">
            {t('salvage.loadingPrices', 'Loading prices from GW2 API...')}
          </p>
        </div>
      </div>
    </SalvagePageShell>
  );
}
