<?php

return [
    'icon_selection' => [
        'path' => '/bwicons/iconselection',
        'access' => 'public',
        'target' => \Blueways\BwIcons\Controller\IconSelectionController::class . '::modalAction',
    ]
];
