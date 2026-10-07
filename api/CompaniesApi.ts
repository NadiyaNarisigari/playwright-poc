import { APIRequestContext, APIResponse, TestInfo, expect } from '@playwright/test';
import { getApiBaseUrl } from '../config/api';

// Calls GET /access-management/v1/companies for one company type (e.g. "customer")
export const getCompanies = async (
  request: APIRequestContext,
  token: string,
  companyType: string,
): Promise<APIResponse> => {
  return request.get(`${getApiBaseUrl()}/access-management/v1/companies`, {
    params: {
      includeFields: 'companyName',
      companyType,
      pageNumber: '0',
      search: '',
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Checks the response is 200 with a JSON body, and returns the body
export const verifyJsonResponse = async (response: APIResponse) => {
  expect(response.status(), 'A 401 usually means QA_API_TOKEN has expired').toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();
  expect(body).toBeTruthy();
  return body;
};

// Attaches the response body to the HTML report (never the request headers, so the token stays out)
export const attachResponseBody = async (testInfo: TestInfo, name: string, body: unknown) => {
  await testInfo.attach(name, {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });
};