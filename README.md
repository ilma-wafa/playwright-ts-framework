# Playwright TypeScript Test Framework

End-to-end UI and API test automation framework built with Playwright and TypeScript, testing [SauceDemo](https://www.saucedemo.com) and [Restful Booker](https://restful-booker.herokuapp.com). Runs on every push via GitHub Actions.

## What it covers

**UI (SauceDemo)** — 12 tests across login, product inventory, and cart:

- Login: valid credentials, locked-out account, wrong password, empty fields
- Inventory: product count, price sorting both directions, name sorting
- Cart: badge counter, adding single and multiple items, item removal

**API (Restful Booker)** — coming: token auth, full CRUD lifecycle, negative cases.

## Structure

src/pages/ Page objects — locators and actions per page
src/api/ API client for Restful Booker
src/data/ Test data and credentials
tests/ui/ UI specs
tests/api/ API specs


## Design decisions

**Page Object Model.** Locators live in one class per page, so a renamed element is a one-file change rather than an edit across every spec. Tests describe what is being verified; page objects hold how to reach it.

**`data-test` locators over CSS or XPath.** SauceDemo exposes `data-test` attributes, which exist for testing and don't change when a developer restyles the page. Class-based selectors break on cosmetic changes; these don't.

**Assertions on properties, not fixed values.** The sorting tests sort a copy of what the page returned and compare, rather than checking against a hardcoded price list. Add a product tomorrow and the test still holds.

**No `BasePage` class.** The cart badge is shared between two page objects, which would normally justify a base class. With two pages the inheritance costs more than the duplication saves — worth revisiting as the suite grows.

**No hard waits.** Playwright's web-first assertions retry until they pass or time out. There is no `waitForTimeout` anywhere in this suite.

## Handling flaky tests

Early runs failed intermittently with `net::ERR_TIMED_OUT` and `net::ERR_NETWORK_CHANGED` — always in `beforeEach`, always at the timeout limit, never on an assertion. Four tests failing at identical durations pointed to environment rather than test logic.

Three changes fixed it:

- `waitUntil: 'domcontentloaded'` on navigation instead of the default `load`, so page loads don't block on product images the tests never assert against
- `navigationTimeout` raised to 45s, `actionTimeout` held at 15s — a slow page load is plausible, a slow click is not
- Local workers reduced to 2, so parallel browsers aren't competing for bandwidth

Retries are set to 2 in CI and 1 locally. Local retries are enabled only because the instability was confirmed environmental. Retrying to mask a race condition in test code would hide a real defect.

## Running it

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

Useful variants:

```bash
npx playwright test --reporter=list     # inline results
npx playwright test --ui                # interactive mode
npx playwright test --debug             # step through
npx playwright show-report              # last HTML report
npx playwright show-trace <path>        # replay a failed run
```

## CI

GitHub Actions runs the suite on every push and pull request to `main`. The HTML report uploads as a build artifact and is downloadable from the run page.

Chromium only. Cross-browser coverage is a deliberate omission — it triples runtime for a suite where no test exercises browser-specific behaviour.