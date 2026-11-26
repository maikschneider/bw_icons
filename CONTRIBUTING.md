# Contributing to bw_icons

Thank you for considering contributing to bw_icons! Bug reports, fixes, new icon providers and documentation improvements are welcome.

## Local Development Setup

This extension uses DDEV for local development.

```bash
ddev start
ddev composer install
ddev init-typo3
```

The backend is available at `https://bw-icons.ddev.site/typo3/` (user `admin`, password `Passw0rd!`).

The JavaScript (Svelte wizard, CKEditor 5 plugin) lives in `Resources/Private/JavaScript` and is built into `Resources/Public/JavaScript`:

```bash
ddev npm install
ddev npm run build
```

## Running Tests

Unit tests use the TYPO3 Testing Framework and PHPUnit, acceptance tests use Playwright inside DDEV.

```bash
ddev exec vendor/bin/phpunit --testsuite Unit
ddev playwright test --config=playwright.config.ts
```

## Code Quality Standards

Please run all checks before submitting a pull request.

```bash
ddev composer sca
```

Individual tools: `php:fixer`, `php:stan`, `php:rector`, `php:lint`, `yaml:lint`, `typoscript:lint`, `editorconfig:lint`, `language:lint`, `composer:normalize`.

`ddev composer ci:sca` runs the same tools read-only, as in CI. Its `ci:php:fixer` and `ci:php:stan` steps write checkstyle reports (`php-cs-fixer.xml`, `phpstan.xml`) that CI turns into pull request annotations.

## Commits and Pull Requests

* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat:`, `fix:`, `docs:`, …)
* One pull request per issue, body `Resolves #N.`
* Add an entry to the `[Unreleased]` section of `CHANGELOG.md`
* Add a test for every bug fix

## License

By contributing, you agree that your contributions will be licensed under GPL-2.0-or-later.
