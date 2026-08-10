import { expect, test } from '@playwright/test';
import {
  contentFrame,
  enableIconSets,
  loginAsAdmin,
  openNewRecord,
  openRecord,
  openWizardModal,
  resetExtensionConfiguration,
  setExtensionConfiguration,
} from '../support/typo3';

const APPLE_ICON = 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg';

test.describe('Wizard modal', () => {
  test.beforeEach(async ({ page }) => {
    setExtensionConfiguration({ pages: 1, tt_content: 1 });
    enableIconSets(['Typo3Icons']);
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    resetExtensionConfiguration();
  });

  test('opens on a new record', async ({ page }) => {
    await openNewRecord(page, 'tt_content');
    const wizard = await openWizardModal(page);

    const icons = wizard.locator('.icon-grid-item');
    await expect(icons.first()).toBeVisible({ timeout: 30000 });
    expect(await icons.count()).toBeGreaterThanOrEqual(50);
  });

  test('selecting an icon writes it back into the form', async ({ page }) => {
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    const icons = wizard.locator('.icon-grid-item');
    await expect(icons.first()).toBeVisible({ timeout: 30000 });
    expect(await icons.count()).toBeGreaterThanOrEqual(50);

    await wizard.locator('.icon-grid-item img[alt="actions-brand-apple"]').click();
    await expect(wizard.locator('.icon-grid-item.active')).toHaveCount(1);

    await page.locator('.modal .btn-primary').click();

    const element = contentFrame(page).locator('bw-icon-element');
    await expect(
      element.locator(
        'img.img-thumbnail[alt="actions-brand-apple"][src$="actions/actions-brand-apple.svg"]'
      )
    ).toBeVisible();
    await expect(
      contentFrame(page).locator('input[name="data[pages][1][tx_bwicons_icon]"]')
    ).toHaveValue(APPLE_ICON);
  });

  test('search filters the icon grid', async ({ page }) => {
    await openRecord(page, 'pages', 1);
    const wizard = await openWizardModal(page);

    await expect(wizard.locator('.icon-grid-item').first()).toBeVisible({ timeout: 30000 });

    await wizard.locator('input[type="search"]').fill('apple');
    await expect(wizard.locator('.icon-grid-item')).toHaveCount(1);
  });
});
