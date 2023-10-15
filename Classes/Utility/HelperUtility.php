<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Provider\AbstractIconProvider;
use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Cache\CacheManager;
use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class HelperUtility
{
    protected int $pid = 0;

    protected string $iconProviders = '';

    protected array $provider = [];

    public function __construct(int $pid, string $iconProviders = '')
    {
        $this->pid = $pid;
        $this->iconProviders = $iconProviders;
    }

    public function getModalTabs(): array
    {
        $cacheIdentifier = $this->getCacheIdentifier();
        $cache = GeneralUtility::makeInstance(CacheManager::class)->getCache('bwicons_conf');

        if (($tabs = $cache->get($cacheIdentifier)) !== false && $this->isValidTempFiles()) {
            return $tabs;
        }

        $tabs = [];
        $iconProviders = GeneralUtility::trimExplode(',', $this->iconProviders, true);
        foreach ($this->getAllProvider() as $provider) {
            if (empty($iconProviders) || in_array($provider->getId(), $iconProviders, true)) {
                $tab = [];
                $tab['id'] = $provider->getId();
                $tab['title'] = $provider->getTitle();
                $tab['folders'] = $provider->getIcons();

                $tabs[] = $tab;
            }
        }

        $cache->set($cacheIdentifier, $tabs, [], 0);
        return $tabs;
    }

    protected function getCacheIdentifier(): string
    {
        $extensionSettings = $this->getSettings();
        return md5(serialize($extensionSettings) . '-' . $this->iconProviders);
    }

    protected function getSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }

    /**
     * Checks if all temp dirs of css provider do exist
     */
    protected function isValidTempFiles(): bool
    {
        foreach ($this->getAllProvider() as $provider) {
            if (!is_a($provider, CssIconProvider::class)) {
                continue;
            }
            if (!$provider->tempFileExist()) {
                return false;
            }
        }
        return true;
    }

    /**
     * @return array<AbstractIconProvider>
     */
    protected function getAllProvider(): array
    {
        if (count($this->provider)) {
            return $this->provider;
        }

        $extensionSettings = $this->getSettings();
        $cacheIdentifier = $this->getCacheIdentifier();
        //$languageService = GeneralUtility::makeInstance(LanguageService::class);

        foreach ($extensionSettings as $key => $options) {
            /** @var AbstractIconProvider $prov */
            $prov = GeneralUtility::makeInstance($options['_typoScriptNodeValue'], $options);
            $prov->setCacheIdentifier($cacheIdentifier);
            $prov->setId($key);
            $prov->setTitle($options['title']);

            $this->provider[] = $prov;
        }

        return $this->provider;
    }

    public function getStyleSheets(): array
    {
        $sheets = [];
        foreach ($this->getAllProvider() as $provider) {
            if (!is_a($provider, CssIconProvider::class)) {
                continue;
            }
            $sheets[] = $provider->getStyleSheet();
        }
        return $sheets;
    }
}
