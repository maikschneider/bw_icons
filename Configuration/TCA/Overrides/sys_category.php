<?php

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

// Get extension configuration
$extensionConfiguration = GeneralUtility::makeInstance(
    ExtensionConfiguration::class
);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

// Add new field if enabled
if (isset($bwiconsConf['sys_category']) && (int)$bwiconsConf['sys_category'] === 1) {
    // Create new field
    $temporaryColumns = [
        'tx_bwicons_icon' => [
            'exclude' => 0,
            'label' => 'LLL:EXT:bw_icons/Resources/Private/Language/locallang.xlf:icon',
            'config' => [
                'type' => 'input',
                'renderType' => 'iconSelection',
            ],
        ],
    ];

    // Register new field
    ExtensionManagementUtility::addTCAcolumns(
        'sys_category',
        $temporaryColumns
    );

    // Display after title
    ExtensionManagementUtility::addToAllTCAtypes(
        'sys_category',
        'tx_bwicons_icon',
        '',
        'after:title'
    );
}
