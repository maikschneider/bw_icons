import { expect, test } from '@playwright/test';
import {
  contentFrame,
  enableIconSets,
  flushCaches,
  loginAsAdmin,
  mysql,
  openRecord,
} from '../support/typo3';

// The RTE preset bw_icons_test (Tests/Fixtures/Rte/IconPicker.yaml, registered
// by `ddev init-typo3`) imports Configuration/RTE/IconPicker.yaml.
test.describe('Rich text editor', () => {
  test.beforeEach(async ({ page }) => {
    enableIconSets(['font-awesome-4.7.0']);
    mysql("UPDATE `pages` SET `TSconfig` = CONCAT(`TSconfig`, '\\nRTE.default.preset = bw_icons_test') WHERE `uid` = 1;");
    flushCaches();
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
  });

  test('icon picker button opens the wizard', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await openRecord(page, 'tt_content', 1);
    const button = contentFrame(page).locator('.ck-toolbar button', { hasText: 'Icon Picker' });
    await expect(button).toBeVisible({ timeout: 30000 });

    await button.click();
    await expect(page.locator('.modal bw-icon-wizard')).toBeVisible({ timeout: 30000 });
    expect(errors).toEqual([]);
  });
});
