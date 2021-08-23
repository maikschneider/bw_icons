<?php

defined('TYPO3_MODE') or die();

// Register PageTS
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
    'bw_icons',
    'Configuration/TSconfig/Page/Typo3Icons.tsconfig',
    'TYPO3 Core Icons'
);

// Create new field
$temporaryColumns = [
    'tx_bwicons_icon' => [
        'exclude' => 1,
        'label' => 'Icon',
        'config' => [
            'type' => 'input',
            'renderType' => 'iconSelection'
        ],
    ]
];

// Register new field
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns(
    'pages',
    $temporaryColumns
);

// Display new field if enabled
$extensionConfiguration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
    \TYPO3\CMS\Core\Configuration\ExtensionConfiguration::class
);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

if ((int)$bwiconsConf['pages'] === 1) {
    $firstBreak = strpos($GLOBALS['TCA']['pages']['palettes']['title']['showitem'], '--linebreak--');
    $GLOBALS['TCA']['pages']['palettes']['title']['showitem'] = substr_replace($GLOBALS['TCA']['pages']['palettes']['title']['showitem'],
        'tx_bwicons_icon,',
        $firstBreak, 0);
}
