<?php

namespace Blueways\BwIcons\Controller;

use Blueways\BwIcons\Utility\HelperUtility;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Fluid\View\StandaloneView;

class IconSelectionController extends ActionController
{
    /**
     * @param ServerRequestInterface $request
     * @param Response|null $response
     * @return Response
     */
    public function modalAction(ServerRequestInterface $request, Response $response = null): Response
    {
        if (null === $response) {
            $response = new Response();
        }

        $params = $request->getQueryParams();
        $pid = (int)$params['P']['pid'];
        $iconProviders = $params['P']['iconProviders'];
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $pid, $iconProviders);
        $tabs = $helperUtility->getModalTabs();

        /** @var StandaloneView $templateView */
        $templateView = GeneralUtility::makeInstance(StandaloneView::class);
        $templateView->setTemplatePathAndFilename('EXT:bw_icons/Resources/Private/Template/Modal.html');
        $templateView->assign('tabs', $tabs);

        $content = $templateView->render();
        $response->getBody()->write($content);

        return $response;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Response|null $response
     * @return Response
     */
    public function stylesheetsAction(ServerRequestInterface $request, Response $response = null): Response
    {
        if (null === $response) {
            $response = new Response();
        }

        $pid = (int)$request->getQueryParams()['pid'];
        $helperUtil = GeneralUtility::makeInstance(HelperUtility::class, $pid);
        $styleSheets = $helperUtil->getStyleSheets();

        return new JsonResponse($styleSheets);
    }
}
