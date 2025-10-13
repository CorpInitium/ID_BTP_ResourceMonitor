import { useMemo } from 'react';
import { CostRecord } from '../types/cost';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostChartsProps {
  data: CostRecord[];
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#ef4444', '#6366f1'];

export default function CostCharts({ data }: CostChartsProps) {
  const serviceCostData = useMemo(() => {
    const serviceMap = new Map<string, number>();
    data.forEach((record) => {
      const current = serviceMap.get(record.ServiceName) || 0;
      serviceMap.set(record.ServiceName, current + (record.Cost || 0));
    });
    return Array.from(serviceMap.entries())
      .map(([name, cost]) => ({ name, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, [data]);

  const subaccountCostData = useMemo(() => {
    const subaccountMap = new Map<string, number>();
    data.forEach((record) => {
      const current = subaccountMap.get(record.SubaccountName) || 0;
      subaccountMap.set(record.SubaccountName, current + (record.Cost || 0));
    });
    return Array.from(subaccountMap.entries())
      .map(([name, cost]) => ({ name, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 8);
  }, [data]);

  const monthlyTrendData = useMemo(() => {
    const monthMap = new Map<string, number>();
    data.forEach((record) => {
      const month = String(record.ReportYearMonth).replace(/(\d{4})(\d{2})/, '$1-$2');
      const current = monthMap.get(month) || 0;
      monthMap.set(month, current + (record.Cost || 0));
    });
    return Array.from(monthMap.entries())
      .map(([month, cost]) => ({ month, cost }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  const planCostData = useMemo(() => {
    const planMap = new Map<string, number>();
    data.forEach((record) => {
      const current = planMap.get(record.PlanName) || 0;
      planMap.set(record.PlanName, current + (record.Cost || 0));
    });
    return Array.from(planMap.entries())
      .map(([name, cost]) => ({ name, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 6);
  }, [data]);

  const globalAccountCostData = useMemo(() => {
    const accountMap = new Map<string, number>();
    data.forEach((record) => {
      const current = accountMap.get(record.GlobalAccountName) || 0;
      accountMap.set(record.GlobalAccountName, current + (record.Cost || 0));
    });
    return Array.from(accountMap.entries())
      .map(([name, cost]) => ({ name, cost }))
      .sort((a, b) => b.cost - a.cost);
  }, [data]);

  const currency = data.length > 0 ? data[0].Currency : '';

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">No cost data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Services by Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${Number(value).toFixed(2)}`} />
              <Bar dataKey="cost" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost by Subaccount</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subaccountCostData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cost"
              >
                {subaccountCostData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${currency} ${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} name="Cost" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost by Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planCostData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cost"
              >
                {planCostData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${currency} ${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {globalAccountCostData.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost by Global Account</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={globalAccountCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${Number(value).toFixed(2)}`} />
              <Bar dataKey="cost" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
