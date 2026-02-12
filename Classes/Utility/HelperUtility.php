<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Domain\Model\Dto\WizardTab;
use Blueways\BwIcons\Provider\AbstractIconProvider;
use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class HelperUtility
{
    /** @var array<string, array<AbstractIconProvider>> */
    protected array $providerCache = [];

    public function __construct(private readonly FrontendInterface $cache)
    {
    }

    public function getWizardTabs(WizardConfig $wizardConfig): array
    {
        $cacheIdentifier = $wizardConfig->getCacheIdentifier();

        if (($tabs = $this->cache->get($cacheIdentifier)) !== false && $this->isValidTempFiles($wizardConfig)) {
            return $tabs;
        }

        $tabs = [];
        foreach ($this->getAllProvider($wizardConfig) as $provider) {
            if (empty($wizardConfig->iconProviders) || in_array($provider->getId(), $wizardConfig->iconProviders, true)) {
                $tab = new WizardTab();
                $tab->id = $provider->getId();
                $tab->title = $provider->getTitle();
                $tab->folders = $provider->getWizardFolders();
                $tab->stylesheet = $provider->getStyleSheet();

                $tabs[] = $tab;
            }
        }

        $this->cache->set($cacheIdentifier, $tabs, [], 0);
        return $tabs;
    }

    /**
     * Checks if all temp dirs of css provider do exist
     */
    protected function isValidTempFiles(WizardConfig $wizardConfig): bool
    {
        foreach ($this->getAllProvider($wizardConfig) as $provider) {
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
    protected function getAllProvider(WizardConfig $wizardConfig): array
    {
        $cacheIdentifier = $wizardConfig->getCacheIdentifier();

        if (isset($this->providerCache[$cacheIdentifier])) {
            return $this->providerCache[$cacheIdentifier];
        }

        $extensionSettings = $wizardConfig->getPageTsSettings();
        $providers = [];

        foreach ($extensionSettings as $key => $options) {
            /** @var AbstractIconProvider $prov */
            $prov = GeneralUtility::makeInstance($options['_typoScriptNodeValue'], $options);
            $prov->setCacheIdentifier($cacheIdentifier);
            $prov->setId($key);
            $prov->setTitle($options['title']);

            $providers[] = $prov;
        }

        $this->providerCache[$cacheIdentifier] = $providers;

        return $providers;
    }

    public function getStyleSheets(WizardConfig $wizardConfig): array
    {
        $sheets = [];
        foreach ($this->getAllProvider($wizardConfig) as $provider) {
            if (!is_a($provider, CssIconProvider::class)) {
                continue;
            }
            $sheets[] = $provider->getStyleSheet();
        }
        return $sheets;
    }
}
