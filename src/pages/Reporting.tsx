import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { fetchUsageData, fetchCostData } from '../services/sapApi';
import { UsageRecord } from '../types/usage';
import { CostRecord } from '../types/cost';
import UsageCharts from '../components/UsageCharts';
import CostCharts from '../components/CostCharts';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type ReportType = 'usage' | 'cost';

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
        fetchUsageData('202501', '202510').catch(() => []),
        fetchCostData().catch(() => []),
      ]);

      let usageRecords: UsageRecord[] = [];
      if (Array.isArray(usage)) {
        usageRecords = usage;
      } else if (usage && typeof usage === 'object') {
        if (Array.isArray(usage.content)) {
          usageRecords = usage.content;
        } else if (Array.isArray(usage.data)) {
          usageRecords = usage.data;
        } else if (Array.isArray(usage.records)) {
          usageRecords = usage.records;
        } else if (Array.isArray(usage.results)) {
          usageRecords = usage.results;
        }
      }

      let costRecords: CostRecord[] = [];
      if (Array.isArray(cost)) {
        costRecords = cost;
      } else if (cost && typeof cost === 'object') {
        if (Array.isArray(cost.value)) {
          costRecords = cost.value;
        } else if (Array.isArray(cost.d?.results)) {
          costRecords = cost.d.results;
        } else if (Array.isArray(cost.content)) {
          costRecords = cost.content;
        } else if (Array.isArray(cost.data)) {
          costRecords = cost.data;
        } else if (Array.isArray(cost.records)) {
          costRecords = cost.records;
        } else if (Array.isArray(cost.results)) {
          costRecords = cost.results;
        }
      }

      setUsageData(usageRecords);
      setCostData(costRecords);
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
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading && <LoadingSpinner />}

      {!loading && !error && reportType === 'usage' && <UsageCharts data={usageData} />}

      {!loading && !error && reportType === 'cost' && <CostCharts data={costData} />}
    </div>
  );
}
