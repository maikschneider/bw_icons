<?php

// Get extension configuration
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\GeneralUtility;

$extensionConfiguration = GeneralUtility::makeInstance(ExtensionConfiguration::class);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] === 2) {
    $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon']['config']['iconProviders'] = 'typo3icons';
}
