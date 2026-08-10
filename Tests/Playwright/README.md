# Acceptance tests

End-to-end tests for the TYPO3 backend, running in a real Chromium through the
[`xima-media/ddev-playwright`](https://github.com/xima-media/ddev-playwright)
DDEV add-on.

## Running

```bash
ddev init-typo3                 # fresh database, fixtures, admin user
ddev playwright test            # run the whole suite
ddev playwright test icon-provider
ddev playwright test --headed --debug
ddev playwright show-report     # last HTML report
```

`ddev init-typo3` is required once after a checkout or whenever the database is
reset. Playwright's `globalSetup` re-imports `Tests/Fixtures/*.sql` before every
run, so individual specs may modify records freely.

## How the tests drive TYPO3

The suite runs inside the Playwright container, which has no PHP. Two indirect
channels drive TYPO3 from outside the PHP process:

- **Extension configuration** — `setExtensionConfiguration()` writes
`var/transient/bw-icons-test-configuration.json`. `ddev init-typo3` patches
`config/system/additional.php` to merge that file into
`EXTENSIONS/bw_icons`. The magic numbers for `pages` (2 = language
synchronization, 3 = `l10n_mode=exclude`, 4 = plus `defaultAsReadonly`,
5 = required) are defined in
`Configuration/TCA/Overrides/z_testing_configuration.php`.
- **Caches** — `flushCaches()` deletes `var/cache` and truncates the `cache_*`
tables, which is the `typo3 cache:flush` equivalent available over the shared
volume and the database.

Records and assertions against the database go through the `mysql` client via
the helpers in `support/typo3.ts`.

## Layout

| Path | Purpose |
| --- | --- |
| `e2e/*.spec.ts` | the tests |
| `support/typo3.ts` | login, frame, fixture, cache and database helpers |
| `global-setup.ts` | truncates and re-imports the SQL fixtures |

The backend renders modules inside the `list_frame` iframe (`contentFrame()`),
while the icon wizard modal is appended to the top-level document — assertions
on the wizard therefore use `page`, not the frame locator.
