<?php

namespace Blueways\BwIcons\Service;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Domain\Model\Dto\WizardTab;
use Blueways\BwIcons\Factory\IconProviderFactory;
use Blueways\BwIcons\Provider\AbstractIconProvider;
use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;

class IconService
{
    /** @var array<string, array<AbstractIconProvider>> */
    protected array $providerCache = [];

    public function __construct(
        private readonly FrontendInterface $cache,
        private readonly IconProviderFactory $providerFactory
    ) {
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
                $tab->markup = $provider->getMarkup();

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
            $prov = $this->providerFactory->create($options['_typoScriptNodeValue'], $options);
            $prov->setCacheIdentifier($cacheIdentifier);
            $prov->setId($key);
            $prov->setTitle($options['title']);

            $providers[] = $prov;
        }

        $this->providerCache[$cacheIdentifier] = $providers;

        return $providers;
    }

    public function getMarkupForIconValue(string $value, WizardConfig $wizardConfig): ?string
    {
        $tabs = $this->getWizardTabs($wizardConfig);
        foreach ($tabs as $tab) {
            if ($tab->markup === null) {
                continue;
            }
            foreach ($tab->folders as $folder) {
                foreach ($folder->icons as $icon) {
                    if ($icon->value === $value) {
                        return $tab->markup;
                    }
                }
            }
        }
        return null;
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
