<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Icon Picker',
    'description' => 'Form element for icon selection. Generates a browsable gallery of your icon fonts and SVGs - just link your stylesheet or image directory that you use in the frontend! Works with FontAwesome, Bootstrap, Icomoon.. Optionally adds icon field to pages and tt_content.',
    'category' => 'be',
    'author' => 'Maik Schneider',
    'author_email' => 'maik.schneider@xima.de',
    'author_company' => 'XIMA Media GmbH',
    'state' => 'stable',
    'version' => '4.0.0',
    'autoload' => [
        'psr-4' => ['Blueways\\BwIcons\\' => 'Classes'],
    ],
    'constraints' => [
        'depends' => [
            'typo3' => '12.0.0-13.4.99',
        ],
    ],
];
