import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { expect, FrameLocator, Page } from '@playwright/test';

export const PROJECT_ROOT = '/var/www/html';
export const FIXTURE_PATH = path.join(PROJECT_ROOT, 'Tests/Fixtures');

const DB = { host: 'db', user: 'db', password: 'db', name: 'db' };

/**
 * Extension configuration is a PHP-side concern and the Playwright container has
 * no PHP. `.ddev/commands/web/init-typo3` patches additional.php to merge this
 * file into EXTENSIONS/bw_icons, which lets the tests drive it from Node.
 *
 * It has to live on the shared ddev volume: the project directory is mounted
 * straight from the host here but reaches the web container through mutagen, so
 * a write under PROJECT_ROOT is only visible there seconds later.
 */
export const TEST_CONFIGURATION_FILE = '/mnt/ddev-global-cache/bw-icons-test-configuration.json';

export const BACKEND_USER = { username: 'admin', password: 'Passw0rd!' };

export function mysql(sql: string): string {
  return execFileSync(
    'mysql',
    [`-h${DB.host}`, `-u${DB.user}`, `-p${DB.password}`, '-N', '-s', DB.name],
    { input: sql, encoding: 'utf-8' }
  ).trim();
}

export function importSqlFile(file: string): void {
  execFileSync(
    'mysql',
    [`-h${DB.host}`, `-u${DB.user}`, `-p${DB.password}`, DB.name],
    { input: fs.readFileSync(file, 'utf-8'), stdio: ['pipe', 'inherit', 'inherit'] }
  );
}

function quote(value: string | number): string {
  return typeof value === 'number' ? String(value) : `'${value.replace(/'/g, "''")}'`;
}

export function updateRecord(
  table: string,
  values: Record<string, string | number>,
  where: Record<string, string | number>
): void {
  const set = Object.entries(values)
    .map(([column, value]) => `\`${column}\` = ${quote(value)}`)
    .join(', ');
  const condition = Object.entries(where)
    .map(([column, value]) => `\`${column}\` = ${quote(value)}`)
    .join(' AND ');
  mysql(`UPDATE \`${table}\` SET ${set} WHERE ${condition};`);
}

export function countRecords(table: string, where: Record<string, string | number>): number {
  const condition = Object.entries(where)
    .map(([column, value]) => `\`${column}\` = ${quote(value)}`)
    .join(' AND ');
  return Number(mysql(`SELECT COUNT(*) FROM \`${table}\` WHERE ${condition};`));
}

export function seeInDatabase(table: string, where: Record<string, string | number>): void {
  expect(
    countRecords(table, where),
    `expected a row in ${table} matching ${JSON.stringify(where)}`
  ).toBeGreaterThan(0);
}

/**
 * Drops the page TSconfig, the resolved icon providers and everything else TYPO3
 * keeps in the database. The file-based code cache needs no flushing: it is
 * switched off while the test configuration file exists.
 */
export function flushCaches(): void {
  const tables = mysql("SHOW TABLES LIKE 'cache\\_%';").split('\n').filter(Boolean);
  if (tables.length > 0) {
    mysql(tables.map((table) => `TRUNCATE TABLE \`${table}\`;`).join(' '));
  }
}

export function setExtensionConfiguration(configuration: Record<string, number>): void {
  fs.writeFileSync(TEST_CONFIGURATION_FILE, JSON.stringify(configuration));
  flushCaches();
}

export function resetExtensionConfiguration(): void {
  setExtensionConfiguration({ pages: 0, tt_content: 0, sys_category: 0 });
}

/**
 * Sets the page TSconfig of the root page so only the given icon sets are
 * registered. An empty list disables every provider.
 */
export function enableIconSets(iconSets: string[]): void {
  const tsConfig = iconSets
    .filter((iconSet) => iconSet !== '')
    .map((iconSet) =>
      iconSet === 'Typo3Icons'
        ? '@import "EXT:bw_icons/Configuration/TSconfig/Page/Typo3Icons.tsconfig"'
        : `@import "EXT:bw_icons/Tests/Fixtures/${iconSet}/page.tsconfig"`
    )
    .join('\n');

  updateRecord('pages', { TSconfig: tsConfig }, { uid: 1 });
  flushCaches();
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/typo3');
  await page.fill('#t3-username', BACKEND_USER.username);
  await page.fill('#t3-password', BACKEND_USER.password);
  await page.click('#t3-login-submit-section button');
  await expect(page.locator('.scaffold-header')).toBeVisible({ timeout: 30000 });
}

/** The TYPO3 backend renders modules inside this iframe. */
export function contentFrame(page: Page): FrameLocator {
  return page.frameLocator('[name="list_frame"]');
}

export async function openRecord(page: Page, table: string, uid: number | string): Promise<void> {
  await page.goto(`/typo3/record/edit?edit[${table}][${uid}]=edit`);
  await expect(contentFrame(page).locator('form[name="editform"]')).toBeVisible({
    timeout: 30000,
  });
}

export async function openNewRecord(page: Page, table: string): Promise<void> {
  await page.goto(`/typo3/record/edit?edit[${table}][-1]=new`);
  await expect(contentFrame(page).locator('form[name="editform"]')).toBeVisible({
    timeout: 30000,
  });
}

/** Opens the icon wizard from an already-open record form. */
export async function openWizardModal(page: Page) {
  const element = contentFrame(page).locator('bw-icon-element');
  await expect(element).toBeVisible({ timeout: 30000 });
  await element.locator('.btn.btn-default').click();

  const wizard = page.locator('.modal bw-icon-wizard');
  await expect(wizard).toBeVisible({ timeout: 30000 });
  return wizard;
}

export async function saveRecord(page: Page): Promise<void> {
  await contentFrame(page).locator('button[name="_savedok"]').click();
}
