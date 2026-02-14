-- Default language page
insert into `pages` (`uid`, `pid`, `title`, `slug`, `sys_language_uid`, `l10n_parent`, `l10n_source`, `perms_userid`,
										 `perms_groupid`, `perms_user`, `perms_group`, `perms_everybody`, `doktype`, `is_siteroot`, `TSconfig`, `tx_bwicons_icon`)
values (1, 0, 'Main', '/', 0, 0, 0, 1, 1, 31, 31, 1, 1, 1, '@import "EXT:bw_icons/Configuration/TSconfig/Page/Typo3Icons.tsconfig"', 'fa-home');

-- German language record
insert into `sys_language` (`uid`, `title`, `language_isocode`)
values (1, 'German', 'de');

-- German translation of Main page
insert into `pages` (`uid`, `pid`, `title`, `slug`, `sys_language_uid`, `l10n_parent`, `l10n_source`, `perms_userid`,
										 `perms_groupid`, `perms_user`, `perms_group`, `perms_everybody`, `doktype`, `TSconfig`, `tx_bwicons_icon`)
values (2, 0, 'Hauptseite', '/', 1, 1, 1, 1, 1, 31, 31, 1, 1, '@import "EXT:bw_icons/Configuration/TSconfig/Page/Typo3Icons.tsconfig"', '');
