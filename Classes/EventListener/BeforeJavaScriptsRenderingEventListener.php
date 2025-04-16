<?php

namespace Blueways\BwIcons\EventListener;

use TYPO3\CMS\Core\Http\ApplicationType;
use TYPO3\CMS\Core\Page\Event\BeforeJavaScriptsRenderingEvent;

class BeforeJavaScriptsRenderingEventListener
{
    public function __invoke(BeforeJavaScriptsRenderingEvent $event): void
    {
        if (ApplicationType::fromRequest($GLOBALS['TYPO3_REQUEST'])->isBackend()) {
            $event->getAssetCollector()->addJavaScript(
                'bw-icon-wizard',
                'EXT:bw_icons/Resources/Public/JavaScript/IconWizard.js',
                ['type' => 'module']
            );
        }
    }
}
