import * as fs from 'fs';
import * as path from 'path';
import { FIXTURE_PATH, importSqlFile, mysql, resetExtensionConfiguration } from './support/typo3';

export default async function globalSetup(): Promise<void> {
  const tables = fs
    .readdirSync(FIXTURE_PATH)
    .filter((file) => file.endsWith('.sql'))
    .map((file) => path.basename(file, '.sql'));

  const truncates = tables.map((table) => `TRUNCATE TABLE \`${table}\`;`).join(' ');
  mysql(`SET FOREIGN_KEY_CHECKS = 0; ${truncates} SET FOREIGN_KEY_CHECKS = 1;`);

  for (const table of tables) {
    console.log(`Importing ${table}.sql...`);
    importSqlFile(path.join(FIXTURE_PATH, `${table}.sql`));
  }

  resetExtensionConfiguration();
}
