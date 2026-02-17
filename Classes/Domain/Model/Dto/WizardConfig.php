<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;
use TYPO3\CMS\Core\Utility\VersionNumberUtility;

class WizardConfig
{
    public int $pid = 0;

    /** @var string[] */
    public array $iconProviders = [];

    public int $typo3Version = 0;

    public bool $isReadOnly = false;

    public function __construct()
    {
        $version = VersionNumberUtility::convertVersionStringToArray(VersionNumberUtility::getNumericTypo3Version());
        $this->typo3Version = $version['version_main'];
    }

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
        if ($pageInformation !== null) {
            $pid = (int)$pageInformation->getId();
        } else {
            // TYPO3 v12 fallback
            $controller = $request->getAttribute('frontend.controller');
            $pid = (int)($controller?->page['uid'] ?? 0);
        }

        $config = new WizardConfig();
        $config->pid = $pid;

        return $config;
    }

    public function getCacheIdentifier(): string
    {
        $extensionSettings = $this->getPageTsSettings();
        return md5(serialize($extensionSettings) . '-' . implode('-', $this->iconProviders));
    }

    public function getPageTsSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }
}
