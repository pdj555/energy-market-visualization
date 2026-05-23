'use client';

import dynamic from 'next/dynamic';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { ControlBar } from '@/components/dashboard/control-bar';
import { ForecastPanel } from '@/components/dashboard/forecast-panel';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { MarketGrid } from '@/components/dashboard/market-grid';
import { MarketSpotlight } from '@/components/dashboard/market-spotlight';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { NousSection } from '@/components/ui/nous-section';

const PriceChart = dynamic(
  () => import('@/components/dashboard/price-chart').then(mod => mod.PriceChart),
  {
    ssr: false,
    loading: () => <p className="label-caps py-12 text-center">Loading chart…</p>,
  }
);

export function DashboardView() {
  const dashboard = useDashboard();

  if (dashboard.hasError) {
    return (
      <DashboardShell>
        <SiteNav isLive={false} />
        <ErrorState onRetry={dashboard.refresh} />
      </DashboardShell>
    );
  }

  if (
    dashboard.isLoading ||
    !dashboard.catalog ||
    !dashboard.overview ||
    !dashboard.snapshot ||
    !dashboard.selectedMarket
  ) {
    return (
      <DashboardShell>
        <SiteNav isLive={false} />
        <LoadingState />
      </DashboardShell>
    );
  }

  const activeOverview =
    dashboard.overview.find(m => m.code === dashboard.selectedMarket) ?? dashboard.snapshot.overview;

  const peerMarkets = dashboard.overview.filter(market => market.code !== dashboard.selectedMarket);

  return (
    <DashboardShell>
      <SiteNav isLive={!dashboard.isRefreshing} />

      <NousSection title="Controls">
        <ControlBar
          markets={dashboard.catalog}
          selectedMarket={dashboard.selectedMarket}
          onSelectMarket={dashboard.setSelectedMarket}
          historyHours={dashboard.historyHours}
          onHistoryHoursChange={dashboard.setHistoryHours}
          historyResolutionMinutes={dashboard.historyResolutionMinutes}
          onHistoryResolutionChange={dashboard.setHistoryResolutionMinutes}
          forecastHours={dashboard.forecastHours}
          onForecastHoursChange={dashboard.setForecastHours}
          onRefresh={dashboard.refresh}
        />
      </NousSection>

      <main className="flex flex-1 flex-col gap-2 sm:gap-3">
        <NousSection id="markets" title="Active Market">
          <MarketSpotlight overview={activeOverview} isRefreshing={dashboard.isRefreshing} />
        </NousSection>

        {peerMarkets.length > 0 ? (
          <NousSection title="Other Regions">
            <MarketGrid
              overviews={peerMarkets}
              selectedMarket={dashboard.selectedMarket}
              onSelectMarket={dashboard.setSelectedMarket}
            />
          </NousSection>
        ) : null}

        <div className="grid grid-cols-1 gap-2 sm:gap-3 xl:grid-cols-3">
          <NousSection
            id="analytics"
            title="Price & Demand"
            className="xl:col-span-2"
            contentClassName="min-h-[360px]"
          >
            <PriceChart
              priceSeries={dashboard.snapshot.priceSeries}
              marketName={dashboard.snapshot.overview.name}
            />
          </NousSection>
          <NousSection title="Forecast Envelope" flush contentClassName="min-h-[360px]">
            <ForecastPanel forecast={dashboard.snapshot.forecast} />
          </NousSection>
        </div>

        <NousSection id="insights" title="Window Statistics">
          <InsightsPanel
            insights={dashboard.snapshot.insights}
            marketName={dashboard.snapshot.overview.name}
          />
        </NousSection>
      </main>

      <SiteFooter />
    </DashboardShell>
  );
}
