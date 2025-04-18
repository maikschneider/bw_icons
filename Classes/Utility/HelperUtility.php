<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Domain\Model\Dto\WizardTab;
use Blueways\BwIcons\Provider\AbstractIconProvider;
use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Core\Cache\CacheManager;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class HelperUtility
{
    protected array $provider = [];

    public function __construct(protected WizardConfig $wizardConfig)
    {
    }

    public function getWizardTabs(): array
    {
        $cacheIdentifier = $this->wizardConfig->getCacheIdentifier();
        $cache = GeneralUtility::makeInstance(CacheManager::class)->getCache('bwicons_conf');

        if (($tabs = $cache->get($cacheIdentifier)) !== false && $this->isValidTempFiles()) {
            return $tabs;
        }

        $tabs = [];
        foreach ($this->getAllProvider() as $provider) {
            if (empty($this->wizardConfig->iconProviderClasses) || in_array($provider->getId(), $this->wizardConfig->iconProviderClasses, true)) {
                $tab = new WizardTab();
                $tab->id = $provider->getId();
                $tab->title = $provider->getTitle();
                $tab->folders = $provider->getWizardFolders();

                $tabs[] = $tab;
            }
        }

        $cache->set($cacheIdentifier, $tabs, [], 0);
        return $tabs;
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

        $extensionSettings = $this->wizardConfig->getPageTsSettings();
        $cacheIdentifier = $this->wizardConfig->getCacheIdentifier();
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
