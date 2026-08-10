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
        $pid = $data['effectivePid'] ?? 0;
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
        $iconProviders = $body['iconProviders'] ?? [];

        $config = new WizardConfig();
        $config->pid = $pid;
        $config->iconProviders = is_array($iconProviders)
            ? array_values(array_filter(array_map(strval(...), $iconProviders), static fn (string $id): bool => $id !== ''))
            : GeneralUtility::trimExplode(',', (string)$iconProviders, true);

        return $config;
    }

    public static function createFromFrontendRequest(ServerRequestInterface $request): self
    {
        $pageInformation = $request->getAttribute('frontend.page.information');

        $config = new WizardConfig();
        $config->pid = $pageInformation !== null ? (int)$pageInformation->getId() : 0;

        return $config;
    }
}
