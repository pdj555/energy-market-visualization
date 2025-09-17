import { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ErrorState from '@/components/ErrorState';
import ForecastTable from '@/components/ForecastTable';
import InsightsPanel from '@/components/InsightsPanel';
import LoadingState from '@/components/LoadingState';
import MarketSummaryGrid from '@/components/MarketSummaryGrid';
import PriceChart from '@/components/PriceChart';
import { useMarketCatalog, useMarketOverview, useMarketSnapshot } from '@/api/hooks';

const App = (): JSX.Element => {
  const { data: catalog, isLoading: catalogLoading, isError: catalogError, refetch: refetchCatalog } =
    useMarketCatalog();
  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    isFetching: overviewFetching,
    refetch: refetchOverview,
  } = useMarketOverview();

  const [selectedMarket, setSelectedMarket] = useState<string>();
  const [historyHours, setHistoryHours] = useState(24);
  const [historyResolutionMinutes, setHistoryResolutionMinutes] = useState(15);
  const [forecastHours, setForecastHours] = useState(12);
  const forecastResolutionMinutes = 60;

  useEffect(() => {
    if (!selectedMarket && catalog && catalog.length > 0) {
      setSelectedMarket(catalog[0].code);
    }
  }, [catalog, selectedMarket]);

  const snapshotParams = useMemo(
    () => ({
      historyHours,
      historyResolutionMinutes,
      forecastHours,
      forecastResolutionMinutes,
    }),
    [historyHours, historyResolutionMinutes, forecastHours, forecastResolutionMinutes],
  );

  const {
    data: snapshot,
    isLoading: snapshotLoading,
    isError: snapshotError,
    isFetching: snapshotFetching,
    refetch: refetchSnapshot,
  } = useMarketSnapshot(selectedMarket, snapshotParams);

  const isLoading = catalogLoading || overviewLoading || snapshotLoading || !selectedMarket;
  const hasError = catalogError || overviewError || snapshotError;

  const handleRefresh = () => {
    void refetchCatalog();
    void refetchOverview();
    void refetchSnapshot();
  };

  if (hasError) {
    return <ErrorState onRetry={handleRefresh} />;
  }

  if (isLoading || !catalog || !overview || !snapshot || !selectedMarket) {
    return <LoadingState />;
  }

  const isRefreshing = snapshotFetching || overviewFetching;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader
        markets={catalog}
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
        lastUpdated={snapshot.overview.lastUpdated}
        isRefreshing={isRefreshing}
        historyHours={historyHours}
        onHistoryHoursChange={setHistoryHours}
        historyResolutionMinutes={historyResolutionMinutes}
        onHistoryResolutionChange={setHistoryResolutionMinutes}
        forecastHours={forecastHours}
        onForecastHoursChange={setForecastHours}
        onRefresh={handleRefresh}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-200">Market overview</h2>
          <p className="text-sm text-slate-400">
            Select a market to explore intraday fundamentals, price formation and forecasted risk.
          </p>
          <MarketSummaryGrid
            overviews={overview}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
          />
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 lg:col-span-2">
            <PriceChart priceSeries={snapshot.priceSeries} selectedMarketName={snapshot.overview.name} />
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <ForecastTable forecast={snapshot.forecast} />
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
          <InsightsPanel insights={snapshot.insights} marketName={snapshot.overview.name} />
        </section>
      </main>
    </div>
  );
};

export default App;
