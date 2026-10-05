import { test, expect } from '@playwright/test';
import { getApiBaseUrl } from '../../config/api';

// Bearer token copied manually into .env (without the word "Bearer"). It expires; refresh it on a 401.
const token = process.env.QA_API_TOKEN;

test.describe('Companies API', () => {
  test.skip(!token, 'QA_API_TOKEN is not set in .env');

  test('GET companies (type customer) returns 200 with a JSON body', async ({ request }, testInfo) => {
    const apiBaseUrl = getApiBaseUrl();

    const response = await request.get(`${apiBaseUrl}/access-management/v1/companies`, {
      params: {
        includeFields: 'companyName',
        companyType: 'customer',
        pageNumber: '0',
        search: '',
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status(), 'A 401 usually means QA_API_TOKEN has expired').toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body).toBeTruthy();

    // Attach only the response body (never request headers), so the token stays out of reports.
    await testInfo.attach('companies-response', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json',
    });
  });
});