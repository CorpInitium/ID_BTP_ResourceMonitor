import { useState } from 'react';
import { UsageRecord } from '../types/usage';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface UsageTableProps {
  data: UsageRecord[];
}

type SortField = keyof UsageRecord;
type SortDirection = 'asc' | 'desc' | null;

export default function UsageTable({ data }: UsageTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Aggregate data by key fields
  const aggregatedData = data.reduce((acc, record) => {
    const key = `${record.globalAccountName}-${record.subaccountName}-${record.reportYearMonth}-${record.serviceName}-${record.plan}-${record.environmentInstanceName}-${record.spaceName}-${record.metricName}`;

    if (acc[key]) {
      acc[key].usage += record.usage;
    } else {
      acc[key] = { ...record };
    }

    return acc;
  }, {} as Record<string, UsageRecord>);

  const aggregatedArray = Object.values(aggregatedData);

  const sortedData = [...aggregatedArray].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === null || bVal === null) return 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal);
    const bStr = String(bVal);

    return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">No usage data available for the selected filters.</p>
      </div>
    );
  }

  const excludedFields = [
    'globalAccountId',
    'subaccountId',
    'directoryId',
    'directoryName',
    'serviceId',
    'environmentInstanceId',
    'instanceId',
    'spaceId',
    'unitSingular',
    'unitPlural',
    'identityZone',
    'dataCenter',
    'dataCenterName',
    'startIsoDate',
    'endIsoDate',
    'application',
    'measureId'
  ];

  const allKeys = aggregatedArray.length > 0
    ? Object.keys(aggregatedArray[0]).filter(key => !excludedFields.includes(key))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {allKeys.map((key) => (
                <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort(key as SortField)}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()} <SortIcon field={key as SortField} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((record, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {allKeys.map((key) => {
                  const value = record[key as keyof UsageRecord];
                  let displayValue: string;

                  if (value === null || value === undefined) {
                    displayValue = '-';
                  } else if (key === 'reportYearMonth') {
                    displayValue = String(value).replace(/(\d{4})(\d{2})/, '$1-$2');
                  } else if (typeof value === 'number') {
                    displayValue = value.toLocaleString();
                  } else {
                    displayValue = String(value);
                  }

                  return (
                    <td key={key} className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap">
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
