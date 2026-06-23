import { useState, useMemo } from 'react';
import { Filter, DollarSign, RefreshCw } from 'lucide-react';
import { fetchCostData } from '../services/sapApi';
import { CostRecord, CostFilters } from '../types/cost';
import DateRangePicker from '../components/DateRangePicker';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import CostTable from '../components/CostTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getCurrentYearMonth } from '../utils/date';
import { parseApiRecords } from '../utils/parseApiResponse';
import { normalizeCostRecords } from '../utils/normalizeCostRecord';

export default function CostAnalysis() {
  const [fromDate, setFromDate] = useState('202401');
  const [toDate, setToDate] = useState(getCurrentYearMonth);
  const [rawData, setRawData] = useState<CostRecord[]>([]);
  const [filters, setFilters] = useState<CostFilters>({
    globalAccounts: [],
    subaccounts: [],
    services: [],
    reportYearMonths: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableOptions = useMemo(() => {
    return {
      globalAccounts: Array.from(new Set(rawData.map((r) => r.GlobalAccountName))).sort(),
      subaccounts: Array.from(new Set(rawData.map((r) => r.SubaccountName))).sort(),
      services: Array.from(new Set(rawData.map((r) => r.ServiceName))).sort(),
      reportYearMonths: Array.from(new Set(rawData.map((r) => String(r.ReportYearMonth).replace(/(\d{4})(\d{2})/, '$1-$2')))).sort().reverse(),
    };
  }, [rawData]);

  const filteredData = useMemo(() => {
    return rawData.filter((record) => {
      if (filters.globalAccounts.length > 0 && !filters.globalAccounts.includes(record.GlobalAccountName)) {
        return false;
      }
      if (filters.subaccounts.length > 0 && !filters.subaccounts.includes(record.SubaccountName)) {
        return false;
      }
      if (filters.services.length > 0 && !filters.services.includes(record.ServiceName)) {
        return false;
      }
      if (filters.reportYearMonths.length > 0) {
        const formattedMonth = String(record.ReportYearMonth).replace(/(\d{4})(\d{2})/, '$1-$2');
        if (!filters.reportYearMonths.includes(formattedMonth)) {
          return false;
        }
      }
      return true;
    });
  }, [rawData, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCostData(fromDate, toDate);
      console.log('Raw Cost API Response:', data);

      const records = parseApiRecords<CostRecord>(data);

      if (!records) {
        console.error('Unknown data structure:', data);
        setRawData([]);
        setError(
          `Invalid data format. Response structure: ${
            data && typeof data === 'object' ? JSON.stringify(Object.keys(data)) : 'unknown'
          }`
        );
        return;
      }

      setRawData(normalizeCostRecords(records as Record<string, unknown>[]));
    } catch (err) {
      setRawData([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch cost data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadData = () => {
    setFilters({
      globalAccounts: [],
      subaccounts: [],
      services: [],
      reportYearMonths: [],
    });
    loadData();
  };

  const hasActiveFilters =
    filters.globalAccounts.length > 0 ||
    filters.subaccounts.length > 0 ||
    filters.services.length > 0 ||
    filters.reportYearMonths.length > 0;

  const totalCost = useMemo(() => {
    return filteredData.reduce((sum, record) => sum + (record.Cost || 0), 0);
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        </div>

        <div className="space-y-4">
          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />

          <button
            onClick={handleLoadData}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Load Data'}
          </button>

          {rawData.length > 0 && (
            <>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Filter by:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MultiSelectDropdown
                    label="Global Account"
                    options={availableOptions.globalAccounts}
                    selected={filters.globalAccounts}
                    onChange={(selected) => setFilters({ ...filters, globalAccounts: selected })}
                    placeholder="All accounts"
                  />
                  <MultiSelectDropdown
                    label="Subaccount"
                    options={availableOptions.subaccounts}
                    selected={filters.subaccounts}
                    onChange={(selected) => setFilters({ ...filters, subaccounts: selected })}
                    placeholder="All subaccounts"
                  />
                  <MultiSelectDropdown
                    label="Service"
                    options={availableOptions.services}
                    selected={filters.services}
                    onChange={(selected) => setFilters({ ...filters, services: selected })}
                    placeholder="All services"
                  />
                  <MultiSelectDropdown
                    label="Report Year Month"
                    options={availableOptions.reportYearMonths}
                    selected={filters.reportYearMonths}
                    onChange={(selected) => setFilters({ ...filters, reportYearMonths: selected })}
                    placeholder="All months"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Active filters:</span>
                  <span className="font-medium text-blue-600">
                    {filters.globalAccounts.length + filters.subaccounts.length + filters.services.length + filters.reportYearMonths.length} selected
                  </span>
                  <button
                    onClick={() =>
                      setFilters({
                        globalAccounts: [],
                        subaccounts: [],
                        services: [],
                        reportYearMonths: [],
                      })
                    }
                    className="ml-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading && <LoadingSpinner />}

      {!loading && !error && rawData.length > 0 && (
        <>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8" />
              <h3 className="text-lg font-semibold">Total Cost</h3>
            </div>
            <p className="text-4xl font-bold">
              {filteredData.length > 0 && filteredData[0].Currency ? filteredData[0].Currency : ''}{' '}
              {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-emerald-100 text-sm mt-1">
              Based on {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
            </p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Cost Details
              <span className="ml-2 text-sm font-normal text-slate-600">
                ({filteredData.length} {filteredData.length === 1 ? 'record' : 'records'})
              </span>
            </h2>
          </div>

          <CostTable data={filteredData} />
        </>
      )}
    </div>
  );
}
