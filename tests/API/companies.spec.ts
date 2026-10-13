import { test, APIResponse } from '@playwright/test';
import {
  getCompanies,
  verifyJsonResponse,
  verifyCompaniesSchema,
  verifyUnauthorized,
  attachResponseBody,
} from '../../api/requests/CompaniesApi';
import { invalidTokens } from '../../test-data/api/apiTokens';
import { requiredEnv } from '../../utils/env';

test.describe('Companies API', () => {
  test.describe('With a valid token', () => {
    test('GET companies (type customer) returns 200 with a valid body', async ({ request }, testInfo) => {
      // Bearer token copied manually into .env (without the word "Bearer"). It expires; refresh it on a 401/403.
      // Fails with a clear message if QA_API_TOKEN is missing from .env.
      const token = requiredEnv('QA_API_TOKEN');
      let body: unknown;

      await test.step('Call GET /companies for customers', async () => {
        const response = await getCompanies(request, token, 'customer');
        body = await verifyJsonResponse(response);
      });

      await test.step('Validate the response schema', async () => {
        verifyCompaniesSchema(body);
      });

      await test.step('Attach the response to the report', async () => {
        await attachResponseBody(testInfo, 'companies-response', body);
      });
    });
  });

  // These tests do not need a real token
  test.describe('Without a valid token', () => {
    test('GET companies without a token is rejected with 401', async ({ request }) => {
      let response: APIResponse;

      await test.step('Call GET /companies with no Authorization header', async () => {
        response = await getCompanies(request, undefined, 'customer');
      });

      await test.step('Check the request is rejected', async () => {
        await verifyUnauthorized(response, 401);
      });
    });

    // The gateway answers an invalid token with 403 (observed; to be confirmed with the Noedra team)
    test('GET companies with an invalid token is rejected with 403', async ({ request }) => {
      let response: APIResponse;

      await test.step('Call GET /companies with an invalid token', async () => {
        response = await getCompanies(request, invalidTokens.random, 'customer');
      });

      await test.step('Check the request is rejected', async () => {
        await verifyUnauthorized(response, 403);
      });
    });
  });
});