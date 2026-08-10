import { expect, test } from '@playwright/test';
import {
  enableIconSets,
  loginAsAdmin,
  openRecord,
  openWizardModal,
  resetExtensionConfiguration,
  setExtensionConfiguration,
} from '../support/typo3';

/**
 * Icon counts are pinned to the fixtures in Tests/Fixtures, so they are exact.
 * The TYPO3 core icon set ships with the CMS and grows between releases, which
 * is why only that one is asserted as a range.
 */
test.describe('Icon providers', () => {
  test.beforeEach(async ({ page }) => {
    setExtensionConfiguration({ pages: 1 });
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    resetExtensionConfiguration();
  });

  test('warns when no provider is configured', async ({ page }) => {
    enableIconSets([]);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.callout-warning')).toBeVisible();
  });

  test('TYPO3 core icons', async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    const icons = wizard.locator('.icon-grid-item');
    await expect(icons.first()).toBeVisible({ timeout: 30000 });
    expect(await icons.count()).toBeGreaterThanOrEqual(700);
  });

  test('custom SVG folder provider', async ({ page }) => {
    enableIconSets(['CustomSvgIcons']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.icon-grid-item')).toHaveCount(57, { timeout: 30000 });
  });

  test('Font Awesome 4', async ({ page }) => {
    enableIconSets(['font-awesome-4.7.0']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.icon-grid-item')).toHaveCount(583, { timeout: 30000 });
  });

  test('Font Awesome 5', async ({ page }) => {
    enableIconSets(['font-awesome-5.15.4']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.icon-grid-item')).toHaveCount(1608, { timeout: 60000 });
  });

  test.skip('Font Awesome 6', async ({ page }) => {
    // Font Awesome 6 CSS processing takes very long in CI, needs to be
    // optimized before enabling this test.
    enableIconSets(['font-awesome-6.7.2']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.icon-grid-item')).toHaveCount(2156, { timeout: 60000 });
  });

  test('switching between providers', async ({ page }) => {
    enableIconSets(['Typo3Icons', 'font-awesome-5.15.4']);
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.nav-link')).toHaveCount(2, { timeout: 60000 });

    await wizard.locator('a.nav-link', { hasText: 'Font Awesome 5' }).click();
    await expect(wizard.locator('.icon-grid-item')).toHaveCount(1608, { timeout: 60000 });
  });
});
