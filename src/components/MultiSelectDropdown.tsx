import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange([...options]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] px-3 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-between"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            selected.slice(0, 2).map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded"
              >
                {item}
              </span>
            ))
          )}
          {selected.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 text-sm rounded">
              +{selected.length - 2} more
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-slate-200 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectAll();
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="overflow-y-auto">
            {options.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">No options available</div>
            ) : (
              options.map((option) => (
                <div
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                    selected.includes(option) ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-sm text-slate-700">{option}</span>
                  {selected.includes(option) && <Check className="w-4 h-4 text-blue-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
