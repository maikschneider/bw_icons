<?php

// Get extension configuration
$extensionConfiguration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
    \TYPO3\CMS\Core\Configuration\ExtensionConfiguration::class
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
                'renderType' => 'iconSelection'
            ],
        ]
    ];

    // Register new field
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns(
        'sys_category',
        $temporaryColumns
    );

    // Display after title
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
        'sys_category',
        'tx_bwicons_icon',
        '',
        'after:title'
    );
}
