# Playwright Test Automation — Final Project (Track B)

End-to-end UI tests written with **Playwright + TypeScript**, structured with the
**Page Object Model (POM)**. The final-project suite (Track B) targets the
[Automation Exercise](https://automationexercise.com) e-commerce demo site and
covers a realistic shopping journey: browsing, search, product details, and the
cart.

The POM work for this project lives in [`pages/`](pages/) and
[`tests/automationexercise.spec.ts`](tests/automationexercise.spec.ts). A second
spec, [`tests/saucedemo.spec.ts`](tests/saucedemo.spec.ts), adds SauceDemo
positive/negative login, cart, sort, and checkout coverage. Earlier tutorial
scratch files are kept out of the test run under [`learning/`](learning/).

## Prerequisites

- **Node.js 18 or newer** (`node --version`)
- npm (ships with Node)

## Tech stack

- [Playwright Test](https://playwright.dev/) `@playwright/test`
- TypeScript
- Runs against Chromium, Firefox, and WebKit

## Project structure

```
my-playwright-learning/
├── pages/                         # Page Objects — locators + user actions, one class per page
│   ├── HomePage.ts                # navbar, featured products, newsletter
│   ├── ProductsPage.ts            # product list + search
│   ├── ProductDetailPage.ts       # single product, add to cart
│   └── CartPage.ts                # cart contents
├── test-data/
│   └── products.ts                # search term, subscriber email (no data hardcoded in specs)
├── tests/                         # the runnable suite (testDir)
│   ├── automationexercise.spec.ts # Track B suite (7 tests) — scenarios + assertions
│   └── saucedemo.spec.ts          # SauceDemo login/cart/checkout (positive + negative)
├── learning/                      # tutorial scratch specs — NOT run by the suite
├── playwright.config.ts
└── README.md
```

## Running the tests

First-time setup (install browsers):

```bash
npm install
npx playwright install
```

Run the whole suite (both spec files, all browsers):

```bash
npx playwright test
```

`testDir` is `tests/`, so the scratch specs under `learning/` are never
collected — a plain `npx playwright test` runs only the real POM/SauceDemo tests.

Run just the final-project (Track B) suite:

```bash
# All browsers
npx playwright test tests/automationexercise.spec.ts

# A single browser
npx playwright test tests/automationexercise.spec.ts --project=chromium

# Headed / debug / UI mode
npx playwright test tests/automationexercise.spec.ts --headed
npx playwright test tests/automationexercise.spec.ts --ui
```

View the HTML report after a run:

```bash
npx playwright show-report
```

## Page Object Model design

Responsibilities are split so that tests read as user behaviour and the page
classes hide the technical detail:

| File | Responsibility |
| --- | --- |
| `tests/automationexercise.spec.ts` | The scenario: what the user does and what we expect |
| `pages/*.ts` | Locators and user actions for one page (`open()`, `search()`, `addToCart()`) |
| `test-data/products.ts` | Test inputs (search term, email) |

Design rules followed:

- **Actions in Page Objects, assertions in tests.** Page Objects expose
  locators as `readonly` properties and wrap interactions in methods; every
  `expect()` lives in the spec, so each test shows the full picture.
- **Stable locators, role/id first.** Locators prefer role/accessibility
  (`getByRole`, `getByText`, `getByPlaceholder`) and ids (`#cart_info_table`,
  `#submit_search`). The demo site exposes no `data-testid`s, so a few container
  scopes fall back to CSS class selectors (e.g. `.features_items`); there is no
  XPath and no deep/positional CSS chains.
- **No hard waits.** No `waitForTimeout`. Synchronisation relies on Playwright's
  auto-waiting; the one explicit `waitFor` (add-to-cart modal) confirms an action
  completed, it is not a fixed delay.
- **No over-engineering.** No `BasePage` or custom wrappers — just small,
  readable classes, one per page.

## Test suite (Track B)

`tests/automationexercise.spec.ts` — 8 tests:

1. Home page loads and shows featured products
2. User can navigate to the products page from the navbar
3. Searching for a product returns matching results
4. Searching for a nonsense term returns no products (negative path)
5. Product detail page shows name, category, and availability
6. User can add a product to the cart and see it listed
7. User can add two distinct products to the cart (uses `test.step` for a readable report)
8. Visitor can subscribe to the newsletter from the footer

## Configuration & CI

- [`playwright.config.ts`](playwright.config.ts) runs three browser projects in
  parallel locally. Because the tests hit live third-party sites, one retry is
  allowed locally to absorb transient network/ad flakiness; CI retries twice and
  runs serially.
- The HTML reporter is enabled; on CI the `playwright-report/` is uploaded as an
  artifact (see [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)).

## Known limitations

- The tests run against **live third-party demo sites**, so an occasional
  failure can come from the site itself (ad overlays, slow responses, or a 5xx)
  rather than the tests. The config allows one local retry to absorb this; just
  re-run if a single test flakes. The suite passes reliably under
  `npx playwright test --project=chromium --repeat-each=3`.
- Coverage is intentionally scoped to the documented user journeys, not every
  edge case.
