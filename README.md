# Playwright + TypeScript POC

Automated UI and API tests using Playwright and TypeScript.

## What it solves

- Repeatable end-to-end checks of core user flows (login, fleet management, customer and
  factory creation/deletion) instead of manual regression clicks.
- API checks against the gateway, including response schema validation and negative cases,
  in the same framework as the UI tests.
- A maintainable structure (page functions, locators, fixtures, separated test data) that
  runs sequentially or in parallel and can grow into a full regression suite.

## Why Playwright

- **One tool for UI and API tests**: the same framework drives the browser and calls the
  gateway API (`request` fixture), with shared config, reports and test data.
- **Built-in auto-waiting**: actions wait for elements to be visible and ready, which suits
  this Angular app with loading lists, overlays and dialogs, and avoids fixed sleeps.
- **Session reuse (storageState)**: the login, including the manual SMS OTP, runs once per
  run; every test starts already logged in.
- **Parallel runs built in**: workers and sharding are part of the test runner; no Grid to
  set up.
- **Everything included**: test runner, assertions, retries, HTML report, screenshots,
  video and trace viewer come with Playwright; no extra libraries to assemble.
- **Strong debugging tools**: the HTML report shows every step, and the trace viewer and
  `codegen` recorder helped find the right locators for this app.
- **TypeScript support out of the box**: typed page functions and test data catch mistakes
  in the editor before a test is run.

## Design decisions

- **Page functions per screen** (`pages/`): each screen has one file of plain exported
  functions (no classes), e.g. `openFleetManagement(page)`. The first parameter is always
  `page`. Tests only call these functions and contain no selectors.
- **Shared actions** (`pages/CommonFunctions.ts`): screen-independent browser actions used
  by the other page files.
- **Shared navigation**: `openFleetManagement` opens the Settings menu and chooses Fleet
  Management. The customer and factory specs both use it.
- **Locators in one place** (`locators/`): all selectors, one file per screen, grouped by
  type, e.g. `loginLocators.fields.email(page)`. When the UI changes, only these files change.
- **API layer** (`api/`): `requests/` holds the API calls and checks, `schemas/` holds JSON
  schemas. Responses are validated with Ajv; the schema is compiled once per run.
- **Log in once per run** (`tests/auth.setup.ts`): a setup step logs in, a person types the
  SMS OTP once, and the session is saved. All UI tests start with that session through the
  `loggedInPage` fixture. MFA is not bypassed.
- **Sequential or parallel**: one worker by default; any number on request. Only the setup
  opens a visible browser (for the OTP); UI tests run headless, which keeps parallel runs
  light.
- **Parallel-safe test data**: records get a fixed prefix plus a random part, e.g.
  `Automation_Test_Factory_AFCJ7T`, so tests in different workers never collide.
- **Test data separation** (`test-data/ui/`, `test-data/api/`): input data is kept out of
  the specs. Fake values for negative tests live here; real secrets do not.
- **Safe deletes**: tests only delete records whose name starts with a test prefix
  (`AutoTest-Customer-`, `Automation_Test_Factory_`), and only after the confirmation
  dialog names that record. Real data is never deleted.
- **Configuration and secrets**: environment URLs live in `config/`. Credentials and tokens
  come only from `.env`, which is gitignored.
- **Environment guard**: `TEST_ENV` selects qa (default), pre-prd or prod. Because tests
  create and delete data, running against prod is refused unless `ALLOW_PROD=true` is set.
- **Timeouts**: actions 15 s, assertions 10 s, tests 60 s. The first dashboard load gets
  30 s, because a fresh browser starts the app more slowly when several run in parallel.
- **Evidence on failure**: a failed test keeps a screenshot and a video in the report.
- **Manual test cases in Gherkin** (`test-cases/`): plain-language scenarios; documentation
  only, not executed.

## Project structure

```
api/requests/             API calls and checks (CompaniesApi.ts)
api/schemas/              JSON schemas for API responses (companiesSchema.ts)
config/                   environments.ts (app URLs), api.ts (gateway URL), auth.ts (session file path)
fixtures/loginFixture.ts  loggedInPage: a page with the saved session and the dashboard open
locators/                 All selectors, one file per screen
pages/                    Functions per screen + CommonFunctions.ts (shared actions)
utils/                    Helper functions: env.ts, testData.ts, guards.ts, regex.ts
test-data/ui/             users.ts, invalidCredentials.ts, customers.ts, factories.ts
test-data/api/            apiTokens.ts (fake tokens for negative tests)
tests/auth.setup.ts       Logs in once per run and saves the session
tests/UI/                 UI specs
tests/API/                API specs
test-cases/api/           Gherkin manual test cases
.env.example              Template for required environment variables
```

Full tree:

```
Playwright/
├── tests/
│   ├── auth.setup.ts
│   ├── UI/
│   │   ├── login.spec.ts
│   │   ├── fleet-management.spec.ts
│   │   ├── customer-management.spec.ts
│   │   └── factory-management.spec.ts
│   └── API/
│       └── companies.spec.ts
├── pages/
│   ├── CommonFunctions.ts
│   ├── LoginPage.ts
│   ├── OtpPage.ts
│   ├── DashboardPage.ts
│   ├── SettingsMenu.ts
│   ├── FleetManagementPage.ts
│   ├── AddCustomerPage.ts
│   └── AddFactoryPage.ts
├── locators/
│   ├── login.ts
│   ├── otp.ts
│   ├── dashboard.ts
│   ├── settingsMenu.ts
│   ├── fleetManagement.ts
│   ├── addCustomer.ts
│   └── addFactory.ts
├── api/
│   ├── requests/
│   │   └── CompaniesApi.ts
│   └── schemas/
│       └── companiesSchema.ts
├── fixtures/
│   └── loginFixture.ts
├── test-data/
│   ├── ui/
│   │   ├── users.ts
│   │   ├── invalidCredentials.ts
│   │   ├── customers.ts
│   │   └── factories.ts
│   └── api/
│       └── apiTokens.ts
├── config/
│   ├── environments.ts
│   ├── api.ts
│   └── auth.ts
├── utils/
│   ├── env.ts
│   ├── testData.ts
│   ├── guards.ts
│   └── regex.ts
├── test-cases/
│   └── api/
│       └── companies-api.feature
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

Created locally and not committed: `.env`, `node_modules/`, `playwright-report/`,
`test-results/` and `playwright/.auth/`.

## Tests

| Spec | Tests |
| --- | --- |
| `tests/auth.setup.ts` | Logs in once (manual OTP) and saves the session for all UI tests |
| `tests/UI/login.spec.ts` | Saved session opens the dashboard; error for invalid email; error for invalid password |
| `tests/UI/fleet-management.spec.ts` | User has the Administrator role and can open Fleet Management (Factory and Customer tabs shown) |
| `tests/UI/customer-management.spec.ts` | Administrator adds a customer, finds it, and deletes it |
| `tests/UI/factory-management.spec.ts` | Administrator adds a factory, finds it, deletes it, and checks it is gone |
| `tests/API/companies.spec.ts` | Valid token: 200, JSON body matching the schema; no token: 401; invalid token: 403 |

Every test uses `test.describe`, `test` and `test.step`, so the HTML report shows each step
by name.

## Code flow

UI tests:
1. The `setup` project runs first and opens a visible browser.
2. It fills `QA_EMAIL` and `QA_PASSWORD` from `.env`; a person types the 6-digit SMS OTP.
3. Submit is clicked automatically; once the dashboard opens, the session is saved to
   `playwright/.auth/user.json`.
4. Each UI test starts with that session (headless). The `loggedInPage` fixture opens the
   dashboard and checks it loaded.
5. The spec calls page functions from `pages/`, which take their selectors from
   `locators/`, and asserts on the results.

API tests:
1. The valid-token test reads `QA_API_TOKEN` from `.env` and fails with a clear message if
   it is missing.
2. `getCompanies` (`api/requests/CompaniesApi.ts`) sends `GET /access-management/v1/companies`
   with the token as a `Bearer` header, or without a header for the negative test.
3. `verifyJsonResponse` checks status and content type, `verifyCompaniesSchema` validates
   the body against the schema, and `verifyUnauthorized` checks rejected requests.

## Setup

Prerequisites: Node.js (tested with v26.7.0), npm, access to the QA environment, and a
QA account with a phone that receives the OTP.

```bash
git clone <repo-url>
cd <repo-name>
npm ci
npx playwright install
cp .env.example .env
```

Fill in `.env`:

```
QA_EMAIL=
QA_PASSWORD=
QA_API_TOKEN=
QA_CSM_EMAIL=
# Optional: qa (default) | pre-prd | prod
# TEST_ENV=qa
```

`QA_CSM_EMAIL` is the Customer Success Manager assigned to test customers; it must exist in
the app's CSM list.

`QA_API_TOKEN` is the bearer token without the word "Bearer". Get it by logging in to the
QA app, opening DevTools → Network, and copying the `Authorization` header value of any
gateway request. It expires; a `401` or `403` on the valid-token test means it needs
refreshing. Never commit `.env`.

On Windows, if PowerShell blocks `npm`/`npx` with an execution-policy error, use the
Command Prompt terminal in VS Code or call `npm.cmd` / `npx.cmd`.

## Running tests

Any run that includes UI tests asks for the OTP once, at the start.

```bash
npm test                     # all tests, one at a time
npm run test:parallel        # all tests, 4 workers
npm run test:ui              # UI tests, one at a time
npm run test:api             # API tests, no browser, no OTP
npm run test:api:parallel    # API tests, 3 workers
npm run report               # open the last HTML report

# Any number of workers
npx playwright test --fully-parallel --workers=2

# One spec, or one test by title
npx playwright test tests/UI/customer-management.spec.ts
npx playwright test -g "invalid email"

# Watch UI tests in visible browsers
npx playwright test tests/UI --headed

# Type check without running tests
npx tsc --noEmit -p tsconfig.json
```

## Notes and limitations

- **Manual OTP once per run**: runs cannot be fully unattended or run in CI as-is. Options
  include a service account, an MFA-exempt QA test account, or a longer-lived saved session.
  Each needs the client's approval.
- **Saved session file**: `playwright/.auth/user.json` contains a live login token. It is
  gitignored and recreated on every run; never commit or share it.
- **Parallel runs on a laptop**: with 4 workers, pages load 2–3 times slower, and the app
  can take over 10 s to start in a fresh browser. The worker count is chosen by measuring,
  not by maximum.
- **Manual API token**: copied by hand and expires. A service account would remove this step.
- **Open API questions**: an invalid token returns 403 (not 401), and `includeFields`
  returns four fields instead of one; both to be confirmed with the API team.
- **Test data in QA**: the customer and factory specs delete the record they create. If a
  test fails before its delete step, delete the leftover `AutoTest-Customer-...` or
  `Automation_Test_Factory_...` record by hand.
- **Factory row menu**: located by position (the second `more_vert` icon). If the UI
  changes these menus, update `locators/fleetManagement.ts`.
- **Reports contain sensitive data**: screenshots, videos and traces can capture typed
  credentials, and API attachments contain client data. `playwright-report/` and
  `test-results/` are gitignored and must not be committed or shared.