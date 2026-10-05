// API gateway base URLs. Only QA is confirmed; add the other environments once known.
const apiBaseUrls: Record<string, string> = {
  qa: 'https://gateway.mosaic-qa.sensproducts.siemens-energy.com',
};

export function getApiBaseUrl(): string {
  const environmentName = process.env.TEST_ENV ?? 'qa';
  const url = apiBaseUrls[environmentName];
  if (!url) {
    throw new Error(`No API base URL configured for TEST_ENV "${environmentName}". Add it to config/api.ts.`);
  }
  return url;
}