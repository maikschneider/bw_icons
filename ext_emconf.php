<?php
$EM_CONF[$_EXTKEY] = [
    'title' => 'Icons',
    'description' => 'Form element for icon selection',
    'category' => 'templates',
    'author' => 'Maik Schneider',
    'author_email' => 'm.schneider@blueways.de',
    'author_company' => 'blueways.de',
    'state' => 'stable',
    'uploadfolder' => 0,
    'modify_tables' => '',
    'clearCacheOnLoad' => 0,
    'version' => '1.0.0',
    'autoload' => [
        'psr-4' => ['Bw\\BwIcons\\' => 'Classes']
    ],
    'constraints' => [
        'depends' => [
            'typo3' => '9.0.0-10.9.99',
        ]
    ]
];
