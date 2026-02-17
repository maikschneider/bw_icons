<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;

class WizardConfig
{
    public int $pid = 0;

    /** @var string[] */
    public array $iconProviders = [];

    public bool $isReadOnly = false;

    public static function createFromFormElementData(array $data): self
    {
        $pid = $data['tableName'] === 'pages' ? $data['vanillaUid'] : $data['databaseRow']['pid'];
        $pid = MathUtility::canBeInterpretedAsInteger($pid) ? (int)$pid : 0;
        $iconProviders = $data['parameterArray']['fieldConf']['config']['iconProviders'] ?? '';
        $iconProviders = GeneralUtility::trimExplode(',', $iconProviders, true);

        $fieldName = $data['fieldName'];
        $l10nMode = $data['processedTca']['columns'][$fieldName]['l10n_mode'] ?? '';
        $l10nDisplay = $data['processedTca']['columns'][$fieldName]['l10n_display'] ?? '';
        $isReadOnly = str_contains((string)$l10nMode, 'exclude') && str_contains((string)$l10nDisplay, 'defaultAsReadonly');

        $config = new WizardConfig();
        $config->pid = $pid;
        $config->iconProviders = $iconProviders;
        $config->isReadOnly = $isReadOnly;

        return $config;
    }

    public static function createFromFormPostBody(object|array|null $body): self
    {
        $pid = (int)($body['pid'] ?? 0);
        $iconProviders = $body['iconProvidersString'] ?? [];

        $config = new WizardConfig();
        $config->pid = $pid;
        $config->iconProviders = is_array($iconProviders) ? $iconProviders : [];

        return $config;
    }

    public static function createFromFrontendRequest(ServerRequestInterface $request): self
    {
        $pageInformation = $request->getAttribute('frontend.page.information');
        $pid = (int)$pageInformation->getId();

        $config = new WizardConfig();
        $config->pid = $pid;

        return $config;
    }
}
