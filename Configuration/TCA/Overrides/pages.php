<?php

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

// Register PageTS
ExtensionManagementUtility::registerPageTSConfigFile(
    'bw_icons',
    'Configuration/TSconfig/Page/Typo3Icons.tsconfig',
    'Icon Picker: TYPO3 Core Icons'
);

// Get extension configuration
$extensionConfiguration = GeneralUtility::makeInstance(
    ExtensionConfiguration::class
);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

// Add new field if enabled
if (isset($bwiconsConf['pages']) && (int)$bwiconsConf['pages'] >= 1) {
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
        'pages',
        $temporaryColumns
    );

    // Display field next to title field
    $firstBreak = strpos((string)$GLOBALS['TCA']['pages']['palettes']['title']['showitem'], '--linebreak--');
    $GLOBALS['TCA']['pages']['palettes']['title']['showitem'] = substr_replace(
        $GLOBALS['TCA']['pages']['palettes']['title']['showitem'],
        'tx_bwicons_icon,',
        $firstBreak,
        0
    );
}
