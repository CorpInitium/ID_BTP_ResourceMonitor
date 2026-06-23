import { CostRecord } from '../types/cost';

function pick<T>(record: Record<string, unknown>, pascal: string, camel: string): T | undefined {
  return (record[pascal] ?? record[camel]) as T | undefined;
}

export function normalizeCostRecord(record: Record<string, unknown>): CostRecord {
  return {
    GlobalAccountName: pick<string>(record, 'GlobalAccountName', 'globalAccountName') ?? '',
    SubaccountName: pick<string>(record, 'SubaccountName', 'subaccountName') ?? '',
    ReportYearMonth: pick<number>(record, 'ReportYearMonth', 'reportYearMonth') ?? 0,
    ServiceName: pick<string>(record, 'ServiceName', 'serviceName') ?? '',
    PlanName: pick<string>(record, 'PlanName', 'planName') ?? '',
    MetricName: pick<string>(record, 'MetricName', 'metricName') ?? '',
    UnitPlural: pick<string>(record, 'UnitPlural', 'unitPlural') ?? '',
    Usage: pick<number>(record, 'Usage', 'usage') ?? 0,
    Currency: pick<string>(record, 'Currency', 'currency') ?? '',
    Cost: pick<number>(record, 'Cost', 'cost') ?? 0,
    Quota: pick<number>(record, 'Quota', 'quota') ?? 0,
    ActualUsage: pick<number>(record, 'ActualUsage', 'actualUsage') ?? 0,
    ChargedBlocks: pick<number>(record, 'ChargedBlocks', 'chargedBlocks') ?? 0,
    ...record,
  };
}

export function normalizeCostRecords(records: Record<string, unknown>[]): CostRecord[] {
  return records.map(normalizeCostRecord);
}
