# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **TYPO3 14.3 LTS and PHP 8.5 support.**

### Changed

- **Requires TYPO3 13.4.21 or 14.3.** 13.4.21 is the first 13.4 release that ships the `#[AsAllowedCallable]` attribute that TYPO3 14 requires for TypoScript user functions.
- **Icon providers, the cache and the TSconfig lookup use dependency injection.** `Blueways\BwIcons\Utility\HelperUtility` is replaced by the `Blueways\BwIcons\Service\IconService` service, providers are created by `Blueways\BwIcons\Provider\IconProviderFactory`. Code that called `HelperUtility` statically has to inject `IconService` instead.
- **`IconViewHelper` renders via `render()`** instead of the removed `renderStatic()`.

### Fixed

- **Frontend stylesheets on TYPO3 14.** `CssUtility->includeStyleSheets` is marked as `#[AsAllowedCallable]` and is a public service, so `page.headerData.x = USER` with this user function works again instead of failing with `AllowedCallableException` or `ArgumentCountError`.
- **No `open_basedir` warnings in the backend.** The icon field passes its stylesheets to FormEngine relative to the public path; with a leading slash TYPO3 14 probed them as absolute file paths on every record edit ([#150](https://github.com/maikschneider/bw_icons/pull/150)).

### Removed

- **TYPO3 12 support.**

## Earlier versions

Release notes of 4.3.2 and earlier: [GitHub releases](https://github.com/maikschneider/bw_icons/releases).

[Unreleased]: https://github.com/maikschneider/bw_icons/compare/4.3.2...HEAD
