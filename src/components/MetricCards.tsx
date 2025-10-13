import { UsageRecord } from '../types/usage';
import { Database, Server, BarChart3, Layers } from 'lucide-react';

interface MetricCardsProps {
  data: UsageRecord[];
}

export default function MetricCards({ data }: MetricCardsProps) {
  const totalUsage = data.reduce((sum, record) => sum + record.usage, 0);
  const uniqueServices = new Set(data.map((record) => record.serviceName)).size;
  const uniqueSubaccounts = new Set(data.map((record) => record.subaccountName)).size;
  const uniqueSpaces = new Set(data.map((record) => record.spaceName)).size;

  const metrics = [
    {
      title: 'Total Usage',
      value: totalUsage.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Services',
      value: uniqueServices,
      icon: Server,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Subaccounts',
      value: uniqueSubaccounts,
      icon: Database,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Spaces',
      value: uniqueSpaces,
      icon: Layers,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.title} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-8 h-8 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
