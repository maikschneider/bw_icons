<?php

use Blueways\BwIcons\Controller\IconSelectionController;

return [
    'icon_selection' => [
        'path' => '/bwicons/iconselection',
        'access' => 'public',
        'target' => IconSelectionController::class . '::modalAction',
    ],
    'icon_stylesheets' => [
        'path' => '/bwicons/stylesheets',
        'access' => 'public',
        'target' => IconSelectionController::class . '::stylesheetsAction',
    ],
];
