import { useState } from 'react';
import { CostRecord } from '../types/cost';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface CostTableProps {
  data: CostRecord[];
}

type SortField = keyof CostRecord;
type SortDirection = 'asc' | 'desc' | null;

export default function CostTable({ data }: CostTableProps) {
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

  const sortedData = [...data].sort((a, b) => {
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
        <p className="text-slate-500">No cost data available for the selected filters.</p>
      </div>
    );
  }

  const displayFields = [
    'GlobalAccountName',
    'SubaccountName',
    'ReportYearMonth',
    'ServiceName',
    'PlanName',
    'MetricName',
    'UnitPlural',
    'Usage',
    'Currency',
    'Cost',
    'Quota',
    'ActualUsage',
    'ChargedBlocks'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {displayFields.map((key) => (
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
                {displayFields.map((key) => {
                  const value = record[key as keyof CostRecord];
                  let displayValue: string;

                  if (value === null || value === undefined) {
                    displayValue = '-';
                  } else if (key === 'ReportYearMonth') {
                    displayValue = String(value).replace(/(\d{4})(\d{2})/, '$1-$2');
                  } else if (key === 'Cost' || key === 'Usage' || key === 'Quota' || key === 'ActualUsage' || key === 'ChargedBlocks') {
                    displayValue = typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(value);
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
