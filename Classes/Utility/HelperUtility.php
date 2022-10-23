<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Localization\LanguageService;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class HelperUtility
{

    protected int $pid = 0;

    protected array $provider = [];

    protected FrontendInterface $cache;

    protected TypoScriptService $typoScriptService;

    public function __construct(
        FrontendInterface $cache,
        TypoScriptService $typoScriptService
    ) {
        $this->cache = $cache;
        $this->typoScriptService = $typoScriptService;
    }

    public function setPid(int $pid): void
    {
        $this->pid = $pid;
    }

    public function getModalTabs(): array
    {
        $cacheIdentifier = $this->getCacheIdentifier();

        if (($tabs = $this->cache->get($cacheIdentifier)) !== false && $this->isValidTempFiles()) {
            return $tabs;
        }

        $tabs = [];
        foreach ($this->getAllProvider() as $provider) {
            $tab = [];
            $tab['id'] = $provider->getId();
            $tab['title'] = $provider->getTitle();
            $tab['folders'] = $provider->getIcons();

            $tabs[] = $tab;
        }

        $this->cache->set($cacheIdentifier, $tabs, [], 0);
        return $tabs;
    }

    protected function getCacheIdentifier(): string
    {
        $extensionSettings = $this->getSettings();
        return md5(serialize($extensionSettings));
    }

    protected function getSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        return $this->typoScriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }

    /**
     * Checks if all temp dirs of css provider do exist
     *
     * @return bool
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
     * @return array<\Blueways\BwIcons\Provider\AbstractIconProvider>
     */
    protected function getAllProvider(): array
    {
        if (count($this->provider)) {
            return $this->provider;
        }

        $extensionSettings = $this->getSettings();
        $cacheIdentifier = $this->getCacheIdentifier();
        $languageService = $this->getLanguageService();

        foreach ($extensionSettings as $key => $options) {
            /** @var \Blueways\BwIcons\Provider\AbstractIconProvider $prov */
            $prov = GeneralUtility::makeInstance($options['_typoScriptNodeValue'], $options);
            $prov->setCacheIdentifier($cacheIdentifier);
            $prov->setId($key);
            $prov->setTitle($languageService->sL($options['title']));

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

    protected static function getLanguageService(): LanguageService
    {
        return $GLOBALS['LANG'] ?? GeneralUtility::makeInstance(LanguageServiceFactory::class)->createFromUserPreferences($GLOBALS['BE_USER'] ?? null);
    }
}
