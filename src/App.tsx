import { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import UsageMonitor from './pages/UsageMonitor';
import CostAnalysis from './pages/CostAnalysis';
import Reporting from './pages/Reporting';

type Page = 'usage' | 'cost' | 'reporting';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reporting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">SAP BTP Monitor</h1>
          </div>
          <p className="text-slate-600">Track and analyze your SAP Business Technology Platform usage and costs</p>
        </header>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setCurrentPage('usage')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                currentPage === 'usage'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Usage Monitor
            </button>
            <button
              onClick={() => setCurrentPage('cost')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                currentPage === 'cost'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Cost Analysis
            </button>
            <button
              onClick={() => setCurrentPage('reporting')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                currentPage === 'reporting'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Reporting
            </button>
          </div>
        </div>

        {currentPage === 'usage' && <UsageMonitor />}
        {currentPage === 'cost' && <CostAnalysis />}
        {currentPage === 'reporting' && <Reporting />}
      </div>
    </div>
  );
}

export default App;
