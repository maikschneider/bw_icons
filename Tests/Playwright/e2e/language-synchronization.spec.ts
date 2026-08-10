import { expect, test } from '@playwright/test';
import {
  contentFrame,
  enableIconSets,
  loginAsAdmin,
  openRecord,
  resetExtensionConfiguration,
  setExtensionConfiguration,
  updateRecord,
} from '../support/typo3';

const APPLE_ICON = 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg';
const L10N_STATE = 'input[name="data[pages][2][l10n_state][tx_bwicons_icon]"]';

test.describe('Language synchronization', () => {
  test.beforeEach(async ({ page }) => {
    setExtensionConfiguration({ pages: 2 });
    enableIconSets(['Typo3Icons']);
    await loginAsAdmin(page);
  });

  test.afterAll(() => {
    enableIconSets([]);
    updateRecord('pages', { tx_bwicons_icon: '' }, { uid: 2 });
    resetExtensionConfiguration();
  });

  test('l10n_state toggles the element between read-only and editable', async ({ page }) => {
    updateRecord('pages', { tx_bwicons_icon: APPLE_ICON }, { uid: 2 });

    await openRecord(page, 'pages', 2);
    const frame = contentFrame(page);
    const element = frame.locator('bw-icon-element');
    await expect(element).toBeVisible();
    await expect(frame.locator(L10N_STATE).first()).toHaveCount(1);

    await frame.locator(`${L10N_STATE}[value="parent"]`).click();
    await expect(element.locator('.btn.btn-default[disabled]')).toBeVisible();
    await expect(element.locator('button.close.hidden')).toHaveCount(1);

    await frame.locator(`${L10N_STATE}[value="custom"]`).click();
    await expect(element.locator('.btn.btn-default[disabled]')).toHaveCount(0);
    await expect(element.locator('button.close:not(.hidden)')).toHaveCount(1);
  });
});
