import { expect, test } from '@playwright/test';
import {
  contentFrame,
  loginAsAdmin,
  openRecord,
  resetExtensionConfiguration,
  setExtensionConfiguration,
  updateRecord,
} from '../support/typo3';

const TABLES = ['pages', 'tt_content', 'sys_category'];

test.describe('Default fields', () => {
  test.beforeEach(async ({ page }) => {
    updateRecord('pages', { tx_bwicons_icon: '' }, { uid: 1 });
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    resetExtensionConfiguration();
  });

  for (const table of TABLES) {
    test(`no icon field in ${table} when disabled`, async ({ page }) => {
      setExtensionConfiguration({ [table]: 0 });
      await openRecord(page, table, 1);

      await expect(contentFrame(page).locator('bw-icon-element')).toHaveCount(0);
    });

    test(`icon field in ${table} when enabled`, async ({ page }) => {
      setExtensionConfiguration({ [table]: 1 });
      await openRecord(page, table, 1);

      await expect(contentFrame(page).locator('bw-icon-element')).toBeVisible();
    });
  }
});
