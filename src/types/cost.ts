export interface CostRecord {
  GlobalAccountName: string;
  SubaccountName: string;
  ReportYearMonth: number;
  ServiceName: string;
  PlanName: string;
  MetricName: string;
  UnitPlural: string;
  Usage: number;
  Currency: string;
  Cost: number;
  Quota: number;
  ActualUsage: number;
  ChargedBlocks: number;
  [key: string]: any;
}

export interface CostFilters {
  globalAccounts: string[];
  subaccounts: string[];
  services: string[];
  reportYearMonths: string[];
}
