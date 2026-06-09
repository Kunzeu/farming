'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import {
  UNIDENTIFIED_GEAR_TIERS,
  getTierTheme,
  type UnidentifiedGearTier,
} from '@/components/salvage/salvage-config';

interface SalvageSectionNavProps {
  activeTier?: UnidentifiedGearTier;
}

export default function SalvageSectionNav({ activeTier }: SalvageSectionNavProps) {
  const { t } = useI18n();

  return (
    <nav
      className="overflow-hidden rounded-xl border border-slate-600/50 bg-slate-800/50 p-1 backdrop-blur-sm"
      aria-label={t('salvage.nav.unidentifiedGear', 'Unidentified Gear')}
    >
      <div className="flex">
        {UNIDENTIFIED_GEAR_TIERS.map((tier) => {
          const isActive = activeTier === tier.id;
          const theme = getTierTheme(tier.id);

          return (
            <Link
              key={tier.id}
              href={tier.href}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive ? theme.tabActive : theme.tabInactive
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Image
                src={tier.gearIcon}
                alt=""
                width={22}
                height={22}
                className={`h-[22px] w-[22px] shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}
              />
              <span className="truncate">
                {t(tier.labelKey, tier.defaultLabel)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
