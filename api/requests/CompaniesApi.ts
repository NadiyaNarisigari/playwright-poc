import { APIRequestContext, APIResponse, TestInfo, expect } from '@playwright/test';
import Ajv from 'ajv';
import { getApiBaseUrl } from '../../config/api';
import { companiesResponseSchema, CompaniesResponse } from '../schemas/companiesSchema';

// The schema is compiled once when the file loads, not on every test (cheaper for parallel runs)
const ajv = new Ajv({ allErrors: true });
const validateCompaniesResponse = ajv.compile(companiesResponseSchema);

// Calls GET /access-management/v1/companies for one company type (e.g. "customer").
// Pass no token to send the request without an Authorization header (negative tests).
export const getCompanies = async (
  request: APIRequestContext,
  token: string | undefined,
  companyType: string,
): Promise<APIResponse> => {
  return request.get(`${getApiBaseUrl()}/access-management/v1/companies`, {
    params: {
      includeFields: 'companyName',
      companyType,
      pageNumber: '0',
      search: '',
    },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Checks the response is 200 with a JSON body, and returns the body
export const verifyJsonResponse = async (response: APIResponse) => {
  expect(response.status(), 'A 401 or 403 usually means QA_API_TOKEN has expired; refresh it in .env').toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();
  expect(body).toBeTruthy();
  return body;
};

// Checks the body matches the companies response schema, listing every mismatch if it does not
export const verifyCompaniesSchema = (body: unknown): CompaniesResponse => {
  const valid = validateCompaniesResponse(body);
  expect(
    valid,
    `Response does not match the schema:\n${ajv.errorsText(validateCompaniesResponse.errors, { separator: '\n' })}`,
  ).toBe(true);
  return body as CompaniesResponse;
};

// Checks the request was rejected with the expected status and no company data came back
export const verifyUnauthorized = async (response: APIResponse, expectedStatus: 401 | 403) => {
  expect(response.status(), 'Expected the API to reject the request').toBe(expectedStatus);
  const text = await response.text();
  expect(text, 'A rejected response must not contain company data').not.toContain('companyName');
};

// Attaches the response body to the HTML report (never the request headers, so the token stays out)
export const attachResponseBody = async (testInfo: TestInfo, name: string, body: unknown) => {
  await testInfo.attach(name, {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });
};