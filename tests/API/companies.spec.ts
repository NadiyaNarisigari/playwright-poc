import { test } from '@playwright/test';
import { getCompanies, verifyJsonResponse, attachResponseBody } from '../../api/CompaniesApi';

// Bearer token copied manually into .env (without the word "Bearer"). It expires; refresh it on a 401.
const token = process.env.QA_API_TOKEN;

test.describe('Companies API', () => {
  test.skip(!token, 'QA_API_TOKEN is not set in .env');

  test('GET companies (type customer) returns 200 with a JSON body', async ({ request }, testInfo) => {
    let body: unknown;

    await test.step('Call GET /companies for customers', async () => {
      const response = await getCompanies(request, token!, 'customer');
      body = await verifyJsonResponse(response);
    });

    await test.step('Attach the response to the report', async () => {
      await attachResponseBody(testInfo, 'companies-response', body);
    });
  });
});