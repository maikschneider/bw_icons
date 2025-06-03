<?php

// register custom form element
$GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1629534119] = [
    'nodeName' => 'iconSelection',
    'priority' => 40,
    'class' => \Blueways\BwIcons\Form\Element\IconSelection::class,
];

// register cache
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['bwicons_conf'] ??= [];

// register global backend css
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['bw_icons'] = 'EXT:bw_icons/Resources/Public/Css/Backend.css';
