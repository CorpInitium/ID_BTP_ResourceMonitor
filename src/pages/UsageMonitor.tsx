import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { fetchUsageData } from '../services/sapApi';
import { UsageRecord, Filters } from '../types/usage';
import DateRangePicker from '../components/DateRangePicker';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import MetricCards from '../components/MetricCards';
import UsageTable from '../components/UsageTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function UsageMonitor() {
  const [fromDate, setFromDate] = useState('202501');
  const [toDate, setToDate] = useState('202510');
  const [rawData, setRawData] = useState<UsageRecord[]>([]);
  const [filters, setFilters] = useState<Filters>({
    globalAccounts: [],
    subaccounts: [],
    services: [],
    spaces: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableOptions = useMemo(() => {
    return {
      globalAccounts: Array.from(new Set(rawData.map((r) => r.globalAccountName))).sort(),
      subaccounts: Array.from(new Set(rawData.map((r) => r.subaccountName))).sort(),
      services: Array.from(new Set(rawData.map((r) => r.serviceName))).sort(),
      spaces: Array.from(new Set(rawData.map((r) => r.spaceName))).sort(),
    };
  }, [rawData]);

  const filteredData = useMemo(() => {
    return rawData.filter((record) => {
      if (filters.globalAccounts.length > 0 && !filters.globalAccounts.includes(record.globalAccountName)) {
        return false;
      }
      if (filters.subaccounts.length > 0 && !filters.subaccounts.includes(record.subaccountName)) {
        return false;
      }
      if (filters.services.length > 0 && !filters.services.includes(record.serviceName)) {
        return false;
      }
      if (filters.spaces.length > 0 && !filters.spaces.includes(record.spaceName)) {
        return false;
      }
      return true;
    });
  }, [rawData, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsageData(fromDate, toDate);
      console.log('Raw API Response:', data);

      let records: UsageRecord[] = [];

      if (Array.isArray(data)) {
        records = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.content)) {
          records = data.content;
        } else if (Array.isArray(data.data)) {
          records = data.data;
        } else if (Array.isArray(data.records)) {
          records = data.records;
        } else if (Array.isArray(data.results)) {
          records = data.results;
        } else {
          console.error('Unknown data structure:', data);
          setRawData([]);
          setError(`Invalid data format. Response structure: ${JSON.stringify(Object.keys(data))}`);
          return;
        }
      } else {
        setRawData([]);
        setError('Invalid data format received from server');
        return;
      }

      setRawData(records);
    } catch (err) {
      setRawData([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadData = () => {
    setFilters({
      globalAccounts: [],
      subaccounts: [],
      services: [],
      spaces: [],
    });
    loadData();
  };

  const hasActiveFilters =
    filters.globalAccounts.length > 0 ||
    filters.subaccounts.length > 0 ||
    filters.services.length > 0 ||
    filters.spaces.length > 0;

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
                    label="Space"
                    options={availableOptions.spaces}
                    selected={filters.spaces}
                    onChange={(selected) => setFilters({ ...filters, spaces: selected })}
                    placeholder="All spaces"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Active filters:</span>
                  <span className="font-medium text-blue-600">
                    {filters.globalAccounts.length + filters.subaccounts.length + filters.services.length + filters.spaces.length} selected
                  </span>
                  <button
                    onClick={() =>
                      setFilters({
                        globalAccounts: [],
                        subaccounts: [],
                        services: [],
                        spaces: [],
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
          <div className="mb-6">
            <MetricCards data={filteredData} />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Usage Details
              <span className="ml-2 text-sm font-normal text-slate-600">
                ({filteredData.length} {filteredData.length === 1 ? 'record' : 'records'})
              </span>
            </h2>
          </div>

          <UsageTable data={filteredData} />
        </>
      )}
    </div>
  );
}
