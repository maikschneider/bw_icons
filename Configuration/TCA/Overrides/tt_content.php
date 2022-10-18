<?php

// Get extension configuration
$extensionConfiguration = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
    \TYPO3\CMS\Core\Configuration\ExtensionConfiguration::class
);
$bwiconsConf = $extensionConfiguration->get('bw_icons');

// Add new field if enabled
if (isset($bwiconsConf['tt_content']) && (int)$bwiconsConf['tt_content'] === 1) {

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
        'tt_content',
        $temporaryColumns
    );

    // Display new field next to date field
    $firstBreak = strpos($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'], '--linebreak--');
    $secondBreak = strpos($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'], '--linebreak--',
        $firstBreak + 13);
    $GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'] = substr_replace($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'],
        'tx_bwicons_icon,',
        $secondBreak, 0);
}
