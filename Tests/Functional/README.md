# Functional Tests for Icon Field Localization

This directory contains functional tests that verify the localization behavior of icon fields in the bw_icons extension.

## Test Coverage

The `IconFieldLocalizationTest` class verifies the following behaviors:

### 1. allowLanguageSynchronization Configuration

**Tests:**
- `iconFieldHasAllowLanguageSynchronizationEnabled()`: Verifies that the `allowLanguageSynchronization` option is enabled for the icon field in pages table
- `iconFieldInTtContentHasAllowLanguageSynchronization()`: Verifies that the option is enabled for tt_content table
- `iconFieldInSysCategoryHasAllowLanguageSynchronization()`: Verifies that the option is enabled for sys_category table

**Purpose:** These tests ensure that editors can see and use the synchronization toggle switch in translated records, allowing them to control whether icon fields should sync with the default language.

### 2. l10n_display Configuration

**Tests:**
- `iconFieldConfigurationIncludesL10nDisplay()`: Verifies that the `l10n_display` option includes 'defaultAsReadonly'
- `iconFieldIsReadOnlyWhenL10nModeExclude()`: Verifies the read-only state configuration for translations

**Purpose:** These tests ensure that icon fields are displayed as read-only in translations when configured, preventing misleading UI where fields appear editable but changes aren't saved.

### 3. Translation Support

**Test:**
- `translatedPageCanSynchronizeIconField()`: Verifies that German page translations are properly configured with language relationships

**Purpose:** Ensures that the test fixtures properly support multi-language scenarios for testing localization features.

## Test Fixtures

The tests use extended fixtures that include:
- Default language page (English) with an icon value ('fa-home')
- German language record (sys_language)
- German translation of the main page

These fixtures are defined in `Tests/Fixtures/pages.sql`.

## Running the Tests

To run only the functional tests:

```bash
vendor/bin/phpunit -c phpunit.functional.xml
```

To run all tests (unit + functional):

```bash
vendor/bin/phpunit -c phpunit.unit.xml
vendor/bin/phpunit -c phpunit.functional.xml
```

## Related Issue

These tests were added to verify the fix for [Issue #102](https://github.com/maikschneider/bw_icons/issues/102):
- Missing synchronization controls for icon fields in translations
- Misleading UI for read-only fields in translations
