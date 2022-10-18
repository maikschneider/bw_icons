<?php

$GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1629534119] = [
    'nodeName' => 'iconSelection',
    'priority' => 40,
    'class' => \Blueways\BwIcons\Form\Element\IconSelection::class
];

if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['bwicons_conf']) || !is_array($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['bwicons_conf'])) {
    $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['bwicons_conf'] = [];
}
