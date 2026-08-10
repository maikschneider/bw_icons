import { expect, test } from '@playwright/test';
import {
  contentFrame,
  enableIconSets,
  loginAsAdmin,
  openRecord,
  openWizardModal,
  resetExtensionConfiguration,
  setExtensionConfiguration,
  updateRecord,
} from '../support/typo3';

test.describe('Custom icon markup', () => {
  test.beforeEach(async ({ page }) => {
    setExtensionConfiguration({ pages: 1 });
    enableIconSets(['font-awesome-4.7.0-custom-markup']);
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    resetExtensionConfiguration();
  });

  test('custom markup is used in the wizard and after selecting', async ({ page }) => {
    updateRecord('pages', { tx_bwicons_icon: '' }, { uid: 1 });
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(
      wizard.locator('.icon-grid-item span.custom-icon-wrapper').first()
    ).toBeVisible({ timeout: 30000 });
    await expect(wizard.locator('.icon-grid-item i')).toHaveCount(0);

    await wizard.locator('.icon-grid-item span.custom-icon-wrapper.fa-glass').click();
    await page.locator('.modal .btn-primary').click();

    const element = contentFrame(page).locator('bw-icon-element');
    await expect(element.locator('span.custom-icon-wrapper.fa-glass')).toBeVisible();
    await expect(element.locator('i')).toHaveCount(0);
  });

  test('custom markup is used for an already saved icon', async ({ page }) => {
    updateRecord('pages', { tx_bwicons_icon: 'fa fa-glass' }, { uid: 1 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');

    await expect(element.locator('span.custom-icon-wrapper.fa-glass')).toBeVisible();
    await expect(element.locator('i')).toHaveCount(0);
  });
});
