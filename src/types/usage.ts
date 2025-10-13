export interface UsageRecord {
  globalAccountName: string;
  subaccountName: string;
  reportYearMonth: number;
  serviceName: string;
  plan: string;
  planName: string;
  environmentInstanceName: string;
  spaceName: string;
  metricName: string;
  usage: number;
  [key: string]: any;
}

export interface Filters {
  globalAccounts: string[];
  subaccounts: string[];
  services: string[];
  spaces: string[];
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}
