<?php

namespace Blueways\BwIcons\Utility;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

class CssUtility
{
    public ContentObjectRenderer $cObj;

    public function includeStyleSheets(): string
    {
        $cssFiles = '';
        $pid = (int)$this->cObj->data['uid'];
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $pid);

        foreach ($helperUtility->getStyleSheets() as $sheet) {
            $cssFiles .= '<link rel="stylesheet" href="' . $sheet . '" />';
        }

        return $cssFiles;
    }
}
