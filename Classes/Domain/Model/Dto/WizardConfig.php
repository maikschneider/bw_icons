<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;
use TYPO3\CMS\Core\Utility\VersionNumberUtility;

class WizardConfig
{
    /**
     * @var array<int, class-string>
     */
    public array $iconProviderClasses = [];

    public int $typo3Version = 0;

    public function __construct(public int $pid = 0, public string $iconProvidersString = '')
    {
        $version = VersionNumberUtility::convertVersionStringToArray(VersionNumberUtility::getNumericTypo3Version());
        $this->typo3Version = $version['version_main'];

        $iconProviders = GeneralUtility::trimExplode(',', $this->iconProvidersString, true);
        $this->iconProviderClasses = $iconProviders;
    }

    public static function createFromFormElementData(array $data): self
    {
        $pid = $data['tableName'] === 'pages' ? $data['vanillaUid'] : $data['databaseRow']['pid'];
        $pid = MathUtility::canBeInterpretedAsInteger($pid) ? (int)$pid : 0;
        $iconProvidersString = $data['parameterArray']['fieldConf']['config']['iconProviders'] ?? '';

        return new self($pid, $iconProvidersString);
    }

    public static function createFromFormPostBody(object|array|null $body): self
    {
        $pid = (int)($body['pid'] ?? 0);
        $iconProvidersString = $body['iconProvidersString'] ?? '';

        return new self($pid, $iconProvidersString);
    }

    public function getCacheIdentifier(): string
    {
        $extensionSettings = $this->getPageTsSettings();
        return md5(serialize($extensionSettings) . '-' . $this->iconProvidersString);
    }

    public function getPageTsSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }
}
