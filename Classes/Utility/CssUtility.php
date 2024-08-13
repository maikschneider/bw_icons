<?php

namespace Blueways\BwIcons\Utility;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class CssUtility
{
    public function includeStyleSheets(string $content, array $conf, ServerRequestInterface $request): string
    {
        $cssFiles = '';
        $pid = $request->getAttribute('frontend.controller')->page['uid'] ?? 0;
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $pid);

        foreach ($helperUtility->getStyleSheets() as $sheet) {
            $cssFiles .= '<link rel="stylesheet" href="' . $sheet . '" />';
        }

        return $cssFiles;
    }
}
