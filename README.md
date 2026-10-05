# Noedra Node QA – Playwright + TypeScript POC

Proof of concept for automated UI and API testing of the Noedra Node QA environment
(`https://qa.sensproducts.siemens-energy.com`) using Playwright and TypeScript.

## What it solves

- Repeatable end-to-end checks of core user flows (login, fleet management, factory
  creation/deletion) instead of manual regression clicks.
- API checks against the gateway in the same framework as the UI tests.
- A maintainable structure (page objects, fixtures, separated test data) that can grow
  into a full regression suite.

## Design decisions

- **Page Object Model** (`pages/`): selectors and page actions live in one place per page,
  so UI changes are fixed once rather than in every test.
- **Login fixture** (`fixtures/loginFixture.ts`): UI tests receive an already-authenticated
  page, so login logic is not repeated in each spec.
- **Semi-manual OTP**: login requires an SMS one-time password. The fixture fills email and
  password, waits for a person to type the six OTP digits in the browser, then clicks
  Submit automatically and waits for the dashboard. MFA is not bypassed.
- **API tests without a browser**: `tests/API/companies.spec.ts` uses Playwright's `request`
  fixture with a bearer token read from `QA_API_TOKEN` in `.env`. No browser login is needed.
  The response body is attached to the HTML report for inspection; request headers are not,
  so the token never appears in reports.
- **Configuration and secrets**: environment-specific values live in `config/`
  (`environments.ts`, `api.ts`). Credentials and tokens come only from `.env`, which is
  gitignored. No real credentials are in the repository.
- **Test data separation** (`test-data/`): input data is kept out of the specs so it can be
  changed without editing test logic.
- **Manual test cases in Gherkin** (`test-cases/`): plain-language scenarios that document
  what is covered, readable by testers and stakeholders.

## Project structure

```
config/                 environments.ts (app URLs), api.ts (gateway base URL)
fixtures/loginFixture.ts  Authenticated-page fixture with OTP auto-submit
pages/                  Page objects (LoginPage, OtpPage, AddFactoryPage, ...)
test-data/              users.ts, invalidCredentials.ts, factories.ts
tests/UI/               UI specs
tests/API/              API specs
test-cases/api/         Gherkin manual test cases
.env.example            Template for required environment variables
```

## Code flow

UI tests:
1. A spec requests the `loggedInPage` fixture.
2. The fixture opens the login page and fills `QA_EMAIL` and `QA_PASSWORD` from `.env`.
3. A person types the 6-digit SMS OTP in the browser.
4. Once all six digit boxes are filled, `OtpPage` clicks Submit automatically.
5. The fixture waits for the dashboard URL, then hands the page to the test.
6. The spec drives the app through page objects and asserts on the results.

API tests:
1. The spec reads `QA_API_TOKEN` from `.env` and skips with a clear message if it is missing.
2. It calls `GET /access-management/v1/companies` on the gateway with the token as a
   `Bearer` header.
3. It checks the status and content type and attaches the JSON body to the report.

## Setup

Prerequisites: Node.js (tested with v26.7.0), npm, access to the QA environment, and a
QA account with a phone that receives the OTP.

```bash
git clone <repo-url>
cd <repo-name>
npm install
npx playwright install
cp .env.example .env
```

Fill in `.env`:

```
QA_EMAIL=
QA_PASSWORD=
QA_API_TOKEN=
```

`QA_API_TOKEN` is the bearer token without the word "Bearer". Get it by logging in to the
QA app, opening DevTools → Network, and copying the `Authorization` header value of any
gateway request. It expires; a `401` means it needs refreshing. Never commit `.env`.

On Windows, if PowerShell blocks `npm`/`npx` with an execution-policy error, use the
Command Prompt terminal in VS Code or call `npm.cmd` / `npx.cmd`.

## Running tests

```bash
npm run test:ui     # all UI tests, headed (needed for the OTP)
npm run test:api    # all API tests, no browser
npm test            # everything
npm run report      # open the last HTML report

# Single spec
npx playwright test tests/UI/login.spec.ts --headed
```

## Status

| Test | Status |
| --- | --- |
| `login.spec.ts` | Passing |
| Negative login tests (2) | Passing |
| `companies.spec.ts` (API) | Passing |
| `fleet-management.spec.ts` | Not yet run since refactoring |
| `add-factory.spec.ts` | Failing: Add button stays disabled after the form is filled (under investigation) |
| `delete-factory.spec.ts` | Not run (intentionally) |

## Notes and limitations

- **Manual OTP**: UI tests cannot run unattended or in CI as-is. Options for later include a
  service account or client-credentials flow, an MFA-exempt QA test account, or a saved
  `storageState` with a defined expiry policy. Each needs the client's approval.
- **Manual API token**: the bearer token is copied by hand and expires. A service account
  would remove this step.
- **Test data in QA**: `add-factory.spec.ts` creates real records in the shared QA
  environment and does not clean them up. `delete-factory.spec.ts` exists but has not been
  run; review what it deletes before running it.
- **Unverified tests**: tests not marked as passing above should be treated as unverified.
- **Reports contain sensitive data**: traces, videos and screenshots can capture typed
  credentials, and API attachments contain client data. `playwright-report/` and
  `test-results/` are gitignored and must not be committed or shared.
