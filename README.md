# Final Project — Playwright Test Suite

End-to-end UI tests written with **Playwright + TypeScript**, structured with the
**Page Object Model (POM)**.

## Test target

[SauceDemo](https://www.saucedemo.com) — the configured `baseURL`.

## Covered user journey

Login → product inventory → cart → checkout, plus product sorting.

## Test cases

**Ticket 1 — Login regression** ([tests/login.spec.ts](tests/login.spec.ts))
- Login page renders the Swag Labs branding
- Standard user logs in and lands on the inventory page
- Locked-out user is refused with the locked error
- Wrong password shows an error
- Empty form reports "Username is required"
- Username only reports "Password is required"
- Password only reports "Username is required"

**Ticket 2 — Cart behavior** ([tests/cart.spec.ts](tests/cart.spec.ts))
- Cart badge shows "1" after adding a product
- Cart badge disappears after removing the product
- Badge reflects multiple add/remove operations
- Fast add/remove cycles leave the cart empty
- Double-clicking Add to cart accidentally removes the item (known app quirk)
- Cart persists across a page refresh

**Ticket 3 — Checkout flow** ([tests/checkout.spec.ts](tests/checkout.spec.ts))
- User can complete checkout and see "Thank you for your order!"

**Ticket 4 (bonus) — Sorting** ([tests/sorting.spec.ts](tests/sorting.spec.ts))
- "Price (low to high)" changes which product is shown first
- "Name (Z to A)" reorders the list away from the default

## Prerequisites

- **Node.js 18 or newer** (`node --version`)
- npm (ships with Node)

## Project structure

The repo holds **two test suites**, each in its own folder under `tests/` with a
matching page-object folder under `pages/`. SauceDemo is the final-project suite;
Automation Exercise is an additional e-commerce suite. Both run with a plain
`npx playwright test`.

```
my-playwright-learning/
├── pages/
│   ├── saucedemo/                  # SauceDemo Page Objects
│   │   ├── LoginPage.ts            # credential form, error banner
│   │   ├── InventoryPage.ts        # add/remove, cart badge, sort dropdown
│   │   ├── CartPage.ts             # cart contents, checkout button
│   │   └── CheckoutPage.ts         # information form, finish, success message
│   └── automation-exercise/        # Automation Exercise Page Objects
│       ├── HomePage.ts  ProductsPage.ts  ProductDetailPage.ts  CartPage.ts
├── tests/
│   ├── saucedemo/                  # final-project suite — one spec per feature
│   │   ├── login.spec.ts  cart.spec.ts  checkout.spec.ts  sorting.spec.ts
│   └── automation-exercise/        # additional suite
│       └── automationexercise.spec.ts
├── test-data/
│   ├── users.ts                    # SauceDemo: credentials, product ids, checkout inputs
│   └── products.ts                 # Automation Exercise: search term, subscriber email
├── learning/                       # early tutorial scratch specs (not run)
├── playwright.config.ts
└── README.md
```

## How to run

First-time setup (install browsers):

```bash
npm install
npx playwright install
```

Run the suite and open the report:

```bash
npx playwright test            # all browsers (chromium, firefox, webkit)
npx playwright show-report
```

Other useful runs:

```bash
npx playwright test --project=chromium          # one browser
npx playwright test tests/saucedemo             # just the SauceDemo suite
npx playwright test tests/automation-exercise   # just the Automation Exercise suite
npx playwright test tests/saucedemo/login.spec.ts   # one feature
npx playwright test --headed                    # watch it run
npx playwright test --project=chromium --repeat-each=3   # stability check
```

## Page Object Model design

| Layer | Responsibility |
| --- | --- |
| `tests/*.spec.ts` | The scenario — what the user does and every `expect()` |
| `pages/*.ts` | Locators and user actions for one page (`login()`, `addToCart()`, `checkout()`) |
| `test-data/users.ts` | Credentials, product ids, and form inputs |

Design rules followed:

- **Actions in Page Objects, assertions in tests.** Page Objects expose locators
  as `readonly` properties and wrap interactions in methods; every assertion
  lives in the spec, so each test reads as a full scenario.
- **Stable locators.** SauceDemo exposes `data-test` attributes, so locators use
  them (`[data-test="login-button"]`); no XPath, no positional CSS chains.
- **No hard waits.** No `waitForTimeout` — synchronisation relies on Playwright's
  auto-waiting and web-first assertions.
- **Data is not hardcoded in specs.** Credentials and inputs come from
  `test-data/users.ts`.

## Configuration & CI

- [`playwright.config.ts`](playwright.config.ts) runs Chromium, Firefox, and
  WebKit in parallel locally; CI runs serially with retries.
- The HTML reporter is enabled; on CI the `playwright-report/` is uploaded as an
  artifact (see [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)).

## Known limitations

- The suite targets the live SauceDemo demo site, so an occasional failure can
  come from the site itself rather than the tests; re-run if a single test
  flakes. The suite passes reliably under
  `npx playwright test --project=chromium --repeat-each=3`.
- Coverage is scoped to the documented user journeys, not every edge case.

## Additional suite — Automation Exercise

[`tests/automation-exercise/`](tests/automation-exercise/) is a second POM suite
targeting [Automation Exercise](https://automationexercise.com): browsing,
search, product details, cart, and newsletter signup. It shares the same browser
projects and runs as part of `npx playwright test`; run it alone with
`npx playwright test tests/automation-exercise`.

[`learning/`](learning/) holds early Playwright tutorial scratch specs, kept for
reference and excluded from the suite.
