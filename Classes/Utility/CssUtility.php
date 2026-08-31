<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Service\IconService;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Attribute\AsAllowedCallable;

class CssUtility
{
    public function __construct(private readonly IconService $iconService)
    {
    }

    #[AsAllowedCallable]
    public function includeStyleSheets(string $content, array $conf, ServerRequestInterface $request): string
    {
        $cssFiles = '';
        $wizardConfig = WizardConfig::createFromFrontendRequest($request);

        foreach ($this->iconService->getStyleSheets($wizardConfig) as $sheet) {
            $cssFiles .= '<link rel="stylesheet" href="' . $sheet . '" />';
        }

        return $cssFiles;
    }
}
