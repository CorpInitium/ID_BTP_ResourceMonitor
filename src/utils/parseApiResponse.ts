export function parseApiRecords<T>(data: unknown): T[] | null {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const candidates = [
    record.content,
    record.value,
    (record.d as Record<string, unknown> | undefined)?.results,
    record.data,
    record.records,
    record.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return null;
}
