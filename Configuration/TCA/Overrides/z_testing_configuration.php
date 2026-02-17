<?php

// Get extension configuration
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\GeneralUtility;

$extensionConfiguration = GeneralUtility::makeInstance(ExtensionConfiguration::class);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] === 2) {
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['config']['behaviour']['allowLanguageSynchronization'] = 1;
}

if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] === 3) {
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['l10n_mode'] = 'exclude';
}

if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] === 4) {
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['l10n_mode'] = 'exclude';
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['l10n_display'] = 'defaultAsReadonly';
}

if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] === 5) {
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['config']['required'] = 1;
}
