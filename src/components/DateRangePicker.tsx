import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export default function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangePickerProps) {
  const formatDateForInput = (yyyymm: string): string => {
    if (yyyymm.length !== 6) return '';
    const year = yyyymm.substring(0, 4);
    const month = yyyymm.substring(4, 6);
    return `${year}-${month}`;
  };

  const formatDateForApi = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}${month}`;
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-600" />
        <label htmlFor="fromDate" className="text-sm font-medium text-slate-700">
          From:
        </label>
        <input
          id="fromDate"
          type="month"
          value={formatDateForInput(fromDate)}
          onChange={(e) => onFromDateChange(formatDateForApi(e.target.value))}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="toDate" className="text-sm font-medium text-slate-700">
          To:
        </label>
        <input
          id="toDate"
          type="month"
          value={formatDateForInput(toDate)}
          onChange={(e) => onToDateChange(formatDateForApi(e.target.value))}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
