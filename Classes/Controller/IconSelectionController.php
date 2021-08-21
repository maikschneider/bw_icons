<?php

namespace Blueways\BwIcons\Controller;

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

        // @TODO
        $currentPageId = 1;
        $pageTsConfig = BackendUtility::getPagesTSconfig($currentPageId);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        $extensionSettings = $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
        $tabs = [];

        foreach ($extensionSettings as $key => $providerSettings) {
            $options = $providerSettings;
            unset($options['_typoScriptNodeValue']);
            $provider = GeneralUtility::makeInstance($providerSettings['_typoScriptNodeValue'], $options);

            $tab = [];
            $tab['id'] = $key;
            $tab['title'] = $providerSettings['title'];
            $tab['icons'] = $provider->getIcons();
            $tabs[] = $tab;
        }

        /** @var \TYPO3\CMS\Fluid\View\StandaloneView $templateView */
        $templateView = GeneralUtility::makeInstance(StandaloneView::class);
        $templateView->setTemplatePathAndFilename('EXT:bw_icons/Resources/Private/Template/Modal.html');
        $templateView->assign('tabs', $tabs);

        $content = $templateView->render();
        $response->getBody()->write($content);

        return $response;
    }
}
