# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal Playwright + TypeScript learning sandbox. There is no application under test in this repo — tests target external sites: `https://www.saucedemo.com` (the configured `baseURL`) and `https://playwright.dev/`. The presence of `playground.ts` (TypeScript exercise scratchpad, not run by the test runner) and `notes.md` reflects this learning-project nature.

## Commands

`package.json` defines no scripts. Run Playwright directly:

- Run all tests across all browser projects: `npx playwright test`
- Run a single file: `npx playwright test tests/login-practice.spec.ts`
- Run a single test by title: `npx playwright test -g "has title"`
- Run in one browser only: `npx playwright test --project=chromium`
- Headed / debug / UI mode: `npx playwright test --headed`, `--debug`, `--ui`
- Open last HTML report: `npx playwright show-report`
- First-time browser install: `npx playwright install`

## Architecture notes

- `playwright.config.ts` runs three browser projects (`chromium`, `firefox`, `webkit`) fully in parallel locally; on CI (`process.env.CI`) it serializes to 1 worker, retries 2x, and enforces `forbidOnly`. `trace: 'on-first-retry'` means traces only exist for retried failures, not first-attempt failures.
- `baseURL` is `https://www.saucedemo.com`, so `page.goto('')` or `page.goto('/inventory.html')` resolves there. Tests that hit `playwright.dev` use absolute URLs and bypass `baseURL`.
- Test data lives in `test-data.ts` at the repo root (not under `tests/`); spec files import it via relative paths like `../test-data`.
- CI workflow `.github/workflows/playwright.yml` triggers on push/PR to `main` or `master`, uploads `playwright-report/` as an artifact for 30 days.

## Notes for editing

- `playground.ts` intentionally contains TypeScript errors used as learning exercises — do not "fix" them unless asked. The comments in that file are the exercise prompts.
- When adding tests, put them in `tests/` so the `testDir` picks them up.
