<?php

namespace Blueways\BwIcons\Controller;

use Blueways\BwIcons\Utility\HelperUtility;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Fluid\View\StandaloneView;

class IconSelectionController extends ActionController
{

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \TYPO3\CMS\Core\Http\Response|null $response
     * @return \TYPO3\CMS\Core\Http\Response
     */
    public function modalAction(ServerRequestInterface $request, Response $response = null): Response
    {
        if (null === $response) {
            $response = new Response();
        }

        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class);
        $tabs = $helperUtility->getModalTabs();

        /** @var \TYPO3\CMS\Fluid\View\StandaloneView $templateView */
        $templateView = GeneralUtility::makeInstance(StandaloneView::class);
        $templateView->setTemplatePathAndFilename('EXT:bw_icons/Resources/Private/Template/Modal.html');
        $templateView->assign('tabs', $tabs);

        $content = $templateView->render();
        $response->getBody()->write($content);

        return $response;
    }
}
