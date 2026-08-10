import { expect, test } from '@playwright/test';
import {
  contentFrame,
  countRecords,
  enableIconSets,
  loginAsAdmin,
  openRecord,
  resetExtensionConfiguration,
  saveRecord,
  seeInDatabase,
  setExtensionConfiguration,
  updateRecord,
} from '../support/typo3';

const APPLE_ICON = 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg';

test.describe('Form element', () => {
  test.beforeEach(async ({ page }) => {
    setExtensionConfiguration({ pages: 1 });
    updateRecord('pages', { tx_bwicons_icon: '' }, { uid: 1 });
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    resetExtensionConfiguration();
  });

  test('empty state shows the wizard button and no icon', async ({ page }) => {
    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');

    await expect(element).toBeVisible();
    await expect(element.locator('.btn.btn-default')).toBeVisible();
    await expect(element.locator('img')).toHaveCount(0);
    await expect(element.locator('.fontIcon')).toHaveCount(0);
    await expect(element.locator('button.close:not(.hidden)')).toHaveCount(0);
  });

  test('filled state renders an SVG icon', async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    updateRecord('pages', { tx_bwicons_icon: APPLE_ICON }, { uid: 1 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');

    await expect(
      element.locator(
        'img.img-thumbnail[alt="actions-brand-apple"][src$="actions/actions-brand-apple.svg"]'
      )
    ).toBeVisible();
    await expect(element.locator('.close.hidden')).toHaveCount(0);
  });

  test('filled state renders a font icon', async ({ page }) => {
    enableIconSets(['font-awesome-4.7.0']);
    updateRecord('pages', { tx_bwicons_icon: 'fa fa-apple' }, { uid: 1 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');

    await expect(element.locator('.fontIcon.fa.fa-apple')).toBeVisible();
    await expect(element.locator('img')).toHaveCount(0);
    await expect(element.locator('.close.hidden')).toHaveCount(0);
  });

  test('required field without a value is invalid on load', async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    updateRecord('pages', { tx_bwicons_icon: '' }, { uid: 1 });
    setExtensionConfiguration({ pages: 5 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');

    await expect(element).toBeVisible();
    await expect(element.locator('img')).toHaveCount(0);
    await expect(element.locator('.fontIcon')).toHaveCount(0);
    await expect(element.locator('.is-invalid')).toBeVisible();
  });

  test('removing a required icon blocks saving', async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    updateRecord('pages', { tx_bwicons_icon: APPLE_ICON }, { uid: 1 });
    setExtensionConfiguration({ pages: 5 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');
    await expect(element.locator('img')).toBeVisible();

    await element.locator('button.close').click();
    await expect(element.locator('img')).toHaveCount(0);
    await expect(element.locator('.is-invalid')).toBeVisible();

    await saveRecord(page);

    await expect(element.locator('.is-invalid')).toBeVisible();
    seeInDatabase('pages', { uid: 1, tx_bwicons_icon: APPLE_ICON });
  });

  test('remove button clears the icon and the change persists', async ({ page }) => {
    enableIconSets(['Typo3Icons']);
    updateRecord('pages', { tx_bwicons_icon: APPLE_ICON }, { uid: 1 });

    await openRecord(page, 'pages', 1);
    const element = contentFrame(page).locator('bw-icon-element');
    await expect(element.locator('img')).toBeVisible();

    await element.locator('button.close').click();
    await expect(element.locator('img')).toHaveCount(0);

    await saveRecord(page);
    await expect(element).toBeVisible();

    await expect.poll(() => countRecords('pages', { uid: 1, tx_bwicons_icon: '' })).toBe(1);
    await expect(element.locator('img')).toHaveCount(0);
    await expect(element.locator('.fontIcon')).toHaveCount(0);
  });
});
