import { expect, test } from '@playwright/test';
import {
  contentFrame,
  enableIconSets,
  loginAsAdmin,
  openRecord,
  resetExtensionConfiguration,
  setExtensionConfiguration,
} from '../support/typo3';

/**
 * Page 2 is the translation of page 1 in the fixtures. Extension configuration
 * value 3 sets l10n_mode=exclude, value 4 adds l10n_display=defaultAsReadonly.
 */
test.describe('Language exclude mode', () => {
  test.beforeEach(async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    resetExtensionConfiguration();
  });

  test('excluded field is not rendered on the translation', async ({ page }) => {
    setExtensionConfiguration({ pages: 3 });
    await openRecord(page, 'pages', 2);

    await expect(contentFrame(page).locator('bw-icon-element')).toHaveCount(0);
  });

  test('excluded field with defaultAsReadonly renders disabled', async ({ page }) => {
    setExtensionConfiguration({ pages: 4 });
    await openRecord(page, 'pages', 2);

    const element = contentFrame(page).locator('bw-icon-element');
    await expect(element).toBeVisible();
    await expect(element.locator('.btn.btn-default[disabled]')).toBeVisible();
  });
});
