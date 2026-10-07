# Noedra Node QA – Playwright + TypeScript POC

Proof of concept for automated UI and API testing of the Noedra Node QA environment
(`https://qa.sensproducts.siemens-energy.com`) using Playwright and TypeScript.

## What it solves

- Repeatable end-to-end checks of core user flows (login, fleet management, factory and
  customer creation/deletion) instead of manual regression clicks.
- API checks against the gateway in the same framework as the UI tests.
- A maintainable structure (page functions, locators, fixtures, separated test data) that
  can grow into a full regression suite.

## Why Playwright

- **One tool for UI and API tests**: the same framework drives the browser and calls the
  gateway API (`request` fixture), with shared config, reports and test data.
- **Built-in auto-waiting**: actions wait for elements to be visible and ready, which suits
  this Angular app with loading lists, overlays and dialogs, and avoids fixed sleeps.
- **Stable, readable locators**: elements are found by role, label, placeholder or text
  (e.g. `getByRole('button', { name: 'Add' })`), the way a user sees them, instead of
  brittle CSS paths.
- **Everything included**: test runner, assertions, retries, HTML report, screenshots and
  trace viewer come with Playwright; no extra libraries to assemble.
- **Strong debugging tools**: the HTML report shows every step, and the trace viewer and
  `codegen` recorder helped find the right locators for this app.
- **TypeScript support out of the box**: typed page functions and test data catch mistakes
  in the editor before a test is run.
- **Cross-browser ready**: Chromium is used now; Firefox and WebKit can be switched on in
  `playwright.config.ts` once the OTP step no longer needs a person.

## Design decisions

- **Page functions per screen** (`pages/`): each screen has one file of plain exported
  functions (no classes), e.g. `openFleetManagement(page)` or `selectCustomer(page, name)`.
  The first parameter is always `page`. Tests only call these functions and contain no
  selectors.
- **Shared actions** (`pages/CommonFunctions.ts`): screen-independent browser actions used
  by the other page files: pick a dropdown option, close a list by clicking outside it,
  retry opening a dropdown until its list appears.
- **Shared navigation**: `openFleetManagement` (in `pages/FleetManagementPage.ts`) opens the
  Settings menu and chooses Fleet Management. The customer and factory specs both use it,
  so a change to the menu is fixed in one place.
- **Locators in one place** (`locators/`): all selectors, one file per screen, grouped by
  type (fields, buttons, messages, tabs, ...), e.g. `loginLocators.fields.email(page)`.
  When the UI changes, only these files need updating.
- **API functions** (`api/`): `CompaniesApi.ts` holds the API calls and checks
  (`getCompanies`, `verifyJsonResponse`, `attachResponseBody`), so the API spec reads like
  the UI specs and contains no request details.
- **Helpers** (`utils/`): plain helper functions: read required `.env` values, build unique
  names, escape text for patterns, and the delete safety check.
- **Login fixture** (`fixtures/loginFixture.ts`): a UI test that lists `loggedInPage` in its
  parameters is logged in before it starts. Playwright only runs a fixture when a test asks
  for it by name, so `loggedInPage` is requested even though the test does not read its
  value. Tests that leave it out (the negative login tests) start logged out.
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
  changed without editing test logic. Records the tests create get a fixed prefix and a
  timestamp (e.g. `AutoTest-Customer-1791283378971`).
- **Safe deletes**: tests only delete records whose name starts with a test prefix
  (`AutoTest-Customer-`, `Automation_Test_Factory_`), and only after the confirmation
  dialog names that record. Real data is never deleted.
- **Environment guard**: `TEST_ENV` selects qa (default), pre-prd or prod. Because tests
  create and delete data, running against prod is refused unless `ALLOW_PROD=true` is set.
- **Manual test cases in Gherkin** (`test-cases/`): plain-language scenarios that document
  what is covered. They are documentation only and are not executed; the automated
  equivalent of the first scenario is `tests/API/companies.spec.ts`.

## Project structure

```
api/                      API calls and checks (CompaniesApi.ts)
config/                   environments.ts (app URLs), api.ts (gateway base URL)
fixtures/loginFixture.ts  loggedInPage fixture with OTP auto-submit
locators/                 All selectors, one file per screen
pages/                    Functions per screen + CommonFunctions.ts (shared actions)
utils/                    Helper functions: env.ts, testData.ts, guards.ts, regex.ts
test-data/                users.ts, invalidCredentials.ts, customers.ts, factories.ts
tests/UI/                 UI specs
tests/API/                API specs
test-cases/api/           Gherkin manual test cases
.env.example              Template for required environment variables
```

## Tests

| Spec | Tests |
| --- | --- |
| `tests/UI/login.spec.ts` | QA user logs in and reaches the dashboard; error for invalid email; error for invalid password |
| `tests/UI/fleet-management.spec.ts` | User has the Administrator role and can open Fleet Management (Factory and Customer tabs shown) |
| `tests/UI/customer-management.spec.ts` | Administrator adds a customer, finds it, and deletes it |
| `tests/UI/factory-management.spec.ts` | Administrator adds a factory, finds it, deletes it, and checks it is gone |
| `tests/API/companies.spec.ts` | `GET /access-management/v1/companies` (type customer) returns 200 with a JSON body |

Every test uses `test.describe`, `test` and `test.step`, so the HTML report shows each step
by name.

## Code flow

UI tests:
1. A spec requests the `loggedInPage` fixture.
2. The fixture opens the login page and fills `QA_EMAIL` and `QA_PASSWORD` from `.env`.
3. A person types the 6-digit SMS OTP in the browser.
4. Once all six digit boxes are filled, Submit is clicked automatically.
5. The fixture waits for the dashboard URL, then the test starts.
6. The spec calls page functions from `pages/`, which take their selectors from
   `locators/`, and asserts on the results.

API tests:
1. The spec reads `QA_API_TOKEN` from `.env` and skips with a clear message if it is missing.
2. It calls `getCompanies` (`api/CompaniesApi.ts`), which sends
   `GET /access-management/v1/companies` to the gateway with the token as a `Bearer` header.
3. `verifyJsonResponse` checks the status and content type; `attachResponseBody` attaches
   the JSON body to the report.

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
QA_CSM_EMAIL=
```

`QA_CSM_EMAIL` is the Customer Success Manager assigned to test customers; it must exist in
the app's CSM list.

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

# Type check without running tests
npx tsc --noEmit -p tsconfig.json
```

## Notes and limitations

- **Manual OTP**: UI tests cannot run unattended or in CI as-is. Options for later include a
  service account or client-credentials flow, an MFA-exempt QA test account, or a saved
  `storageState` with a defined expiry policy. Each needs the client's approval.
- **Manual API token**: the bearer token is copied by hand and expires. A service account
  would remove this step.
- **Test data in QA**: the customer and factory specs delete the record they create. If a
  test fails before its delete step, delete the leftover `AutoTest-Customer-...` or
  `Automation_Test_Factory_...` record by hand.
- **Factory row menu**: the factory row's action menu is located by position (the second
  `more_vert` icon on the page). If the UI changes these menus, update
  `locators/fleetManagement.ts`.
- **Reports contain sensitive data**: traces, videos and screenshots can capture typed
  credentials, and API attachments contain client data. `playwright-report/` and
  `test-results/` are gitignored and must not be committed or shared.