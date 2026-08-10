import * as fs from 'fs';
import { flushCaches, TEST_CONFIGURATION_FILE } from './support/typo3';

/**
 * Removing the file restores the shipped extension configuration and re-enables
 * the code cache, so the DDEV project is usable by hand after a test run.
 */
export default async function globalTeardown(): Promise<void> {
  fs.rmSync(TEST_CONFIGURATION_FILE, { force: true });
  flushCaches();
}
