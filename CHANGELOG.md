# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0] - 2026-11-26

TYPO3 14 release. See the [upgrade guide](https://docs.typo3.org/p/blueways/bw-icons/main/en-us/Upgrade/Index.html) if your code uses the PHP classes of the extension; integrators who only use page TSconfig, TCA, Fluid and the TypoScript include just need TYPO3 13.4.21 or 14.3.

### Added

- **TYPO3 14.3 LTS and PHP 8.5 support.**
- **Fonts that only ship WOFF files are read**, for example Bootstrap Icons. WOFF2-only fonts are still not supported ([#45](https://github.com/maikschneider/bw_icons/issues/45)).
- **Documentation on docs.typo3.org** with configuration reference, Content Blocks example, frontend usage, developer API and upgrade guide ([#56](https://github.com/maikschneider/bw_icons/issues/56)).

### Changed

- **Requires TYPO3 13.4.21 or 14.3.** 13.4.21 is the first 13.4 release that ships the `#[AsAllowedCallable]` attribute that TYPO3 14 requires for TypoScript user functions.
- **Icon providers, the cache and the TSconfig lookup use dependency injection.** `Blueways\BwIcons\Utility\HelperUtility` is replaced by the `Blueways\BwIcons\Service\IconService` service, and providers are created by `Blueways\BwIcons\Factory\IconProviderFactory`. Code that used `HelperUtility` has to inject `IconService` instead.
- **`IconViewHelper` renders via `render()`** instead of the removed `renderStatic()`.

### Fixed

- **Frontend stylesheets on TYPO3 14.** `CssUtility->includeStyleSheets` is marked as `#[AsAllowedCallable]` and is a public service, so `page.headerData.x = USER` with this user function works instead of failing with `AllowedCallableException` or `ArgumentCountError`.
- **No `open_basedir` warnings in the backend.** The icon field passes its stylesheets to FormEngine relative to the public path; with a leading slash TYPO3 14 probed them as absolute file paths on every record edit ([#150](https://github.com/maikschneider/bw_icons/pull/150)).
- **Icomoon stylesheets.** Attribute selectors like `[class^="icon-"]` are no longer used as icon class prefix, so icons get `icon-home` instead of `class^="icon-"] icon-home` ([#136](https://github.com/maikschneider/bw_icons/issues/136)).
- **`@font-face` rules without `font-weight`** match their prefix class again, so the icons get the font class ([#88](https://github.com/maikschneider/bw_icons/pull/88), reported by Jan Storm).
- **Glyph rules that set their own `font-family`** are not used as icon class prefix.
- **Custom providers extending `CssIconProvider`** get the font readers from the factory instead of failing with `ArgumentCountError` ([#156](https://github.com/maikschneider/bw_icons/pull/156)).
- **RTE icons in the page module** are shown at text size; TYPO3 14.1 renders rich text in the page module preview ([#152](https://github.com/maikschneider/bw_icons/pull/152)).

### Removed

- **TYPO3 12 support.** Use bw_icons 4.x for TYPO3 12.

## Earlier versions

Release notes of 4.3.2 and earlier: [GitHub releases](https://github.com/maikschneider/bw_icons/releases).

[Unreleased]: https://github.com/maikschneider/bw_icons/compare/5.0.0...HEAD
[5.0.0]: https://github.com/maikschneider/bw_icons/compare/4.3.2...5.0.0
