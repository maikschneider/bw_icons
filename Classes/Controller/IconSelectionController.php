<?php

namespace Blueways\BwIcons\Controller;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Utility\HelperUtility;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;

class IconSelectionController
{
    public function __construct(
        private readonly ResponseFactoryInterface $responseFactory,
        private readonly HelperUtility $helperUtility
    ) {
    }

    public function modalAction(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $wizardConfig = WizardConfig::createFromFormPostBody($body);

        $tabs = $this->helperUtility->getWizardTabs($wizardConfig);

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

        $styleSheets = $this->helperUtility->getStyleSheets($wizardConfig);

        return new JsonResponse($styleSheets);
    }
}
