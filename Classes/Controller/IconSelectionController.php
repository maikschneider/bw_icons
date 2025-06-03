<?php

namespace Blueways\BwIcons\Controller;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Utility\HelperUtility;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class IconSelectionController
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
    ) {
    }

    public function modalAction(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $wizardConfig = WizardConfig::createFromFormPostBody($body);

        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class, $wizardConfig);
        $tabs = $helperUtility->getWizardTabs();

        $response = $this->responseFactory->createResponse()
            ->withHeader('Content-Type', 'application/json; charset=utf-8');
        $response->getBody()->write(
            json_encode(['tabs' => $tabs], JSON_THROW_ON_ERROR),
        );
        return $response;
    }

    public function stylesheetsAction(ServerRequestInterface $request): Response
    {
        $body = $request->getParsedBody();
        $wizardConfig = WizardConfig::createFromFormPostBody($body);

        $helperUtil = GeneralUtility::makeInstance(HelperUtility::class, $wizardConfig);
        $styleSheets = $helperUtil->getStyleSheets();

        return new JsonResponse($styleSheets);
    }
}
