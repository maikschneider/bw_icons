<?php

defined('TYPO3_MODE') or die();

$GLOBALS['TCA']['tt_content']['columns']['tx_bwicons_icon'] = [
    'exclude' => 1,
    'label' => 'Icon',
    'config' => [
        'type' => 'input',
        'renderType' => 'iconSelection'
    ],
];

$firstBreak = strpos($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'], '--linebreak--');
$secondBreak = strpos($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'], '--linebreak--',
    $firstBreak + 13);
$GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'] = substr_replace($GLOBALS['TCA']['tt_content']['palettes']['headers']['showitem'],
    'tx_bwicons_icon,',
    $secondBreak, 0);
