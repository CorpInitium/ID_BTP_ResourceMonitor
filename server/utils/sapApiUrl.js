export function buildSapApiUrl(sapApiUrl, { fromDate, toDate }) {
  const params = new URLSearchParams({ fromDate, toDate });

  if (sapApiUrl.includes('/odata/')) {
    params.set('$format', 'json');
  }

  const separator = sapApiUrl.includes('?') ? '&' : '?';
  return `${sapApiUrl}${separator}${params}`;
}
