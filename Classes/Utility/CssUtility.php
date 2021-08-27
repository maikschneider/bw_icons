<?php

namespace Blueways\BwIcons\Utility;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

class CssUtility
{

    /**
     * @var \TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer
     */
    public ContentObjectRenderer $cObj;

    public function includeStyleSheets(): string
    {
        $cssFiles = '';
        $pid = $this->cObj->data['uid'];
        /** @var \Blueways\BwIcons\Utility\HelperUtility $helperUtility */
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $pid);

        foreach ($helperUtility->getStyleSheets() as $sheet) {
            $cssFiles .= '<link rel="stylesheet" href="' . $sheet . '" />';
        }

        return $cssFiles;
    }
}
