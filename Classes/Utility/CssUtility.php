<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class CssUtility
{
    public function includeStyleSheets(string $content, array $conf, ServerRequestInterface $request): string
    {
        $cssFiles = '';
        $pid = $request->getAttribute('frontend.controller')->page['uid'] ?? 0;
        $wizardConfig = GeneralUtility::makeInstance(WizardConfig::class, $pid);
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $wizardConfig);

        foreach ($helperUtility->getStyleSheets() as $sheet) {
            $cssFiles .= '<link rel="stylesheet" href="' . $sheet . '" />';
        }

        return $cssFiles;
    }
}
