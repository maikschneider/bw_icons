<?php

declare(strict_types=1);

namespace Blueways\BwIcons\EventListener;

use TYPO3\CMS\Backend\Controller\Event\AfterBackendPageRenderEvent;
use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Core\Page\PageRenderer;

class AfterBackendPageRendererEventListener
{
    public function __construct(
        private PageRenderer $pageRenderer
    ) {
    }

    #[AsEventListener('redirects-after-backend-page-renderer-event')]
    public function __invoke(AfterBackendPageRenderEvent $event): void
    {
        $this->pageRenderer->loadJavaScriptModule('@blueways/bw-icons/IconWizard.js');
        $this->pageRenderer->addInlineLanguageLabelFile('EXT:bw_icons/Resources/Private/Language/locallang.xlf');
    }
}
