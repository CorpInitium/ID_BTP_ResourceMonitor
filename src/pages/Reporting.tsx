import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { fetchUsageData, fetchCostData } from '../services/sapApi';
import { UsageRecord } from '../types/usage';
import { CostRecord } from '../types/cost';
import UsageCharts from '../components/UsageCharts';
import CostCharts from '../components/CostCharts';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getCurrentYearMonth } from '../utils/date';
import { parseApiRecords } from '../utils/parseApiResponse';
import { normalizeCostRecords } from '../utils/normalizeCostRecord';

type ReportType = 'usage' | 'cost';

const REPORT_FROM_DATE = '202401';
const REPORT_TO_DATE = getCurrentYearMonth();

export default function Reporting() {
  const [reportType, setReportType] = useState<ReportType>('usage');
  const [usageData, setUsageData] = useState<UsageRecord[]>([]);
  const [costData, setCostData] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usage, cost] = await Promise.all([
        fetchUsageData(REPORT_FROM_DATE, REPORT_TO_DATE).catch(() => null),
        fetchCostData(REPORT_FROM_DATE, REPORT_TO_DATE).catch(() => null),
      ]);

      setUsageData(parseApiRecords<UsageRecord>(usage) ?? []);
      const costRecords = parseApiRecords<Record<string, unknown>>(cost);
      setCostData(costRecords ? normalizeCostRecords(costRecords) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Analytics Dashboard</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportType('usage')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                reportType === 'usage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Usage Analytics
            </button>
            <button
              onClick={() => setReportType('cost')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                reportType === 'cost'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cost Analytics
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Showing data from {REPORT_FROM_DATE.replace(/(\d{4})(\d{2})/, '$1-$2')} to{' '}
          {REPORT_TO_DATE.replace(/(\d{4})(\d{2})/, '$1-$2')}
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading && <LoadingSpinner />}

      {!loading && !error && reportType === 'usage' && <UsageCharts data={usageData} />}

      {!loading && !error && reportType === 'cost' && <CostCharts data={costData} />}
    </div>
  );
}
