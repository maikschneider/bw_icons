<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class HelperUtility
{

    protected int $pid = 0;

    /**
     * HelperUtility constructor.
     *
     * @param int $pid
     */
    public function __construct(int $pid)
    {
        $this->pid = $pid;
    }

    public function getModalTabs(): array
    {
        $extensionSettings = $this->getSettings();
        $tabs = [];

        foreach ($extensionSettings as $key => $providerSettings) {

            $tab = [];
            $tab['id'] = $key;
            $tab['title'] = $providerSettings['title'];
            $tab['folders'] = $this->getModalConfFromSettings($key, $providerSettings);

            $tabs[] = $tab;
        }

        return $tabs;
    }

    protected function getSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }

    protected function getModalConfFromSettings($key, $providerSettings)
    {
        $cacheIdentifier = $key;
        $cache = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Cache\CacheManager::class)->getCache('bwicons_conf');

        if (($value = $cache->get($cacheIdentifier)) === false) {

            // construct Provider and get conf
            $options = $providerSettings;
            unset($options['_typoScriptNodeValue']);
            $provider = GeneralUtility::makeInstance($providerSettings['_typoScriptNodeValue'], $options);
            $value = $provider->getIcons();

            // save conf
            $cache->set($cacheIdentifier, $value, [], 0);
        }

        return $value;
    }

    public function getStyleSheets(): array
    {
        $sheets = [];
        $settings = $this->getSettings();
        foreach ($settings as $setting) {
            if ($setting['_typoScriptNodeValue'] !== CssIconProvider::class) {
                continue;
            }

            // do add ../ to path if include from extension
            if (strpos($setting['file'], 'EXT:') === 0) {
                $sheets[] = $setting['file'];
                continue;
            }

            $sheets[] = '../' . $setting['file'];
        }
        return $sheets;
    }
}
