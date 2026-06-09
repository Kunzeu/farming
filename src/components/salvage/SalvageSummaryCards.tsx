'use client';

import { Minus, Package, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import SalvageCurrency from '@/components/salvage/SalvageCurrency';
import { getTierTheme, type UnidentifiedGearTier } from '@/components/salvage/salvage-config';

interface SalvageSummaryCardsProps {
  tier: UnidentifiedGearTier;
  totalMaterialsValue: number;
  totalCost: number;
  totalKitCost: number;
  totalProfit: number;
  quantity: number;
  costGearLabel: string;
  unidentifiedGearPrice: number | null;
}

export default function SalvageSummaryCards({
  tier,
  totalMaterialsValue,
  totalCost,
  totalKitCost,
  totalProfit,
  quantity,
  costGearLabel,
  unidentifiedGearPrice,
}: SalvageSummaryCardsProps) {
  const { t } = useI18n();
  const theme = getTierTheme(tier);
  const profitPositive = totalProfit >= 0;
  const ProfitIcon = profitPositive ? TrendingUp : TrendingDown;

  const breakdown = [
    {
      label: t('salvagePages.totalMaterialsValue', 'Total Materials Value'),
      value: totalMaterialsValue,
      icon: Plus,
      tone: 'text-emerald-400/80',
    },
    {
      label: costGearLabel.replace('{quantity}', quantity.toString()),
      value: unidentifiedGearPrice ? totalCost : null,
      sub: unidentifiedGearPrice
        ? `${t('salvagePages.eachTP', 'each (TP)')}`
        : t('salvageCommon.loadingPrice', 'Loading price...'),
      icon: Minus,
      tone: 'text-rose-400/80',
    },
    {
      label: t('salvagePages.kitCost', 'Kit Cost'),
      value: totalKitCost,
      icon: Minus,
      tone: 'text-orange-400/80',
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm">
      <div className="border-b border-slate-600/50 px-6 py-8 sm:px-8">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {t('salvagePages.totalProfit', 'Total Profit')}
              </p>
              <div className={`mt-2 flex items-center gap-3 ${profitPositive ? theme.profitPositive : theme.profitNegative}`}>
                <ProfitIcon className="h-7 w-7 shrink-0 opacity-80" />
                <SalvageCurrency copper={totalProfit} size="xl" signed />
              </div>
            </div>
            <div className={`self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${theme.border} ${theme.accent} bg-white/[0.03]`}>
              {profitPositive
                ? t('salvage.profit.positive', 'Profitable')
                : t('salvage.profit.negative', 'Loss')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-slate-600/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {breakdown.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="px-5 py-4">
              <div className={`mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${item.tone}`}>
                <Icon className="h-3.5 w-3.5" />
                <span className="leading-tight">{item.label}</span>
              </div>
              {item.value !== null ? (
                <SalvageCurrency copper={item.value} size="lg" />
              ) : (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Package className="h-4 w-4 animate-pulse" />
                  {item.sub}
                </div>
              )}
              {item.value !== null && item.sub && (
                <p className="mt-1 text-xs text-zinc-600">{item.sub}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
